const { configure, presets } = require('eslint-kit')

module.exports = configure({
  allowDebug: process.env.NODE_ENV !== 'production',
  extends: '../../base.eslintrc.cjs',
  presets: [
    presets.effector(),
    presets.imports({
      sort: { newline: true },
      alias: { paths: { '@': 'src', '@drizzle': 'drizzle' } },
    }),
  ],
})
