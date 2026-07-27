use std::future::IntoFuture;

use anyhow::{Context, Result};
use next_core::{
    app_structure::FileSystemPathVec, middleware::get_middleware_module,
    next_manifests::MiddlewaresManifestV2,
};
use tracing::Instrument;
use turbo_rcstr::RcStr;
use turbo_tasks::{Completion, ResolvedVc, Vc};
use turbo_tasks_fs::{self, File, FileContent, FileSystemPath};
use turbopack_core::{
    asset::AssetContent,
    chunk::{ChunkingContextExt, EntryChunkGroupResult},
    context::AssetContext,
    module::Module,
    module_graph::{
        GraphEntries,
        chunk_group_info::{ChunkGroup, ChunkGroupEntry, EntryHeuristics},
    },
    output::{OutputAsset, OutputAssets},
    reference_type::{EntryReferenceSubType, ReferenceType},
    source::Source,
    virtual_output::VirtualOutputAsset,
};

use crate::{
    nft::{EndpointTraceResult, trace_endpoint},
    nft_json::NftJsonAsset,
    paths::{all_asset_paths, all_paths_in_root},
    project::Project,
    route::{Endpoint, EndpointOutput, EndpointOutputPaths, ModuleGraphs},
};

#[turbo_tasks::value]
pub struct MiddlewareEndpoint {
    project: ResolvedVc<Project>,
    asset_context: ResolvedVc<Box<dyn AssetContext>>,
    source: ResolvedVc<Box<dyn Source>>,
    app_dir: Option<FileSystemPath>,
    ecmascript_client_reference_transition_name: Option<RcStr>,
}

#[turbo_tasks::value_impl]
impl MiddlewareEndpoint {
    #[turbo_tasks::function]
    pub fn new(
        project: ResolvedVc<Project>,
        asset_context: ResolvedVc<Box<dyn AssetContext>>,
        source: ResolvedVc<Box<dyn Source>>,
        app_dir: Option<FileSystemPath>,
        ecmascript_client_reference_transition_name: Option<RcStr>,
    ) -> Vc<Self> {
        Self {
            project,
            asset_context,
            source,
            app_dir,
            ecmascript_client_reference_transition_name,
        }
        .cell()
    }

    #[turbo_tasks::function]
    async fn entry_module(&self) -> Result<Vc<Box<dyn Module>>> {
        let userland_module = self
            .asset_context
            .process(
                *self.source,
                ReferenceType::Entry(EntryReferenceSubType::Middleware),
            )
            .module();

        Ok(get_middleware_module(
            *self.asset_context,
            self.project.project_path().owned().await?,
            userland_module,
            self.project.next_config(),
        ))
    }

    #[turbo_tasks::function]
    async fn node_chunk(self: Vc<Self>) -> Result<Vc<Box<dyn OutputAsset>>> {
        let this = self.await?;

        let chunking_context = this.project.server_chunking_context(false);

        let userland_module = self.entry_module().to_resolved().await?;
        let module_graph = this.project.module_graph(*userland_module);

        let EntryChunkGroupResult { asset: chunk, .. } = *chunking_context
            .root_entry_chunk_group(
                this.project
                    .node_root()
                    .await?
                    .join("server/middleware.js")?,
                ChunkGroup::Entry(vec![userland_module]),
                module_graph,
                OutputAssets::empty(),
                OutputAssets::empty(),
            )
            .await?;
        Ok(*chunk)
    }

    #[turbo_tasks::function]
    async fn output_assets(self: Vc<Self>) -> Result<Vc<OutputAssets>> {
        let this = self.await?;
        let chunk = self.node_chunk().to_resolved().await?;
        let mut output_assets = vec![chunk];
        if *this.project.should_write_nft_manifests().await? {
            output_assets.push(ResolvedVc::upcast(
                NftJsonAsset::new(*this.project, None, *chunk, vec![], self.trace_result())
                    .to_resolved()
                    .await?,
            ));
        }
        let middleware_manifest_v2 = MiddlewaresManifestV2 {
            middleware: [].into_iter().collect(),
            ..Default::default()
        };
        let middleware_manifest_v2 = VirtualOutputAsset::new(
            this.project
                .node_root()
                .await?
                .join("server/middleware/middleware-manifest.json")?,
            AssetContent::file(
                FileContent::Content(File::from(serde_json::to_string_pretty(
                    &middleware_manifest_v2,
                )?))
                .cell(),
            ),
        )
        .to_resolved()
        .await?;
        output_assets.push(ResolvedVc::upcast(middleware_manifest_v2));

        Ok(Vc::cell(output_assets))
    }

