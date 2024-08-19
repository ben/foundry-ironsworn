import type { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import Inspector from 'vite-plugin-vue-inspector'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import sassChroma from './src/module/plugin/sass-chroma-js'
import type Sass from 'sass'
import presetEnv from 'postcss-preset-env'
import { kebabCase } from 'lodash-es'
import cssnano from 'cssnano'
import sassIcons, { ICON_DIRS } from './src/module/plugin/custom-icons'
// import VueTypeImports from '@rah-emil/vite-plugin-vue-type-imports'

const PORT = 30000

const sassOptions: Sass.LegacyStringOptions<'sync'> = {
	functions: { ...sassChroma, ...sassIcons },
	// @ts-expect-error
	additionalData: ''
}

const config: UserConfig = {
	root: './',
	plugins: [
		vue(),
		// VueTypeImports(),
		// Inspector({ appendTo: 'src/index.ts', toggleComboKey: 'control-alt' }),
		createSvgIconsPlugin({
			customDomId: 'ironsworn-sprites',
			iconDirs: [
				path.resolve(process.cwd(), 'system/assets/icons'),

				path.resolve(process.cwd(), 'system/assets/misc')
			],
			symbolId: 'ironsworn-[dir]-[name]'
		})
	],
	resolve: {
		preserveSymlinks: true,
		alias: [
			{
				find: /^style:(.*)/,
				replacement: path.resolve(__dirname, 'src/styles', '$1')
			},
			{
				find: /^mixin:(.*)/,
				replacement: path.resolve(__dirname, 'src/styles/mixins', '$1')
			},
			{
				find: /^component:(.*)/,
				replacement: path.resolve(__dirname, 'src/module/vue/components', '$1')
			},
			{
				find: /^vue$/,
				replacement: 'vue/dist/vue.esm-bundler.js'
			}
		]
	},
	define: {
		'process.env': {}
	},
	publicDir: 'system',
	base: '/systems/foundry-ironsworn/',
	server: {
		port: 8080,
		proxy: {
			'^(?!/systems/foundry-ironsworn)': `http://localhost:${PORT}/`,
			'/socket.io': {
				target: `ws://localhost:${PORT}`,
				ws: true
			}
		}
	},

	css: {
		preprocessorOptions: {
			less: {
				rewriteUrls: 'local'
			},
			scss: sassOptions
		},
		postcss: {
			plugins: [presetEnv(), cssnano()]
		},
		modules: {
			generateScopedName(className, filename, _) {
				const [file] = path.basename(filename).split('.')
				return kebabCase(file) + '__' + kebabCase(className)
			}
		}
	},
	build: {
		assetsInlineLimit: 0,
		outDir: 'dist',
		emptyOutDir: true,
		sourcemap: true,
		reportCompressedSize: true,
		minify: false,
		lib: {
			name: 'ironsworn',
			entry: 'src/index.ts',
			formats: ['es'],
			fileName: () => 'ironsworn.js'
		},
		rollupOptions: {
			output: {
				assetFileNames(chunkInfo) {
					if (chunkInfo.name === 'style.css') return 'ironsworn.css'
					return chunkInfo.name || '(name)'
				}
			}
		}
	}
}

export default config
