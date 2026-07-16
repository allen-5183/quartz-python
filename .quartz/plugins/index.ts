import { componentRegistry } from "../../quartz/components/registry"

export type { CreatedModifiedDateOptions } from "./created-modified-date"
export type { SyntaxHighlightingOptions } from "./syntax-highlighting"
export type { ObsidianFlavoredMarkdownOptions } from "./obsidian-flavored-markdown"
export type { ContentDetails, ContentIndexMap } from "./content-index"
export type { ImageOptions, SocialImageFileData, SocialImageOptions, UserOpts } from "./og-image"
export type { ContentPageOptions } from "./content-page"
export type { ExplorerOptions } from "./explorer"
export type { D3Config, GraphOptions } from "./graph"
export type { SearchField, SearchOptions } from "./search"
export type { BacklinksOptions } from "./backlinks"
export type { ContentMetaOptions } from "./content-meta"
export type { BreadcrumbOptions } from "./breadcrumbs"
export type { FooterOptions } from "./footer"
export type { GfmOptions } from "./github-flavored-markdown"
export type { TableOfContentsTransformerOptions, TocEntry } from "./table-of-contents"
export type { CrawlLinksOptions } from "./crawl-links"
export type { DescriptionOptions } from "./description"
export type { Args, LatexOptions } from "./latex"
export { tokenClassifierTransformer } from "./syntax-highlighting"
export { CustomOgImagesEmitterName } from "./og-image"
export { CanvasBackgroundStyle, CanvasColor, CanvasData, CanvasEdge, CanvasEnd, CanvasFileNode, CanvasGroupNode, CanvasLinkNode, CanvasNode, CanvasSide, CanvasTextNode, CanvasBody, CanvasFrame, CanvasPageOptions } from "./canvas-page"
export { ContentBody, ContentBodyOptions } from "./content-page"
export { FolderPage, FolderPageOptions, FolderContent } from "./folder-page"
export { TagPage, TagPageOptions, TagContent } from "./tag-page"
export { ContentMeta } from "./content-meta"
export { BasesEntry, BasesView, FilterNode, GroupBy, PropertyConfig, SortDirection, SummaryType, ViewRenderer, ViewRendererProps, ViewTypeRegistration, BasesBody, registerCustomViews, viewRegistry, compile, evaluate, evaluateFilter, resolvePropertyValue, BasesData, BasesPageOptions } from "./bases-page"
export { NotePropertiesComponent, NotePropertiesComponentOptions, NotePropertiesOptions } from "./note-properties"
export { ExcalidrawData, ExcalidrawElement, ExcalidrawBody, ExcalidrawFrame, ExcalidrawPageOptions } from "./obsidian-plugin-excalidraw"
export { TableOfContents } from "./table-of-contents"
export { FontFileEntry, FontSpecification, GoogleFontFile, ProcessedFontResult, QuartzFontRegistry, FontsEmitter, FontsOptions } from "./fonts"