    #[turbo_tasks::function]
    fn userland_module(&self) -> Vc<Box<dyn Module>> {
        self.asset_context
            .process(
                *self.source,
                ReferenceType::Entry(EntryReferenceSubType::Middleware),
            )
            .module()
    }

    #[turbo_tasks::function]
    async fn trace_result(self: Vc<Self>) -> Result<Vc<EndpointTraceResult>> {
        let this = self.await?;
        let userland_module = self.entry_module().to_resolved().await?;
        Ok(trace_endpoint(
            *this.project,
            None,
            this.project.module_graph(*userland_module),
            Vc::cell(vec![userland_module]),
        ))
    }
}

#[turbo_tasks::value_impl]
impl Endpoint for MiddlewareEndpoint {
    #[turbo_tasks::function]
    async fn output(self: ResolvedVc<Self>) -> Result<Vc<EndpointOutput>> {
        let span = tracing::info_span!("middleware endpoint");
        async move {
            let this = self.await?;
            let output_assets = self.output_assets();
            let chunk = self.node_chunk().to_resolved().await?;
            let node_root = this.project.node_root().owned().await?;
            let server_entry_path = node_root
                .get_path_to(&*chunk.path().await?)
                .context("Proxy entry path must be inside the node root")?
                .into();

            let (server_paths, client_paths) = if this.project.next_mode().await?.is_development() {
                let server_paths = all_asset_paths(output_assets, node_root.clone(), None)
                    .owned()
                    .await?;

                // Middleware could in theory have a client path (e.g. `new URL`).
                let client_relative_root = this.project.client_relative_path().owned().await?;
                let client_paths = all_paths_in_root(output_assets, client_relative_root)
                    .into_future()
                    .owned()
                    .instrument(tracing::info_span!("client_paths"))
                    .await?;
                (server_paths, client_paths)
            } else {
                (vec![], vec![])
            };

            Ok(EndpointOutput {
                output_paths: EndpointOutputPaths::NodeJs {
                    server_entry_path,
                    server_paths,
                    client_paths,
                }
                .resolved_cell(),
                output_assets: output_assets.to_resolved().await?,
                project: this.project,
            }
            .cell())
        }
        .instrument(span)
        .await
    }

    #[turbo_tasks::function]
    async fn server_changed(self: Vc<Self>) -> Result<Vc<Completion>> {
        Ok(self.await?.project.server_changed(self.output_assets()))
    }

    #[turbo_tasks::function]
    fn client_changed(self: Vc<Self>) -> Vc<Completion> {
        Completion::immutable()
    }

    #[turbo_tasks::function]
    async fn entries(self: Vc<Self>) -> Result<Vc<GraphEntries>> {
        Ok(
            GraphEntries::from_chunk_groups(vec![ChunkGroupEntry::Entry {
                modules: vec![self.entry_module().to_resolved().await?],
                // Middleware runs on (potentially) all routes, so treat it as high priority.
                heuristics: EntryHeuristics::high_priority(),
            }])
            .cell(),
        )
    }

    #[turbo_tasks::function]
    async fn module_graphs(self: Vc<Self>) -> Result<Vc<ModuleGraphs>> {
        let this = self.await?;
        let module_graph = this
            .project
            .module_graph(self.entry_module())
            .to_resolved()
            .await?;
        Ok(Vc::cell(vec![module_graph]))
    }

    #[turbo_tasks::function]
    fn project(&self) -> Vc<Project> {
        *self.project
    }

    #[turbo_tasks::function]
    fn traced_files(self: Vc<Self>) -> Vc<FileSystemPathVec> {
        self.trace_result().all_files()
    }
}
