// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  env: {
    browser: false,
    es11: true,
    node: true,
  },
  parser: 'babel-eslint',
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  extends: ['plugin:prettier/recommended'],
};
