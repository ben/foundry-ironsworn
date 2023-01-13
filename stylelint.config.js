const { stylelint } = require('stylelint')

/**
 * @type {stylelint.Options}
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
      files: ['**/*.vue', '**/*.scss'],
      rules: {
        // 'scss/dollar-variable-no-missing-interpolation': [true],
        'scss/no-dollar-variables': [true],
        'mavrin/stylelint-declaration-use-css-custom-properties': {
          /**
           * @see https://csstree.github.io/docs/syntax/
           */
          cssDefinitions: ['color', 'length', 'z-index', 'line-height'],
          ignoreProperties: ['/^\\$/'],
          ignoreValues: [
            '/^\\$/',
            'transparent',
            'currentcolor',
            '0',
            '/^[0-9]+(\\.[0-9]+)?em$/',
            '/#\\{.+?\\}/',
          ],
        },
        // silence complaints about floating points (which are a temp workaround anyways)
        'number-max-precision': null,
        'declaration-block-no-redundant-longhand-properties': null,
        'block-no-empty': null,
        /**
         * Enforces consistent naming for CSS custom properties.
         *
         * `ironsworn` - Properties specific to this module. If you're adding a brand new property, it should have this.
         * `font` - FVTT font properties.
         * `color` - FVTT color properties.
         * `form-field` - FVTT form-field properties.
         * `fa` - FontAwesome properties.
         *
         * @example ```less
         * --ironsworn-custom-property: sqrt(2);
         * ```
         */
        'custom-property-pattern': /(ironsworn|font|color|fa|form-field)-.+/,
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
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}

module.exports = CONFIG
