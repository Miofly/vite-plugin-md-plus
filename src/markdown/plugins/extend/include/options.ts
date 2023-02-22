import type { IncludeEnv } from './types';

export interface MarkdownItIncludeOptions {
  /**
   * Get current filePath
   *
   * 获得当前文件路径
   *
   * @default (path) => path
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentPath: (env: IncludeEnv) => string;

  /**
   * handle include filePath
   *
   * 处理 include 文件路径
   *
   * @default (path) => path
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvePath?: (path: string, cwd: string | null) => string;

  /**
   * Whether deep include files in included Markdown files
   *
   * 是否深度导入包含的 Markdown 文件
   *
   * @default false
   */
  deep?: boolean;

  /**
   * Whether resolve the image related path in the included Markdown file
   *
   * 是否解析包含的 Markdown 文件的里的相对图像路径
   *
   * @default true
   */
  resolveImagePath?: boolean;

  /**
   * Whether resolve the related file link path in the included Markdown file
   *
   * 是否解析包含的 Markdown 文件的里的文件相对路径
   *
   * @default true
   */
  resolveLinkPath?: boolean;
}
