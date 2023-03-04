import type { PluginSimple } from 'markdown-it';
import { tab } from './basic/tab';

export const tabs: PluginSimple = (md) => {
  tab(md, {
    name: 'tabs',

    tabsOpenRenderer: ({ active, data }, tokens, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { meta } = tokens[index];
      const tabData = data.map(({ title, id }) => ({
        title,
        ...(id ? { id } : {})
      }));

      return `<MdTabs id="${index}" :data='${
        // single quote will break @vue/compiler-sfc
        JSON.stringify(tabData).replace(/'/g, '&#39')
      }'${active !== -1 ? ` :active="${active}"` : ''}${
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        meta.id ? ` tab-id="${meta.id as string}"` : ''
      }>
`;
    },

    tabsCloseRenderer: () => `\
</MdTabs>
`,

    tabOpenRenderer: ({ index }) =>
      `\
<template #tab${index}="{ title, value, isActive }">
`,

    tabCloseRenderer: () => `\
</template>
`
  });
};
