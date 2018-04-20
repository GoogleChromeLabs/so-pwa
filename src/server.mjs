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

// CommonJS imports from node_modules.
import fetch from 'node-fetch';
import functions from 'firebase-functions';
import parse from 'url-parse';

// Local ES2105 imports.
import * as templates from './lib/templates.mjs';
import * as urls from './lib/urls.mjs';
import router from './lib/router.mjs';
import routes from './lib/routes.mjs';

// HTML imports.
import aboutPartial from '../www/partials/about.html';
import footPartial from '../www/partials/foot.html';
import headPartial from '../www/partials/head.html';
import navbarPartial from '../www/partials/navbar.html';

const HANDLERS = {};
HANDLERS[routes.INDEX] = async (req, res) => {
  res.write(headPartial);
  res.write(navbarPartial);

  const tag = req.param('tag') || 'service-worker';
  const listResponse = await fetch(urls.listQuestionsForTag(tag));
  const json = await listResponse.json();
  const items = json.items;
  res.write(templates.list(tag, items));

  res.write(footPartial);
  res.end();
};

HANDLERS[routes.QUESTIONS] = async (req, res) => {
  res.write(headPartial);
  res.write(navbarPartial);

  const questionId = req.url.split('/').pop();
  const questionResponse = await fetch(urls.getQuestion(questionId));
  const json = await questionResponse.json();
  const item = json.items[0];
  res.write(templates.question(item));

  res.write(footPartial);
  res.end();
};

HANDLERS[routes.ABOUT] = async (req, res) => {
  res.write(headPartial);
  res.write(navbarPartial);
  res.write(aboutPartial);
  res.write(footPartial);
  res.end();
};

export const handleRequest = functions.https.onRequest(async (req, res) => {
  const pathname = parse(req.url).pathname;
  const route = router(pathname);
  const handler = HANDLERS[route];
  if (handler) {
    await handler(req, res);
  } else {
    res.status(404);
    res.end();
  }
});
