use std::io::Write;

use anyhow::Result;
use turbo_rcstr::RcStr;
use turbo_tasks::{ResolvedVc, Vc};
use turbo_tasks_fs::{File, FileContent, FileSystemPath, rope::RopeBuilder};
use turbopack::ModuleAssetContext;
use turbopack_core::{
    asset::{Asset, AssetContent},
    context::AssetContext,
    reference_type::ReferenceType,
    source::Source,
    virtual_source::VirtualSource,
};
use turbopack_ecmascript::runtime_functions::{TURBOPACK_LOAD, TURBOPACK_REQUIRE};

use crate::{
    app_page_loader_tree::AppPageLoaderTreeModule,
    app_structure::AppPageLoaderTree,
    next_app::{AppPage, AppPath, app_entry::AppEntry},
    next_config::NextConfig,
    next_server_component::NextServerComponentTransition,
    parse_segment_config_from_loader_tree,
    util::{file_content_rope, load_next_js_template},
};

/// Computes the entry for a Next.js app page.
#[turbo_tasks::function]
pub async fn get_app_page_entry(
    nodejs_context: ResolvedVc<ModuleAssetContext>,
    loader_tree: Vc<AppPageLoaderTree>,
    page: AppPage,
    project_root: FileSystemPath,
    next_config: Vc<NextConfig>,
) -> Result<Vc<AppEntry>> {
    let config = parse_segment_config_from_loader_tree(loader_tree);
    let module_asset_context = nodejs_context;

    let server_component_transition =
        ResolvedVc::upcast(NextServerComponentTransition::new().to_resolved().await?);

    let base_path = next_config.base_path().owned().await?;
    let loader_tree = AppPageLoaderTreeModule::build(
        loader_tree,
        module_asset_context,
        server_component_transition,
        base_path,
    )
    .await?;

    let AppPageLoaderTreeModule {
        inner_assets,
        imports,
        loader_tree_code,
    } = loader_tree;

    let mut result = RopeBuilder::default();

    for import in imports {
        writeln!(result, "{import}")?;
    }

    let original_name: RcStr = page.to_string().into();
    let pathname: RcStr = AppPath::from(page.clone()).to_string().into();

    let source = load_next_js_template(
        "app-page.js",
        project_root,
        [
            ("VAR_DEFINITION_PAGE", &*page.to_string()),
            ("VAR_DEFINITION_PATHNAME", &pathname),
        ],
        [
            ("tree", &*loader_tree_code),
            ("__next_app_require__", &TURBOPACK_REQUIRE.bound()),
            ("__next_app_load_chunk__", &TURBOPACK_LOAD.bound()),
        ],
        [],
    )
    .await?;

    let source_content = &*file_content_rope(source.content().file_content()).await?;
    result.concat(source_content);

    let query = qstring::QString::new(vec![("page", page.to_string())]);
    let file = File::from(result.build());
    let source = VirtualSource::new_with_ident(
        source
            .ident()
            .owned()
            .await?
            .with_query(RcStr::from(format!("?{query}")))
            .into_vc(),
        AssetContent::file(FileContent::Content(file).cell()),
    );

    let rsc_entry = module_asset_context
        .process(
            Vc::upcast(source),
            ReferenceType::Internal(ResolvedVc::cell(inner_assets)),
        )
        .module();

    Ok(AppEntry {
        pathname,
        original_name,
        rsc_entry: rsc_entry.to_resolved().await?,
        config: config.to_resolved().await?,
    }
    .cell())
}
