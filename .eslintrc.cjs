/** @type {import('eslint').Linter.Config & typeof import('@typescript-eslint/eslint-plugin')} */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'standard-with-typescript',
		'plugin:@typescript-eslint/recommended',
		'plugin:vue/vue3-recommended',
		'prettier'
	],
	parser: 'vue-eslint-parser',
	ignorePatterns: ['.eslintrc.cjs', '*.d.ts'],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 11,
		sourceType: 'module'
	},
	env: {
		browser: true,
		es2020: true,
		node: true
	},
	plugins: ['@typescript-eslint'],
	rules: {
		// nesting *more* pointy brackets is  harder to read with most generics, IMO
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/method-signature-style': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{ prefer: 'type-imports' }
		],

		// LoFD uses them, which means our augments do too (for both namespaces and extending static methods)
		'@typescript-eslint/no-namespace': 'off',

		// silence complaints about not explicitly declaring global variables in every files
		'no-undef': 'off',

		// FIXME: part of standard-ts. not an awful idea, but it's not doable via autofix, so it's disabled for now
		'@typescript-eslint/explicit-function-return-type': 'off',

		// prefer lodash-es to regular lodash, and FVTT-provided utilities to lodash utilities
		'no-restricted-imports': [
			'error',
			{
				paths: [
					{
						name: 'lodash',
						message: 'Please use lodash-es instead.'
					},
					{
						name: 'lodash-es',
						importNames: ['clamp'],
						message: 'Please use FVTT Math.clamped instead.'
					},
					{
						name: 'lodash-es',
						importNames: ['capitalize'],
						message: 'Please use FVTT String#capitalize instead.'
					},
					{
						name: 'lodash-es',
						importNames: ['range'],
						message:
							'Please use FVTT Array#fromRange instead, where possible. Note that Array#fromRange orders its parameters differently, and its maximum is inclusive rather than exclusive.'
					}
				]
			}
		]
	},
	overrides: [
		{
			files: ['*.ts', '*.js', '*.cjs'],
			parserOptions: { project: './tsconfig.json' }
		},
		{
			files: ['*.js', '*.cjs'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				// so it doesn't complain about imported jsdoc type annotations
				'@typescript-eslint/consistent-type-imports': 'off'
			}
		}
	]
}
