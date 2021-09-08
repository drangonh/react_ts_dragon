// .eslintrc.js

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    //由于我们在 tsconfig.json 中开启了 react-jsx 选项。因此我们需要添加
    //  plugin:react/jsx-runtime 这个配置集，
    //这样当我们不去写 import React from 'react' 时，ESLint 不会报错。
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // 在这里添加需要覆盖的规则
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-else-return': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["off"]
  }
  
};