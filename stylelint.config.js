const { stylelint } = require('stylelint')

/**
 * @type stylelint.Options
 */
const CONFIG = {
  extends: [
    'stylelint-config-standard-scss',
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
  overrides: [
    {
      files: ['**/*.vue', '**/*.scss'],

      rules: {
        'max-line-length': [120, { ignore: ['comments'] }],
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
