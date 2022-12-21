import type { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import Inspector from 'vite-plugin-vue-inspector'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import sassSyntax from 'postcss-scss'
import sassPlugin from '@csstools/postcss-sass'
import tsconfigPaths from 'vite-tsconfig-paths'
import sass from 'sass'
import chromatic from './src/module/plugin/chromatic-sass'

const PORT = 30000

const sassOptions: sass.Options<'sync'> = {
  functions: chromatic,
  loadPaths: [path.resolve(process.cwd(), `src/styles`)],
}

const config: UserConfig = {
  root: './',
  plugins: [
    tsconfigPaths({
      loose: true,
    }),
    vue(),
    Inspector({ appendTo: 'src/index.ts', toggleComboKey: 'control-alt' }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'system/assets/icons')],
      symbolId: 'ironsworn-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  define: {
    'process.env': process.env,
  },
  publicDir: 'system',
  base: '/systems/foundry-ironsworn/',
  server: {
    port: 8080,
    proxy: {
      '^(?!/systems/foundry-ironsworn)': `http://localhost:${PORT}/`,
      '/socket.io': {
        target: `ws://localhost:${PORT}`,
        ws: true,
      },
    },
  },
  css: {
    postcss: {
      syntax: sassSyntax,
      plugins: [sassPlugin(sassOptions), autoprefixer()],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    reportCompressedSize: true,
    lib: {
      name: 'ironsworn',
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'ironsworn.js',
    },
    rollupOptions: {
      output: {
        assetFileNames(chunkInfo) {
          if (chunkInfo.name === 'style.css') return 'ironsworn.css'
          return chunkInfo.name || '(name)'
        },
      },
    },
  },
}

export default config
