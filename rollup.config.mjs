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

import babel from 'rollup-plugin-babel';
import os from 'os';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import string from 'rollup-plugin-string';

// The version of Chroumium used by Samsung Internet 5.x.
const BROWSER_TARGET = {
  browsers: ['chrome >= 51'],
};

// The version of node used in Firebase Cloud Functions.
const NODE_TARGET = {
  node: '6.14.0',
};

export default [{
  input: 'src/server.mjs',
  external: [
    'axios',
    'express',
    'firebase-functions',
    'https',
    'lru-cache',
  ],
  plugins: [
    string({
      include: 'src/static/partials/**/*.html',
    }),
    babel({
      presets: [['env', {
        targets: NODE_TARGET,
        modules: false,
      }]],
    }),
  ],
  output: {
    file: 'functions/index.js',
    format: 'cjs',
  },
}, {
  input: 'src/service-worker.mjs',
  plugins: [
    resolve(),
    babel({
      presets: [['env', {
        targets: BROWSER_TARGET,
        modules: false,
      }], 'minify'],
    }),
  ],
  output: {
    file: path.join(os.tmpdir(), 'service-worker.js'),
    format: 'iife',
  },
  }, {
  input: 'src/app.mjs',
  plugins: [
    babel({
      presets: [['env', {
        targets: BROWSER_TARGET,
        modules: false,
      }], 'minify'],
    }),
  ],
  output: {
    file: 'build/app.js',
    format: 'iife',
    sourcemap: true,
  },
}];