export const plugins: Record<string, Record<string, (...args: unknown[]) => void>> = {
  "created-modified-date": {
    CreatedModifiedDate: (...args: unknown[]) => { componentRegistry.setOptionOverrides("created-modified-date", args[0] as Record<string, unknown>); },
  },
  "syntax-highlighting": {
    SyntaxHighlighting: (...args: unknown[]) => { componentRegistry.setOptionOverrides("syntax-highlighting", args[0] as Record<string, unknown>); },
  },
  "obsidian-flavored-markdown": {
    ObsidianFlavoredMarkdown: (...args: unknown[]) => { componentRegistry.setOptionOverrides("obsidian-flavored-markdown", args[0] as Record<string, unknown>); },
  },
  "alias-redirects": {
    AliasRedirects: (...args: unknown[]) => { componentRegistry.setOptionOverrides("alias-redirects", args[0] as Record<string, unknown>); },
  },
  "content-index": {
    ContentIndex: (...args: unknown[]) => { componentRegistry.setOptionOverrides("content-index", args[0] as Record<string, unknown>); },
  },
  "favicon": {
    Favicon: (...args: unknown[]) => { componentRegistry.setOptionOverrides("favicon", args[0] as Record<string, unknown>); },
  },
  "og-image": {
    CustomOgImages: (...args: unknown[]) => { componentRegistry.setOptionOverrides("og-image", args[0] as Record<string, unknown>); },
  },
  "cname": {
    CNAME: (...args: unknown[]) => { componentRegistry.setOptionOverrides("cname", args[0] as Record<string, unknown>); },
  },
  "canvas-page": {
    CanvasPage: (...args: unknown[]) => { componentRegistry.setOptionOverrides("canvas-page", args[0] as Record<string, unknown>); },
  },
  "content-page": {
    ContentPage: (...args: unknown[]) => { componentRegistry.setOptionOverrides("content-page", args[0] as Record<string, unknown>); },
  },
  "explorer": {
    Explorer: (...args: unknown[]) => { componentRegistry.setOptionOverrides("explorer", args[0] as Record<string, unknown>); },
  },
  "graph": {
    Graph: (...args: unknown[]) => { componentRegistry.setOptionOverrides("graph", args[0] as Record<string, unknown>); },
  },
  "search": {
    Search: (...args: unknown[]) => { componentRegistry.setOptionOverrides("search", args[0] as Record<string, unknown>); },
  },
  "backlinks": {
    Backlinks: (...args: unknown[]) => { componentRegistry.setOptionOverrides("backlinks", args[0] as Record<string, unknown>); },
  },
  "article-title": {
    ArticleTitle: (...args: unknown[]) => { componentRegistry.setOptionOverrides("article-title", args[0] as Record<string, unknown>); },
  },
  "page-title": {
    PageTitle: (...args: unknown[]) => { componentRegistry.setOptionOverrides("page-title", args[0] as Record<string, unknown>); },
  },
  "darkmode": {
    Darkmode: (...args: unknown[]) => { componentRegistry.setOptionOverrides("darkmode", args[0] as Record<string, unknown>); },
  },
  "reader-mode": {
    ReaderMode: (...args: unknown[]) => { componentRegistry.setOptionOverrides("reader-mode", args[0] as Record<string, unknown>); },
  },
  "breadcrumbs": {
    Breadcrumbs: (...args: unknown[]) => { componentRegistry.setOptionOverrides("breadcrumbs", args[0] as Record<string, unknown>); },
  },
  "footer": {
    Footer: (...args: unknown[]) => { componentRegistry.setOptionOverrides("footer", args[0] as Record<string, unknown>); },
  },
  "spacer": {
    Spacer: (...args: unknown[]) => { componentRegistry.setOptionOverrides("spacer", args[0] as Record<string, unknown>); },
  },
  "bases-page": {
    BasesPage: (...args: unknown[]) => { componentRegistry.setOptionOverrides("bases-page", args[0] as Record<string, unknown>); },
    BasesTransformer: (...args: unknown[]) => { componentRegistry.setOptionOverrides("bases-page", args[0] as Record<string, unknown>); },
  },
  "note-properties": {
    NoteProperties: (...args: unknown[]) => { componentRegistry.setOptionOverrides("note-properties", args[0] as Record<string, unknown>); },
  },
  "obsidian-plugin-excalidraw": {
    ExcalidrawPage: (...args: unknown[]) => { componentRegistry.setOptionOverrides("obsidian-plugin-excalidraw", args[0] as Record<string, unknown>); },
  },
  "github-flavored-markdown": {
    GitHubFlavoredMarkdown: (...args: unknown[]) => { componentRegistry.setOptionOverrides("github-flavored-markdown", args[0] as Record<string, unknown>); },
  },
  "table-of-contents": {
    TableOfContentsTransformer: (...args: unknown[]) => { componentRegistry.setOptionOverrides("table-of-contents", args[0] as Record<string, unknown>); },
  },
  "crawl-links": {
    CrawlLinks: (...args: unknown[]) => { componentRegistry.setOptionOverrides("crawl-links", args[0] as Record<string, unknown>); },
  },
  "description": {
    Description: (...args: unknown[]) => { componentRegistry.setOptionOverrides("description", args[0] as Record<string, unknown>); },
  },
  "latex": {
    Latex: (...args: unknown[]) => { componentRegistry.setOptionOverrides("latex", args[0] as Record<string, unknown>); },
  },
  "hard-line-breaks": {
    HardLineBreaks: (...args: unknown[]) => { componentRegistry.setOptionOverrides("hard-line-breaks", args[0] as Record<string, unknown>); },
  },
  "fonts": {
    Fonts: (...args: unknown[]) => { componentRegistry.setOptionOverrides("fonts", args[0] as Record<string, unknown>); },
  },
  "remove-draft": {
    RemoveDrafts: (...args: unknown[]) => { componentRegistry.setOptionOverrides("remove-draft", args[0] as Record<string, unknown>); },
  },
  "unlisted-pages": {
    UnlistedPages: (...args: unknown[]) => { componentRegistry.setOptionOverrides("unlisted-pages", args[0] as Record<string, unknown>); },
  },
}

export const CreatedModifiedDate = plugins["created-modified-date"].CreatedModifiedDate
export const SyntaxHighlighting = plugins["syntax-highlighting"].SyntaxHighlighting
export const ObsidianFlavoredMarkdown = plugins["obsidian-flavored-markdown"].ObsidianFlavoredMarkdown
export const AliasRedirects = plugins["alias-redirects"].AliasRedirects
export const ContentIndex = plugins["content-index"].ContentIndex
export const Favicon = plugins["favicon"].Favicon
export const CustomOgImages = plugins["og-image"].CustomOgImages
export const CNAME = plugins["cname"].CNAME
export const CanvasPage = plugins["canvas-page"].CanvasPage
export const ContentPage = plugins["content-page"].ContentPage
export const Explorer = plugins["explorer"].Explorer
export const Graph = plugins["graph"].Graph
export const Search = plugins["search"].Search
export const Backlinks = plugins["backlinks"].Backlinks
export const ArticleTitle = plugins["article-title"].ArticleTitle
export const PageTitle = plugins["page-title"].PageTitle
export const Darkmode = plugins["darkmode"].Darkmode
export const ReaderMode = plugins["reader-mode"].ReaderMode
export const Breadcrumbs = plugins["breadcrumbs"].Breadcrumbs
export const Footer = plugins["footer"].Footer
export const Spacer = plugins["spacer"].Spacer
export const BasesPage = plugins["bases-page"].BasesPage
export const BasesTransformer = plugins["bases-page"].BasesTransformer
export const NoteProperties = plugins["note-properties"].NoteProperties
export const ExcalidrawPage = plugins["obsidian-plugin-excalidraw"].ExcalidrawPage
export const GitHubFlavoredMarkdown = plugins["github-flavored-markdown"].GitHubFlavoredMarkdown
export const TableOfContentsTransformer = plugins["table-of-contents"].TableOfContentsTransformer
export const CrawlLinks = plugins["crawl-links"].CrawlLinks
export const Description = plugins["description"].Description
export const Latex = plugins["latex"].Latex
export const HardLineBreaks = plugins["hard-line-breaks"].HardLineBreaks
export const Fonts = plugins["fonts"].Fonts
export const RemoveDrafts = plugins["remove-draft"].RemoveDrafts
export const UnlistedPages = plugins["unlisted-pages"].UnlistedPages
