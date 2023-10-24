module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],
    ignorePatterns: ['dist'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'prettier', 'sort-destructure-keys'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        'prettier/prettier': [
            'error',
            {
                'printWidth': 120,
                'tabWidth': 4,
                'singleQuote': true,
                'bracketSpacing': false
            }
        ],
        'sort-destructure-keys/sort-destructure-keys': 'error',
    },
}
