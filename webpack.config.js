/* eslint-disable */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')
const glob = require('glob')

const allTemplates = () => {
  return glob
    .sync('**/*.hbs', { cwd: path.join(__dirname, 'system/templates') })
    .map((file) => `"systems/foundry-ironsworn/templates/${file}"`)
    .join(', ')
}

const allVueComponents = () => {
  return glob
    .sync('**/*.vue', { cwd: path.join(__dirname, 'src/module/vue') })
    .map((file) => {
      const basename = path.basename(file).replace('.vue', '')
      const jsname = basename.replace(/[\W]/, '_')
      return `
        import ${jsname} from './${file}'
        Vue.component('${basename}', ${jsname})
      `
    })
    .join('\n')
}

module.exports = (env) => {
  const defaults = {
    watch: false,
    mode: 'development',
  }

  const environment = { ...defaults, ...env }
  const isDevelopment = environment.mode === 'development'

  const config = {
    entry: {
      ironsworn: './src/index.ts',
      vuecomponents: './src/module/vue/vuecomponents.ts',
    },
    watch: environment.watch,
    devtool: 'inline-source-map',
    mode: environment.mode,
    stats: 'minimal',
    resolve: {
      extensions: ['.wasm', '.mjs', '.ts', '.js', '.json', '.vue'],
      alias: {
        'Vue$': 'vue/dist/vue.esm.js'
      }
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/systems/foundry-ironsworn/',
    },
    optimization: {
      minimize: false
    },
    devServer: {
      hot: true,
      proxy: [
        {
          context: (pathname) => {
            return !pathname.match('^/sockjs')
          },
          target: 'http://localhost:30000',
          ws: true,
        },
      ],
    },
    module: {
      rules: [
        isDevelopment
          ? {
            test: /\.hbs$/,
            loader: 'raw-loader',
          }
          : {
            test: /\.hbs$/,
            loader: 'null-loader',
          },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
              // the "scss" and "sass" values for the lang attribute to the right configs here.
              // other preprocessors should work out of the box, no loader config like this necessary.
              scss: 'vue-style-loader!css-loader!sass-loader',
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            },
            // other vue-loader options go here
          },
        },
        {
          test: /vuecomponents\.ts$/,
          use: [
            {
              loader: 'string-replace-loader',
              options: {
                search: "// IMPORT_ALL_VUE_COMPONENTS",
                replace: allVueComponents,
              },
            },
          ],
        },
        {
          test: /\.ts$/,
          use: ['ts-loader', 'webpack-import-glob-loader', 'source-map-loader'],
        },
        {
          test: /templatepreloader\.ts$/,
          use: [
            {
              loader: 'string-replace-loader',
              options: {
                search: "'__ALL_TEMPLATES__'",
                replace: allTemplates,
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevelopment,
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: isDevelopment,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new ESLintPlugin({
        extensions: ['ts'],
      }),
      new CopyPlugin({
        patterns: [{ from: 'system' }],
      }),
    ],
  }

  if (!isDevelopment) {
    delete config.devtool
  }

  return config
}
