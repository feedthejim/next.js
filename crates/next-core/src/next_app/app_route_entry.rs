use anyhow::Result;
use turbo_rcstr::{RcStr, rcstr};
use turbo_tasks::{ResolvedVc, ValueToStringRef, Vc, fxindexmap};
use turbo_tasks_fs::FileSystemPath;
use turbopack::ModuleAssetContext;
use turbopack_core::{
    context::AssetContext,
    reference_type::{EntryReferenceSubType, ReferenceType},
    source::Source,
};

use crate::{
    next_app::{AppEntry, AppPage, AppPath},
    next_config::{NextConfig, OutputType},
    parse_segment_config_from_source,
    segment_config::{NextSegmentConfig, ParseSegmentMode},
    util::load_next_js_template,
};

/// Computes the entry for a Next.js app route.
/// # Arguments
///
/// * `original_segment_config` - A next segment config to be specified explicitly for the given
///   source.
/// For some cases `source` may not be the original but the handler (dynamic
/// metadata) which will lose segment config.
#[turbo_tasks::function]
pub async fn get_app_route_entry(
    nodejs_context: Vc<ModuleAssetContext>,
    source: Vc<Box<dyn Source>>,
    page: AppPage,
    project_root: FileSystemPath,
    original_segment_config: Option<Vc<NextSegmentConfig>>,
    next_config: Vc<NextConfig>,
) -> Result<Vc<AppEntry>> {
    let segment_from_source = parse_segment_config_from_source(source, ParseSegmentMode::App);
    let config = if let Some(original_segment_config) = original_segment_config {
        let mut segment_config = segment_from_source.owned().await?;
        segment_config.apply_parent_config(&*original_segment_config.await?);
        segment_config.cell()
    } else {
        segment_from_source
    };

    let module_asset_context = nodejs_context;
    let original_name: RcStr = page.to_string().into();
    let pathname: RcStr = AppPath::from(page.clone()).to_string().into();

    let ident = source.ident().await?;
    let path = &ident.path;
    let inner = rcstr!("INNER_APP_ROUTE");

    let output_type: &str = next_config
        .output()
        .await?
        .as_ref()
        .map(|o| match o {
            OutputType::Standalone => "\"standalone\"",
            OutputType::Export => "\"export\"",
        })
        .unwrap_or("\"\"");

    let virtual_source = load_next_js_template(
        "app-route.js",
        project_root,
        [
            ("VAR_DEFINITION_PAGE", &*page.to_string()),
            ("VAR_DEFINITION_PATHNAME", &pathname),
            ("VAR_DEFINITION_FILENAME", path.file_stem().unwrap()),
            ("VAR_DEFINITION_BUNDLE_PATH", ""),
            ("VAR_RESOLVED_PAGE_PATH", &path.to_string_ref().await?),
            ("VAR_USERLAND", &inner),
        ],
        [("nextConfigOutput", output_type)],
        [],
    )
    .await?;

    let userland_module = module_asset_context
        .process(
            source,
            ReferenceType::Entry(EntryReferenceSubType::AppRoute),
        )
        .module()
        .to_resolved()
        .await?;

    let inner_assets = fxindexmap! {
        inner => userland_module
    };

    let rsc_entry = module_asset_context
        .process(
            virtual_source,
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
