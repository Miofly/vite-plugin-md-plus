import { buildShortUUID, formatToDateTime } from '@vft/utils';
import fs from 'fs-extra';
import { basename, join, sep } from 'path';

/**
 * @description 生成 md 上方的信息
 * @example
 * @returns
 * @author wfd
 * @date 2024/5/20 11:39
 * @param id
 */
function generationFrontMatter(id) {
  if (!id.endsWith('.md')) return null;

  const filePath = join(id);

  const fileContent = fs.readFileSync(filePath, 'utf8');

  if (!/<route>[\s\S]*?<\/route>/.test(fileContent)) {
    // const dateStr = dateFormat(getBirthtime(stat)); // 文件的创建时间
    const stat = fs.statSync(filePath);

    const category = getCategory(filePath);

    let title;
    let path;
    const fileTitleArr = basename(filePath).split('.');
    if (fileTitleArr?.length > 2) {
      title = fileTitleArr[1];
      path = buildShortUUID(10);
    } else {
      title = fileTitleArr[0];
      path = fileTitleArr[0];
    }

    const fmData = `<route>
{
  path: '/pages/${path}',
  meta: {
    title: '${title}',
    date: '${formatToDateTime(stat.ctime)}',
    category: ${JSON.stringify(category)},
    tag: []
  }
}
</route>\n
[[toc]]
`;
    fs.writeFileSync(filePath, `${fmData}${fileContent}`); // 写入
  }
}

export function viteMdFrontMatter() {
  return {
    name: 'vite-add-md-info',
    enforce: 'pre',
    resolveId(id) {
      generationFrontMatter(id);
    },
  }
}

function getCategory(filePath: string) {
  const category: string[] = [];

  const filePathArr = filePath.split(sep); // path.sep用于兼容不同系统下的路径斜杠
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

export { generationFrontMatter };

export * from './markdown/plugins';
