import type { DeflateOptions } from 'fflate';
// @ts-ignore
import { strFromU8, strToU8, zlibSync } from 'fflate/node';

export const utoa = (
  data: string,
  level: DeflateOptions['level'] = 6,
): string => {
  const buffer = strToU8(data);
  // zlib headers can be found at https://stackoverflow.com/a/54915442
  const zipped = zlibSync(buffer, { level });
  const binary = strFromU8(zipped, true);

  return Buffer.from(binary, 'binary').toString('base64');
};
export const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/gu;
