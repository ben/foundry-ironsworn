import type { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const config: UserConfig = {
  plugins: [vue()],
  publicDir: 'system',
  base: '/systems/foundry-ironsworn/',
  server: {
    port: 8080,
    proxy: {
      '^(?!/systems/foundry-ironsworn)': 'http://localhost:30000/',
      '/socket.io': {
        target: 'ws://localhost:30000',
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
  },
}

export default config
