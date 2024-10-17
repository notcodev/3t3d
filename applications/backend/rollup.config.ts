import { RollupOptions } from 'rollup'
import dts from 'rollup-plugin-dts'

const rollupConfig: RollupOptions = {
  input: './src/server.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es',
  },
  plugins: [dts({ tsconfig: './tsconfig.types.json' })],
}

export default rollupConfig
