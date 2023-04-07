import { buildShortUUID } from '@vft/utils';
import { formatToDateTime } from '@vft/utils';
import matter from 'gray-matter';
import os from 'os';
import * as process from 'process';
import { createMarkdownRenderer } from './markdown/markdown';
import fs from 'fs-extra';
import path, { join, basename } from 'path';

async function createMarkdown (options: any) {
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

async function markdownPlugin (userOptions = {}) {
  const mdRender = await createMarkdown(userOptions);

  return {
    name: 'vite-plugin-md-plus',
    enforce: 'pre',
    transform (raw: string, id: string) {
      if (!id.endsWith('.md')) return null;
      return mdRender(raw, id);
    },
    resolveId (id: any) {
      if (!id.endsWith('.md')) return null;

      const filePath = join(process.cwd(), id);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const frontMatter = matter(fileContent, {});

      if (Object.keys(frontMatter.data).length === 0) {
        // const dateStr = dateFormat(getBirthtime(stat)); // 文件的创建时间
        const stat = fs.statSync(filePath);

        const category = getcategory(filePath);
        let cateLabelStr = '';
        category.forEach((item) => {
          cateLabelStr += os.EOL + '  - ' + item;
        });

        let cateStr;
        let title;
        let tagsStr;
        let path;
        const fileTitleArr = basename(filePath).split('.');
        if (fileTitleArr?.length > 2) {
          title = fileTitleArr[1];
          tagsStr = `
tags:
  - `;
          path = buildShortUUID(10);
          cateStr = cateLabelStr ? os.EOL + 'category:' + cateLabelStr : '';
        } else {
          title = fileTitleArr[0];
          tagsStr = '';
          path = fileTitleArr[0];
          cateStr = cateLabelStr ? os.EOL + 'category:' + os.EOL + '  - ' + 'api' + cateLabelStr : '';
        }

        const fmData = `---
title: ${title}
date: ${formatToDateTime(stat.ctime)}
path: /pages/${path}${cateStr}${tagsStr}
---\n`;
        fs.writeFileSync(filePath, `${fmData}${frontMatter.content}`); // 写入
      }
    }
  };
}

function getcategory (filePath: string) {
  const category = [];

  const filePathArr = filePath.split(path.sep); // path.sep用于兼容不同系统下的路径斜杠
  filePathArr.pop();

  let ind = filePathArr.indexOf('docs');
  if (ind !== -1) {
    while (filePathArr[++ind] !== undefined) {
      const item = filePathArr[ind];
      const firstDotIndex = item.indexOf('.');
      category.push(item.substring(firstDotIndex + 1) || ''); // 获取分类
      // category.push(filePathArr[ind].split('.').pop()) // 获取分类
    }
  }
  return category;
}

export default function vitePluginTdoc (options: {}) {
  return [markdownPlugin(options)];
}
