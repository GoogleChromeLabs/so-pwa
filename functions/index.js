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

const fetch = require('node-fetch');
const fse = require('fs-extra');
const functions = require('firebase-functions');

const partials = require('../build/partials');
const router = require('../build/router');
const routes = require('../build/routes');
const templates = require('../build/templates');
const urls = require('../build/urls');

const partialCache = {};
async function readPartial(partial) {
  if (!(partial in partialCache)) {
    const filePath = `../www/${partial}`;
    const contents = await fse.readFile(filePath, 'utf-8');
    partialCache[partial] = contents.trim();
  }

  return partialCache[partial];
}

const HANDLERS = {};
HANDLERS[routes.INDEX] = async (req, res) => {
  res.write(await readPartial(partials.HEAD));
  res.write(await readPartial(partials.NAVBAR));

  const tag = req.param('tag') || 'service-worker';
  const listResponse = await fetch(urls.listQuestionsForTag(tag));
  const json = await listResponse.json();
  const items = json.items;
  res.write(templates.list(tag, items));

  res.write(await readPartial(partials.FOOT));
  res.end();
};

HANDLERS[routes.QUESTIONS] = async (req, res) => {
  res.write(await readPartial(partials.HEAD));
  res.write(await readPartial(partials.NAVBAR));

  const questionId = req.url.split('/').pop();
  const questionResponse = await fetch(urls.getQuestion(questionId));
  const json = await questionResponse.json();
  const item = json.items[0];
  res.write(templates.question(item));

  res.write(await readPartial(partials.FOOT));
  res.end();
};

HANDLERS[routes.ABOUT] = async (req, res) => {
  res.write(await readPartial(partials.HEAD));
  res.write(await readPartial(partials.NAVBAR));
  res.write(await readPartial(partials.ABOUT));
  res.write(await readPartial(partials.FOOT));
  res.end();
};

module.exports.handleRequest = functions.https.onRequest(async (req, res) => {
  try {
    const route = router(req.url);
    const handler = HANDLERS[route];
    if (handler) {
      await handler(req, res);
    } else {
      res.status(404);
      res.end();
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
