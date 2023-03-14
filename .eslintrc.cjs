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
	ignorePatterns: ['.eslintrc.cjs'],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 11,
		sourceType: 'module',
		project: './tsconfig.json'
	},
	env: {
		browser: true,
		es2020: true,
		node: true
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{ prefer: 'type-imports' }
		],

		// FIXME: part of standard-ts. not an awful idea, but it's not doable via autofix, so it's disabled for now
		'@typescript-eslint/explicit-function-return-type': 'off'
	},
	overrides: [
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
