import dts from 'rollup-plugin-dts'

const rollupConfig = {
  input: './src/server.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es',
  },
  plugins: [dts({ tsconfig: './tsconfig.types.json' })],
}

export default rollupConfig
