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

import {string} from 'rollup-plugin-string';
import babel from 'rollup-plugin-babel';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import OMT from '@surma/rollup-plugin-off-main-thread';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

// The version of Chromium used by Samsung Internet 11.x.
const BROWSER_TARGET = {
  browsers: ['chrome >= 75'],
};

// The version of node used in Firebase Cloud Functions.
const NODE_TARGET = {
  node: '14',
};

export default [{
  input: 'src/server.js',
  external: [
    '@popeindustries/lit-html-server',
    '@popeindustries/lit-html-server/directives/unsafe-html',
    'axios',
    'express',
    'firebase-functions',
    'https',
    'html-escaper',
    'lru-cache',
  ],
  plugins: [
    string({
      include: 'build/partials/**/*.html',
    }),
    babel({
      presets: [['@babel/preset-env', {
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
  manualChunks: (id) => {
    if (!id.includes('/node_modules/')) {
      return undefined;
    }

    const chunkNames = [
      'lit-html',
      'html-escaper',
      'regexparam',
      'workbox',
    ];

    return chunkNames.find((chunkName) => id.includes(chunkName)) || 'misc';
  },
  plugins: [
    replace({
      'preventAssignment': true,
      'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'),
    }),
    resolve({
      browser: true,
    }),
    babel({
      presets: [['@babel/preset-env', {
        targets: BROWSER_TARGET,
        modules: false,
      }]],
    }),
    OMT(), // eslint-disable-line new-cap
    compiler(),
  ],
  output: {
    dir: 'build',
    format: 'amd',
  },
}, {
  input: 'src/app.mjs',
  plugins: [
    resolve({
      browser: true,
    }),
    babel({
      presets: [['@babel/preset-env', {
        targets: BROWSER_TARGET,
        modules: false,
      }]],
    }),
    compiler(),
  ],
  output: {
    file: 'build/app.js',
    format: 'iife',
    sourcemap: true,
  },
}];
