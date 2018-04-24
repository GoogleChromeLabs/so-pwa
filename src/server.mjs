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

// CommonJS imports from node_modules or core.
import axios from 'axios';
import express from 'express';
import functions from 'firebase-functions';
import https from 'https';
import lruCache from 'lru-cache';

// Local ES2105 imports.
import {DEFAULT_TAG} from './lib/constants.mjs';
import * as templates from './lib/templates.mjs';
import * as urls from './lib/urls.mjs';
import routes from './lib/routes.mjs';

// HTML imports.
import aboutPartial from './static/partials/about.html';
import footPartial from './static/partials/foot.html';
import headPartial from './static/partials/head.html';
import navbarPartial from './static/partials/navbar.html';

// See https://cloud.google.com/functions/docs/bestpractices/networking#http_requests_with_an_axios_package
const apiClient = axios.create({
  baseURL: '',
  timeout: 10000,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
});

// Once a browser client has an active service worker, it will no longer need
// to obtain API responses from this server process. But, to cut down on the
// number of API requests that fresh browser clients might trigger, let's put
// in some light-weight caching that's local to this process.
const apiCache = lruCache({
  max: 100,
  maxAge: 1000 * 60 * 5, // 5 minutes.
});

async function requestData(url) {
  const cachedResponse = apiCache.get(url);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await apiClient.request({
    httpsAgent,
    url,
  });

  const data = networkResponse.data;
  apiCache.set(url, data);
  return data;
}

const app = express();

app.get(routes.get('about'), async (req, res) => {
  res.write(headPartial);
  res.write(navbarPartial);
  res.write(aboutPartial);
  res.write(footPartial);
  res.end();
});

app.get(routes.get('questions'), async (req, res) => {
  res.write(headPartial);
  res.write(navbarPartial);

  const questionId = req.params.questionId;
  const data = await requestData(urls.getQuestion(questionId));
  res.write(templates.question(data.items[0]));

  res.write(footPartial);
  res.end();
});

app.get(routes.get('index'), async (req, res) => {
  res.write(headPartial);
  res.write(navbarPartial);

  const tag = req.query.tag || DEFAULT_TAG;
  const data = await requestData(urls.listQuestionsForTag(tag));
  res.write(templates.list(tag, data.items));

  res.write(footPartial);
  res.end();
});

export const handleRequest = functions.https.onRequest(app);
