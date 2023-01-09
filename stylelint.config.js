const { stylelint } = require('stylelint')

const commonConfigs = [
  /**
   * @see https://github.com/chaucerbao/stylelint-config-concentric-order
   */
  'stylelint-config-concentric-order',
  /**
   * @see https://github.com/prettier/stylelint-config-prettier
   */
  'stylelint-config-prettier',
]

/**
 * @type stylelint.Options
 */
const CONFIG = {
  extends: commonConfigs,
  plugins: [
    /**
     * @see https://github.com/Mavrin/stylelint-declaration-use-css-custom-properties
     */
    // FIXME Omitted for now because it's noisy. it'll be addressed in the SCSS migration PR.
    // '@mavrin/stylelint-declaration-use-css-custom-properties',
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      extends: [...commonConfigs, 'stylelint-config-recommended-vue'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
    {
      files: ['**/*.vue', '**/*.less'],
      rules: {
        // FIXME Omitted for now because it's noisy. it'll be addressed in the SCSS migration PR.
        // 'mavrin/stylelint-declaration-use-css-custom-properties': {
        //   /**
        //    * @see https://csstree.github.io/docs/syntax/
        //    */
        //   cssDefinitions: ['color', 'length'],
        //   ignoreProperties: ['/^\\@/'],
        //   ignoreValues: [
        //     '/\\@/',
        //     '/\\$/',
        //     'transparent',
        //     '/current[Cc]olor/',
        //     '0',
        //   ],
        // },
        'custom-property-pattern': '(ironsworn|font|color|fa)-.+',
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
