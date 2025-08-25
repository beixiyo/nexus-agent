import { fileURLToPath, URL } from 'node:url'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import manifest from './manifest.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    AutoImport({
      imports: ['react'],
      dts: './src/auto-imports.d.ts',
    }),
    crx({ manifest }),
    codeInspectorPlugin({
      bundler: 'vite',
      editor: 'cursor',
    }),
  ],
  define: {
    'process.env': {},
    'process.cwd': '""',
    'process.platform': '"browser"',
    'process.version': '"v18.0.0"',
    'process.versions': '{}',
    'process.browser': 'true',
    'process.node': 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url).href),
      },
    },
  },
})
