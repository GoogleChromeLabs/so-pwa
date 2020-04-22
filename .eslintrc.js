/**
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = {
  extends: [
    'eslint:recommended',
    'google',
    'plugin:jest/all',
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
    serviceworker: true,
  },
  globals: {
    browser: false,
    page: false,
    workbox: false,
  },
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: {
    'require-jsdoc': 0,
  },
  overrides: [{
    files: ['**/*.mjs'],
    parserOptions: {
      sourceType: 'module',
    },
  }, {
    files: [
      '{functions,src}/*.{mjs,js}',
      '*.{mjs,js}',
    ],
    plugins: [
      'header',
      'jest',
    ],
    rules: {
      'header/header': [2, 'block', {
        pattern: 'Copyright \\d{4} Google Inc.',
      }],
    }
  }],
};
