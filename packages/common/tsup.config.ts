import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: './src/index.ts',
  },
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  bundle: true,
  sourcemap: false,
  dts: true,
  onSuccess: 'tsc-alias',
})
