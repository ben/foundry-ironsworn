/** @type {import('eslint').Linter.Config & typeof import('@typescript-eslint/eslint-plugin')} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  /** @type {import('@typescript-eslint/parser').ParserOptions} */
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
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
      { prefer: 'type-imports' },
    ],
  },
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        // so it doesn't complain about imported jsdoc type annotations
        '@typescript-eslint/consistent-type-imports': 'off',
      },
    },
  ],
}
