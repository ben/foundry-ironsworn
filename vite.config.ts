import type { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import Inspector from 'vite-plugin-vue-inspector'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import sassChroma from './src/module/plugin/sass-chroma-js'
import * as sass from 'sass'

const PORT = 30000

const sassOptions: sass.LegacyStringOptions<'sync'> = {
  functions: sassChroma,
  // @ts-ignore
  additionalData: `
              @use "${path.resolve(
                __dirname,
                'src/styles/mixins.scss'
              )}" as mixins;
            `,
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
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@components': path.resolve(__dirname, 'src/module/vue/components'),
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
    preprocessorOptions: {
      scss: sassOptions,
    },
    postcss: {
      plugins: [autoprefixer()],
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
