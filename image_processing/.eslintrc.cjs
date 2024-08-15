module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": false}],
  },
}
