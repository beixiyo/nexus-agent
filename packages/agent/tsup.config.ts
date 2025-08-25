import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    cli: './src/agent/cli.ts',
    server: './src/server/index.ts',
  },
  outDir: 'dist',
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  bundle: true,
  sourcemap: false,
  dts: true,
  onSuccess: 'tsc-alias',

  /**
   * polyfill 一些 Node 特有的功能（如 __dirname、require）
   * 对于 ESM 格式，这些 Node 内置变量是没有的，设置 shims: true 会用兼容代码模拟这些行为
   */
  shims: true,
  target: 'node16',
  platform: 'node',

  plugins: [
    {
      name: 'build-notify',
      buildEnd() {
        console.log('Build completed')
      },
    },
  ],
})
