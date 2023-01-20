const { stylelint } = require('stylelint')

const commonConfigs = [
  'stylelint-config-standard',
  /**
   * @see https://github.com/chaucerbao/stylelint-config-concentric-order
   */
  'stylelint-config-concentric-order',
  /**
   * @see https://github.com/prettier/stylelint-config-prettier
   */
  'stylelint-config-prettier',
]

const commonPlugins = [
  /**
   * @see https://github.com/Mavrin/stylelint-declaration-use-css-custom-properties
   */
  '@mavrin/stylelint-declaration-use-css-custom-properties',
]

/**
 * @type {stylelint.Options}
 */
const CONFIG = {
  extends: commonConfigs,
  plugins: commonPlugins,
  overrides: [
    {
      files: ['**/*.vue', '**/*.less', '**/*.scss'],
      rules: {
        'mavrin/stylelint-declaration-use-css-custom-properties': {
          /**
           * @see https://csstree.github.io/docs/syntax/
           */
          cssDefinitions: ['color', 'length', 'z-index', 'line-height'],
          ignoreProperties: ['/^\\@/'],
          ignoreValues: [
            '/\\@/',
            '/\\$/',
            'transparent',
            'currentcolor',
            '0',
            '/.*\\s[0-9]+(\\.[0-9]+)?em(\\s.*)?/',
          ],
        },

        'import-notation': null,
        // FIXME workaround required for LESS to lint
        'no-invalid-position-at-import-rule': null,
        // FIXME workaround required for LESS to lint
        'function-no-unknown': null,
        // FIXME workaround required for LESS to lint
        'no-duplicate-at-import-rules': null,
        // FIXME workaround required for LESS to lint
        'no-invalid-double-slash-comments': null,
        // silence complaints about floating points (which are a temp workaround anyways)
        'number-max-precision': null,
        // silence complaints about longhand properties, because personally, i have trouble remembering the positional values
        'declaration-block-no-redundant-longhand-properties': null,
        // we have a bunch of these that are mainly so we don't have to go look up the dang class again
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
        'custom-property-pattern': '(ironsworn|font|color|fa|form-field)-.+',
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
      // Vue-specific configuration
      files: ['**/*.vue'],
      extends: [...commonConfigs, 'stylelint-config-recommended-vue'],
      customSyntax: 'postcss-html',
    },
    {
      // LESS-specific configuration
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],
}

module.exports = CONFIG
