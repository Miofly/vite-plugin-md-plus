import { htmlEscape } from '@mdit-vue/shared';
import type { MarkdownItHeader } from '@mdit-vue/types';
import type { TocPluginOptions } from './types';

type RenderHeadersFn = (headers: MarkdownItHeader[], isChild?: boolean, level?: number) => string;

export const createRenderHeaders = ({
  listTag,
  listClass,
  itemClass,
  linkTag,
  linkClass
}: Pick<Required<TocPluginOptions>, 'listTag' | 'listClass' | 'itemClass' | 'linkTag' | 'linkClass'>): RenderHeadersFn => {
  const listTagString = htmlEscape(listTag);
  const listClassString = listClass ? ` class="${htmlEscape(listClass)}"` : '';
  const itemTagString = 'li';
  const itemClassString = itemClass ? htmlEscape(itemClass) : '';
  const linkTagString = htmlEscape(linkTag);
  const linkClassString = linkClass ? htmlEscape(linkClass) : '';
  const linkTo = (link: string): string => (linkTag === 'router-link' ? ` to="${link}"` : ` href="${link}"`);

  const renderHeaders: RenderHeadersFn = (headers, isChild, level = 0) => {
    const childClassString = isChild ? htmlEscape('level') + level : '';
    return `\
<${listTagString}${listClassString}>\
${headers
  .map(
    (header) => `\
<${itemTagString} class="${itemClassString}">\
<${linkTagString} class="${childClassString ? linkClassString + ' ' + childClassString : linkClassString}"  ${linkTo(header.link)}>\
${header.title}\
</${linkTagString}>\
${header.children.length > 0 ? renderHeaders(header.children, true, level + 1) : ''}\
</${itemTagString}>\
`
  )
  .join('')}\
</${listTagString}>`;
  };

  return renderHeaders;
};
