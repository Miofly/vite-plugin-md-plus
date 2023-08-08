import type { PluginSimple } from 'markdown-it';
import { container } from './basic/container';

export const align: PluginSimple = md => {
  ['left', 'center', 'right', 'justify'].forEach(name =>
    md.use(md =>
      container(md, {
        name,
        openRender: () => `<div style="text-align:${name}">\n`
      })
    )
  );
};
