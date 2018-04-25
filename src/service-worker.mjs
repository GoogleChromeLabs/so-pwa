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

import {API_CACHE_NAME, DEFAULT_TAG} from './lib/constants.mjs';
import * as templates from './lib/templates.mjs';
import * as urls from './lib/urls.mjs';
import partials from './lib/partials.mjs';
import regExpRoutes from './lib/regexp-routes.mjs';

importScripts('workbox-v3.1.0/workbox-sw.js');
workbox.setConfig({
  debug: true,
  modulePathPrefix: 'workbox-v3.1.0/',
});

workbox.precaching.precacheAndRoute([]);

const errorContent = (error) => {
  return `<p>Sorry, this page couldn't be loaded.</p>
          <p>Try a cached page instead.</p>
          <pre>${error}</pre>`;
};

const cacheStrategy = workbox.strategies.cacheFirst({
  cacheName: workbox.core.cacheNames.precache,
});

const apiStrategy = workbox.strategies.staleWhileRevalidate({
  cacheName: API_CACHE_NAME,
  plugins: [
    new workbox.expiration.Plugin({maxEntries: 50}),
  ],
});

workbox.routing.registerRoute(
  regExpRoutes.get('about'),
  workbox.streams.strategy([
    () => cacheStrategy.makeRequest({request: partials.HEAD}),
    () => cacheStrategy.makeRequest({request: partials.NAVBAR}),
    () => cacheStrategy.makeRequest({request: partials.ABOUT}),
    () => cacheStrategy.makeRequest({request: partials.FOOT}),
  ])
);

workbox.routing.registerRoute(
  regExpRoutes.get('questions'),
  workbox.streams.strategy([
    () => cacheStrategy.makeRequest({request: partials.HEAD}),
    () => cacheStrategy.makeRequest({request: partials.NAVBAR}),
    async ({event, url, params}) => {
      try {
        const [questionId] = params;
        const questionResponse = await apiStrategy.makeRequest({
          event,
          request: urls.getQuestion(questionId),
        });
        const data = await questionResponse.json();
        return templates.question(data.items[0]);
      } catch (error) {
        return templates.error(error.message);
      }
    },
    () => cacheStrategy.makeRequest({request: partials.FOOT}),
  ])
);

workbox.routing.registerRoute(regExpRoutes.get('index'),
  workbox.streams.strategy([
    () => cacheStrategy.makeRequest({request: partials.HEAD}),
    () => cacheStrategy.makeRequest({request: partials.NAVBAR}),
    async ({event, url}) => {
      try {
        const tag = url.searchParams.get('tag') || DEFAULT_TAG;
        const listResponse = await apiStrategy.makeRequest({
          event,
          request: urls.listQuestionsForTag(tag),
        });
        const data = await listResponse.json();
        return templates.index(tag, data.items);
      } catch (error) {
        return templates.error(error.message);
      }
    },
    () => cacheStrategy.makeRequest({request: partials.FOOT}),
  ])
);

// Gravatar images support CORS, so we won't be storing opaque responses.
workbox.routing.registerRoute(
  new RegExp('https://www\\.gravatar\\.com/'),
  workbox.strategies.cacheFirst({
    cacheName: 'profile-images',
    plugins: [
      new workbox.expiration.Plugin({maxEntries: 50}),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('^https://.*(?:\\.jpg|\\.png)'),
  workbox.strategies.cacheFirst({
    cacheName: 'other-images',
    plugins: [
      new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
      new workbox.expiration.Plugin({maxEntries: 5}),
    ],
  })
);

workbox.skipWaiting();
workbox.clientsClaim();
