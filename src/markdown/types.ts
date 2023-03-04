import type { MarkdownSfcBlocks } from '@mdit-vue/plugin-sfc';
import type { MarkdownItEnv } from '@mdit-vue/types';
import type { SFCOptions } from '@vue/repl';
// import type { PageFrontmatter, PageHeader } from '@vuepress/shared';
import type MarkdownIt from 'markdown-it';
import type { CompilerOptions } from 'typescript';
import type {
  AnchorPluginOptions,
  AssetsPluginOptions,
  CodePluginOptions,
  EmojiPluginOptions,
  FrontmatterPluginOptions,
  HeadersPluginOptions,
  ImportCodePluginOptions,
  LinksPluginOptions,
  SfcPluginOptions,
  TocPluginOptions
} from './plugins';

export type Markdown = MarkdownIt;
export type { MarkdownSfcBlocks };

export interface MarkdownOptions extends MarkdownIt.Options {
  anchor?: false | AnchorPluginOptions;
  assets?: false | AssetsPluginOptions;
  code?: false | CodePluginOptions;
  component?: false;
  emoji?: false | EmojiPluginOptions;
  frontmatter?: false | FrontmatterPluginOptions;
  headers?: false | HeadersPluginOptions;
  title?: false;
  importCode?: false | ImportCodePluginOptions;
  links?: false | LinksPluginOptions;
  sfc?: false | SfcPluginOptions;
  slugify?: MarkdownSlugifyFunction;
  toc?: false | TocPluginOptions;
  container?: false | any;
}

/**
 * Headers in markdown file
 */
export type MarkdownHeader = any;

/**
 * Internal links in markdown file
 *
 * Used for file existence check
 */
export interface MarkdownLink {
  raw: string;
  relative: string;
  absolute: string;
}

/**
 * The `env` object to be passed to markdown-it render function
 *
 * Input some meta data for markdown file parsing and rendering
 *
 * Output some resources from the markdown file
 */
export interface MarkdownEnv extends MarkdownItEnv {
  // Input

  /**
   * Base / publicPath of current site
   */
  base?: string;

  /**
   * Absolute file path of the markdown file
   */
  filePath?: string | null;

  /**
   * Relative file path of the markdown file
   */
  filePathRelative?: string | null;

  /**
   * Frontmatter of the markdown file
   */
  frontmatter?: any;

  // Output

  /**
   * Imported file that extracted by importCodePlugin
   */
  importedFiles?: string[];

  /**
   * Links that extracted by linksPlugin
   */
  links?: MarkdownLink[];
}

/**
 * Type of `slugify` function
 */
export type MarkdownSlugifyFunction = (str: string) => string;

export interface PlaygroundCodeConfig {
  /**
   * Code block extension
   *
   * @description It's based on filename, not code fence language
   *
   * 代码块扩展名
   *
   * @description 它基于文件名，而不是代码块语言
   */
  ext: string;

  /**
   * Code block content
   *
   * 代码块内容
   */
  content: string;
}

export interface PlaygroundData {
  /**
   * Title of Playground
   *
   * 交互演示标题
   */
  title?: string;

  /**
   * Import map file name
   *
   * Import map 文件名
   *
   * @default "import-map.json"
   */
  importMap?: string;

  /**
   * Playground files info
   *
   * 交互演示文件信息
   */
  files: Record<
    /**
     * File name
     *
     * 文件名
     */
    string,
    /**
     * File detail
     *
     * 文件详情
     */
    PlaygroundCodeConfig
  >;

  /**
   * Playground settings
   *
   * @description It's parsed result of json content after setting directive
   *
   * 交互演示设置
   *
   * @description 它是设置指令后的 json 内容的解析结果
   */
  settings: Record<string, unknown>;

  /**
   * hash key based on playground content
   *
   * 根据交互演示内容生成的 hash key
   */
  key: string;
}

export interface PlaygroundOptions {
  /**
   * Playground container name
   *
   * 交互演示容器名
   */
  name: string;

  /**
   * Playground component name
   *
   * 交互演示组件名称
   *
   * @default "Playground"
   */
  component?: string;

  /**
   * Props getter
   *
   * 属性获取器
   */
  propsGetter: (data: PlaygroundData) => Record<string, string>;
}

export interface TSPresetPlaygroundOptions extends CompilerOptions {
  /**
   * external playground service url
   *
   * 交互演示外部地址
   *
   * @default "https://www.typescriptlang.org/play"
   */
  service?: string;
}

export interface VuePresetPlaygroundOptions {
  /**
   * external playground service url
   *
   * 交互演示外部地址
   *
   * @default "https://sfc.vuejs.org/"
   */
  service?: string;

  /**
   * Whether to use dev version
   *
   * 是否启用开发版本
   *
   * @default false
   */
  dev?: boolean;

  /**
   * Whether to enable SSR
   *
   * 是否启用 SSR
   *
   * @default false
   */
  ssr?: boolean;
}

/**
 * Vue Playground options
 *
 * @description Vue playground is using [`@vue/repl`](https://github.com/vuejs/repl)
 *
 * Vue 交互演示配置
 *
 * @description Vue playground 使用 [`@vue/repl`](https://github.com/vuejs/repl)
 */
export interface VuePlaygroundOptions {
  /**
   * Whether to show code in playground
   *
   * 是否在交互演示中显示代码
   *
   * @default false
   */
  showCode?: boolean;

  /**
   * specify the version of vue
   *
   * 指定 vue 版本
   */
  vueVersion?: string;

  /**
   * specify default URL to import Vue runtime from in the sandbox
   *
   * 指定默认的 Vue 运行时
   *
   * @default "https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js"
   */
  defaultVueRuntimeURL?: string;

  /**
   * Specify default URL to import Vue Server Renderer from in the sandbox
   *
   * 指定默认的 Vue 服务端渲染器
   *
   * @default "https://unpkg.com/@vue/server-renderer@${version}/dist/server-renderer.esm-browser.js"
   */
  defaultVueServerRendererURL?: string;

  /**
   * Whether to enable repl's editor resizable
   *
   * 是否启用自动调整大小
   *
   * @default true
   */
  autoResize?: boolean;

  /**
   * Whether to show JS, CSS, SSR panel
   *
   * 是否显示 JS, CSS, SSR 面板
   *
   * @default false
   */
  showCompileOutput?: boolean;

  /**
   * Whether to show import map
   *
   * 是否显示 import map
   *
   * @default true
   */
  showImportMap?: boolean;

  /**
   * Whether to clear console
   *
   * 是否清空控制台
   *
   * @default false
   */
  clearConsole?: boolean;

  /**
   * Layout
   *
   * 布局
   *
   * @default "vertical"
   */
  layout?: 'vertical' | 'horizontal';

  /**
   * Options to configure the `vue/compiler-sfc`
   *
   * `vue/compiler-sfc` 配置项
   */
  sfcOptions?: SFCOptions;

  /**
   * Whether to enable SSR
   *
   * 是否启用 SSR
   *
   * @default true
   */
  ssr?: boolean;
}
