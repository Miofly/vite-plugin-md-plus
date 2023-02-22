import type Token from 'markdown-it/lib/token';

export interface FootNoteToken extends Token {
  meta: {
    id: number;
    subId: number;
    label: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FootNoteEnv extends Record<any, any> {
  docId?: string;
  footnotes: {
    label?: string;
    refs?: Record<string, number>;
    list?: {
      label?: string;
      count?: number;
      content?: string;
      tokens?: Token[] | null;
    }[];
  };
}
