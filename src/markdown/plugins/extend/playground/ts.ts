import { isPlainObject } from 'lodash-es';

import type {
  PlaygroundData,
  PlaygroundOptions,
  TSPresetPlaygroundOptions,
} from './types';
import { deepAssign } from '../../../utils/deepAssign';
import { compressToEncodedURIComponent } from './ventors/lzstring';
import { optionDeclarations } from './ventors/optionDelcarations';

/** Gets a query string representation (hash + queries) */
export const getURL = (code: string, compilerOptions = {}): string => {
  const hash = `#code/${compressToEncodedURIComponent(code)}`;

  const queryString = Object.entries(compilerOptions)
    .map(([key, value]) => {
      const item = optionDeclarations.find(option => option.name === key)!;

      if (!item || value === null || value === undefined) return '';

      const { type } = item;

      if (isPlainObject(type)) {
        const result: any = type[value as keyof typeof type];

        return result?.toString() || '';
      }

      return `${key}=${encodeURIComponent(value as string)}`;
    })
    .filter(value => value.length)
    .join('&');

  return `${queryString ? `?${queryString}` : ''}${hash}`;
};

export const getTSPlaygroundPreset = ({
  service = 'https://www.typescriptlang.org/play',
  ...compilerOptions
}: TSPresetPlaygroundOptions = {}): PlaygroundOptions => ({
  name: 'playground#ts',
  propsGetter: ({
    title = '',
    files,
    settings,
    key,
  }: PlaygroundData): Record<string, string> => {
    const tsfiles = Object.keys(files).filter(key => key.endsWith('.ts'));

    if (tsfiles.length !== 1)
      console.error('TS playground only support 1 ts file');

    const link = `${service}${getURL(
      files[tsfiles[0]].content,
      deepAssign({}, settings || {}, compilerOptions),
    )}`;

    return {
      key,
      title,
      link: encodeURIComponent(link),
    };
  },
});
