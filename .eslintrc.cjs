const { configure, presets } = require('eslint-kit')

const eslintKitConfig = configure({
  allowDebug: process.env.NODE_ENV !== 'production',

  presets: [
    presets.imports(),
    presets.node(),
    presets.prettier(),
    presets.typescript(),
    presets.react(),
    presets.effector(),
  ],
})

module.exports = {
  ...eslintKitConfig,
  rules: {
    ...eslintKitConfig.rules,
    'react/no-unknown-property': ['off'],
  },
}
