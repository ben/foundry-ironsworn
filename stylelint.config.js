const { stylelint } = require('stylelint')

/**
 * @type stylelint.Options
 */
const CONFIG = {
  extends: [
    /**
     * @see https://github.com/stylelint-scss/stylelint-config-standard-scss
     */
    'stylelint-config-standard-scss',
    /**
     * @see https://github.com/ota-meshi/stylelint-config-recommended-vue
     */
    'stylelint-config-recommended-vue/scss',
    /**
     * @see https://github.com/chaucerbao/stylelint-config-concentric-order
     */
    'stylelint-config-concentric-order',
    /**
     * @see https://github.com/prettier/stylelint-config-prettier-scss
     */
    'stylelint-config-prettier-scss',
  ],
  plugins: [
    /**
     * @see https://github.com/Mavrin/stylelint-declaration-use-css-custom-properties
     */
    '@mavrin/stylelint-declaration-use-css-custom-properties',
  ],
  overrides: [
    {
      files: ['./src/modules/vue/**/*.vue', './src/styles/**/*.scss'],
      rules: {
        // 'mavrin/stylelint-declaration-use-css-custom-properties': {
        //   /**
        //    * @see https://csstree.github.io/docs/syntax/
        //    */
        //   cssDefinitions: ['color', 'length'],
        //   ignoreProperties: ['/^\\$/'],
        //   ignoreValues: ['/\\$/', 'transparent', 'currentcolor', '0'],
        // },
        'custom-property-pattern': [/(ironsworn|font|fa|color)-/],
        'max-line-length': [120, { ignore: ['comments'] }],
        // *theoretically* this would be good to use, but i don't have the patience to do it right now
        'no-descending-specificity': null,
        'string-quotes': ['single'],
        'selector-class-pattern': [
          /^((ironsworn__|tox-[a-z+]__)?[a-z][a-z-0-9]*[a-z0-9])|ProseMirror$/,
          {
            resolveNestedSelectors: true,
          },
        ],
      },
    },
  ],
}

module.exports = CONFIG
