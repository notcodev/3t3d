const { configure, presets } = require('eslint-kit')

const eslintKitConfig = configure({
  allowDebug: process.env.NODE_ENV !== 'production',
  extends: '../../base.eslintrc.cjs',
  presets: [presets.react(), presets.effector()],
})

module.exports = {
  ...eslintKitConfig,
  rules: {
    ...eslintKitConfig.rules,
    'react/no-unknown-property': ['off'],
  },
}
