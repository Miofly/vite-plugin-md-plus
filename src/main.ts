import { createMarkdownRenderer } from './markdown/markdown';
import type { Plugin } from 'vite';

async function createMarkdown(options: any) {
  const { markdown = {} } = options;
  
  const md = await createMarkdownRenderer(markdown);
  if (options.markdown && options.markdown.init) options.markdown.init({ md });

  return (source: string, file: string) => {
    const { transforms = {} } = options;
    let result = source;

    if (transforms.before) source = transforms.before({ source, file, md });

    if (transforms.render) {
      result = transforms.render({ source, file, md });
    } else {
      result = md.render(source);
    }

    if (transforms.after) result = transforms.after({ result, source, file, md });
    
    return result;
  };
}

async function markdownPlugin(userOptions = {}): Plugin {
  const mdRender = await createMarkdown(userOptions);

  return {
    name: 'vite-plugin-md-plus',
    enforce: 'pre',

    transform(raw, id) {
      if (!id.endsWith('.md')) return null;
      return mdRender(raw, id);
    }
  };
}

export default function vitePluginTdoc(options: {}) {
  return [markdownPlugin(options)];
}
