import { slugify as defaultSlugify } from '@mdit-vue/shared';
import MarkdownIt from 'markdown-it';
import { include } from '@mdit/plugin-include';

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
  TocPluginOptions,
} from './plugins';
import {
  align,
  anchorPlugin,
  assetsPlugin,
  codePlugin,
  codeTabs,
  componentPlugin,
  emojiPlugin,
  figure,
  frontmatterPlugin,
  headersPlugin,
  highlight,
  hint,
  imgLazyload,
  imgMark,
  imgSize,
  importCodePlugin,
  linksPlugin,
  mark,
  normalDemo,
  reactDemo,
  sfcPlugin,
  sub,
  sup,
  tabs,
  titlePlugin,
  tocPlugin,
  vueDemo,
} from './plugins';
import { playground } from './plugins/extend/playground';
import { tasklist } from './plugins/extend/tasklist';
import { vuePlayground } from './plugins/extend/vuePlayground';
import type { Markdown, MarkdownOptions } from './types';

export const createMarkdownRenderer = ({
  anchor,
  assets,
  code,
  component,
  emoji,
  frontmatter,
  headers,
  title,
  importCode,
  links = {
    internalTag: 'RouterLink',
  },
  sfc,
  container,
  slugify = defaultSlugify,
  toc,
  ...markdownItOptions
}: MarkdownOptions = {}): Markdown => {
  const md = MarkdownIt({
    html: true,

    linkify: true,
    xhtmlOut: false,

    breaks: false,

    // 高亮函数，会返回转义的HTML
    highlight,
    ...markdownItOptions,
  });

  if (anchor !== false) {
    md.use<AnchorPluginOptions>(anchorPlugin, {
      level: [1, 2, 3, 4, 5, 6],
      slugify,
      permalink: anchorPlugin.permalink.ariaHidden({
        class: 'header-anchor',
        symbol: '#',
        space: true,
        placement: 'before',
      }),
      ...anchor,
    });
  }

  if (assets !== false) {
    md.use<AssetsPluginOptions>(assetsPlugin, assets);
  }

  // process code fence
  if (code !== false) {
    md.use<CodePluginOptions>(codePlugin, code);
  }

  // treat unknown html tags as components
  if (component !== false) {
    md.use(componentPlugin);
  }

  // parse emoji
  if (emoji !== false) {
    md.use<EmojiPluginOptions>(emojiPlugin, emoji);
  }

  // extract frontmatter into env
  if (frontmatter !== false) {
    md.use<FrontmatterPluginOptions>(frontmatterPlugin, {
      ...frontmatter,
      grayMatterOptions: {
        excerpt: false,
        ...frontmatter?.grayMatterOptions,
      },
    });
  }

  // extract headers into env
  if (headers !== false) {
    md.use<HeadersPluginOptions>(headersPlugin, {
      level: [2, 3],
      slugify,
      ...headers,
    });
  }

  // handle import_code syntax
  if (importCode !== false) {
    md.use<ImportCodePluginOptions>(importCodePlugin, importCode);
  }

  // process external and internal links
  if (links !== false) {
    md.use<LinksPluginOptions>(linksPlugin, links);
  }

  // extract vue SFC blocks into env
  if (sfc !== false) {
    md.use<SfcPluginOptions>(sfcPlugin, sfc);
  }

  // allow toc syntax
  if (toc !== false) {
    md.use<TocPluginOptions>(tocPlugin, {
      level: [2, 3],
      slugify,
      linkTag: 'router-link',
      ...toc,
    });
  }

  // extract title into env
  if (title !== false) {
    md.use(titlePlugin);
  }
  md.use(mark);
  md.use(hint);
  md.use(tabs);
  md.use(codeTabs);
  md.use(sub);
  md.use(sup);
  md.use(align);
  md.use(figure);
  md.use(imgSize);
  md.use(imgMark);
  md.use(imgLazyload);
  md.use(tasklist);
  md.use(playground);
  md.use(vuePlayground);
  md.use(normalDemo);
  md.use(reactDemo);
  md.use(vueDemo);
  md.use(include, {
    currentPath: (env: any) => env.filePath,
  });

  const render = md.render;
  const wrappedRender = (src: string) => {
    const html = render.call(md, src);
    return {
      html,
      data: {},
    };
  };
  md.render = wrappedRender as any;

  return md;
};
