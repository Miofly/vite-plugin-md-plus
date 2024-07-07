import {
  resolveHeadersFromTokens,
  slugify as defaultSlugify,
} from '@mdit-vue/shared';
import type MarkdownIt from 'markdown-it';
import { createTocBlockRule } from './create-toc-block-rule';
import type { TocPluginOptions } from './types';

/**
 * Generate table of contents
 *
 * Forked and modified from markdown-it-toc-done-right:
 *
 * @see https://github.com/nagaozen/markdown-it-toc-done-right
 */
export const tocPlugin: MarkdownIt.PluginWithOptions<TocPluginOptions> = (
  md,
  {
    pattern = /^\[\[toc\]\]$/i,
    slugify = defaultSlugify,
    format,
    containerTag = 'nav',
    containerClass = 'table-of-contents',
  }: TocPluginOptions = {},
  callback?: Function,
): void => {
  // add toc syntax as a block rule
  md.block.ruler.before(
    'heading',
    'toc',
    createTocBlockRule({
      pattern,
      containerTag,
      containerClass,
    }),
    {
      alt: ['paragraph', 'reference', 'blockquote'],
    },
  );

  md.renderer.rules.toc_body = tokens => {
    const data = resolveHeadersFromTokens(tokens, {
      level: [2, 3, 4],
      shouldAllowHtml: true,
      shouldEscapeText: true,
      slugify,
      format,
    } as any);
    callback?.(data);
    return '';
  };
};
