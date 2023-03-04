import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: 'src/main.ts',
    output: [
      {
        format: 'esm',
        entryFileNames: '[name].js',
        chunkFileNames: 'serve-[hash].js',
        dir: './es'
      },
      {
        format: 'cjs',
        entryFileNames: '[name].cjs',
        chunkFileNames: 'serve-[hash].cjs',
        dir: './cjs'
      }
    ],
    plugins: [resolve({ preferBuiltins: true }), esbuild({ target: 'node14' }), commonjs(), json()]
  }
];
