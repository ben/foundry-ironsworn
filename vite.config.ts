import type { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const PORT = 30000

const config: UserConfig = {
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
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
          return chunkInfo.name
        },
      },
    },
  },
}

export default config
