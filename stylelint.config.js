const { stylelint } = require('stylelint')

/**
 * @type stylelint.options
 */
const CONFIG = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  overrides: [
    {
      files: ['**/*.vue', '**/*.scss'],
      rules: {
        'max-line-length': [120, { ignore: ['comments'] }],
        'no-descending-specificity': null,
        'string-quotes': ['single'],
        'selector-class-pattern': [
          /^(ironsworn__)?[a-z][a-z-0-9]*[a-z0-9]$/,
          {
            resolveNestedSelectors: true,
          },
        ],
      },
    },
  ],
}

module.exports = CONFIG
