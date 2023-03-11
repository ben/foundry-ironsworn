/**
 * @type {import('stylelint').Config}
 */
module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    /** @see https://github.com/pascalduez/stylelint-config-css-modules  */
    'stylelint-config-css-modules',
    /**
     * @see https://github.com/ota-meshi/stylelint-config-standard-vue
     */
    'stylelint-config-standard-vue/scss',

    /** This isn't required by newer versions of stylelint, but we're stuck with 14.3 for the moment.  */
    'stylelint-config-prettier',
    /**
     * Orders properties beginning with properties that exist outside the styled box (e.g. `margin`), with subsequent properties moving inwards from that. This way, properties that affect placement of sibling elements are always at the top.
     * @see https://github.com/chaucerbao/stylelint-config-concentric-order
     */
    'stylelint-config-concentric-order',
  ],
  plugins: [
    /**
     * This is the plugin that keeps us using stylelint 14.3 for now (and has a cascade effect on the versions of every other stylelint plugin). It makes it possible to require variables for properties *by the type of property value* (like length, color, etc).
     *
     * Other plugins I've found for requiring CSS variables usually need call out *individual properties* like `width`, `margin`, `background-color`, etc. Life's too short for that shit.
     *
     * @see https://github.com/Mavrin/stylelint-declaration-use-css-custom-properties
     */
    // FIXME: submit a PR to update this plugin for stylelint 15
    '@mavrin/stylelint-declaration-use-css-custom-properties',
  ],
  rules: {
    'mavrin/stylelint-declaration-use-css-custom-properties': {
      /**
       * @see https://csstree.github.io/docs/syntax/
       */
      cssDefinitions: ['color', 'length', 'z-index', 'line-height'],
      ignoreProperties: ['/^\\$/', '/^--/'],
      ignoreValues: [
        '/^\\$/',
        'transparent',
        'currentcolor',
        '0',
        '/[0-9]+(\\.[0-9]+)?em/',
        '/#\\{.+?\\}/',
      ],
    },
    // silence complaints about floating points (which are a temp workaround anyways)
    'number-max-precision': null,
    'declaration-block-no-redundant-longhand-properties': null,
    // useful as placeholders when prototyping SFC that will later get styled
    'block-no-empty': null,
    'function-name-case': [
      'lower',
      { ignoreFunctions: [/[a-z]+([A-Z][a-z]+)+/] },
    ],
    'rule-empty-line-before': null,
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
  overrides: [
    {
      files: ['**/*.vue', '**/*.scss'],
      rules: {
        'scss/operator-no-newline-after': null,
        // prefer vanilla CSS variables (a.k.a. custom properties) instead
        'scss/no-dollar-variables': [true],
        'scss/at-mixin-pattern': /^[a-z]+([A-Z][a-z]+)*$/,

        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: ['value'],
          },
        ],
      },
    },
    {
      files: ['**/*.scss'],
    },
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}
