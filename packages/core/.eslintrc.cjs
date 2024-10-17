const { configure, presets } = require('eslint-kit')
const path = require('node:path')

module.exports = configure({
  allowDebug: process.env.NODE_ENV !== 'production',
  extends: path.resolve(__dirname, '../../base.eslintrc.cjs'),
  extend: {
    parserOptions: {
      project: path.resolve(__dirname, 'tsconfig.json'),
    },
  },
  presets: [
    presets.effector(),
    presets.imports({
      sort: { newline: true },
      alias: { root: __dirname, paths: { '@': './src' } },
    }),
  ],
})
