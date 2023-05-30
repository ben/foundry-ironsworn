const camelCase = /^[a-z]+([A-Z][a-z]+)*$/

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

		/**
		 * Orders properties beginning with properties that exist outside the styled box (e.g. `margin`), with subsequent properties moving inwards from that. This way, properties that affect placement of sibling elements are always at the top.
		 * @see https://github.com/chaucerbao/stylelint-config-concentric-order
		 */
		'stylelint-config-concentric-order'
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
		'@mavrin/stylelint-declaration-use-css-custom-properties'
	],
	rules: {
		'mavrin/stylelint-declaration-use-css-custom-properties': {
			/**
			 * @see https://csstree.github.io/docs/syntax/
			 */
			cssDefinitions: ['color', 'length', 'z-index', 'line-height'],
			ignoreProperties: ['/^\\$/', '/^--/', '//^@'],
			ignoreValues: [
				'/^@/',
				'/^\\$/',
				'transparent',
				'currentcolor',
				'0',
				'/[0-9]+(\\.[0-9]+)?em/',
				'/#\\{.+?\\}/'
			]
		},
		'scss/double-slash-comment-empty-line-before': null,
		// silence complaints about floating points (which are a temp workaround anyways)
		'number-max-precision': null,
		'declaration-block-no-redundant-longhand-properties': null,
		// useful as placeholders when prototyping SFC that will later get styled
		'block-no-empty': null,
		'function-name-case': ['lower', { ignoreFunctions: [camelCase] }],
		'rule-empty-line-before': null,
		// *theoretically* this would be good to use, but i don't have the patience to do it right now
		'no-descending-specificity': null,
		'string-quotes': ['single'],

		'selector-class-pattern': [
			/^((ironsworn__|tox-[a-z+]__)?[a-z][a-z-0-9]*[a-z0-9])|ProseMirror$/,
			{
				resolveNestedSelectors: true
			}
		],
		'import-notation': null,
		// FIXME workaround required for LESS to lint
		'no-invalid-position-at-import-rule': null,
		// FIXME workaround required for LESS to lint
		'function-no-unknown': null,
		// FIXME workaround required for LESS to lint
		'no-duplicate-at-import-rules': null,
		// FIXME workaround required for LESS to lint
		'no-invalid-double-slash-comments': null,

		/**
		 * Enforces consistent naming for CSS custom properties.
		 *
		 * `ironsworn` - Properties specific to this module. If you're adding a brand new property, it should probably have this.
		 * `starforged` - An alternative namespace for Starforged specific content. Avoid this and generalize to themes where possible.
		 * `isicon` - Properties that represent the relative URL of a custom icon.
		 * `font` - FVTT font properties.
		 * `color` - FVTT color properties.
		 * `form-field` - FVTT form-field properties.
		 * `fa` - FontAwesome properties.
		 *
		 * @example ```less
		 * --ironsworn-custom-property: sqrt(2);
		 * ```
		 */
		'custom-property-pattern':
			'(ironsworn|starforged|isicon|font|color|fa|form-field)-.+'
	},
	overrides: [
		{
			files: ['**/*.vue', '**/*.scss'],
			rules: {
				'scss/operator-no-newline-after': null,
				// prefer vanilla CSS variables (a.k.a. custom properties) instead
				'scss/no-dollar-variables': [true],
				'scss/dollar-variable-pattern': camelCase,
				'scss/at-mixin-pattern': camelCase,

				'at-rule-no-unknown': null,
				'scss/at-rule-no-unknown': [
					true,

					{
						ignoreAtRules: ['value']
					}
				],
				'custom-property-empty-line-before': null,
				'scss/dollar-variable-empty-line-before': null,
				'scss/function-no-unknown': [
					true,
					{
						ignoreFunctions: [
							'v-bind',
							'getIconVars',
							'getIconClasses',
							'setChannel',
							'getChannel',
							'luminance',
							'lightest',
							'darkest',
							'contrast',
							'mix',
							'hcl',
							'lch',
							'oklch',
							'scaleSteps',
							'gamutize'
						]
					}
				]
			}
		},
		{
			files: ['**/*.scss']
		},
		{
			files: ['**/*.vue'],
			customSyntax: 'postcss-html'
		}
	]
}
