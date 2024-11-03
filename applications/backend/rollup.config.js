import dts from 'rollup-plugin-dts'

export default {
  input: './src/server.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es',
  },
  plugins: [dts({ tsconfig: './tsconfig.types.json' })],
}
