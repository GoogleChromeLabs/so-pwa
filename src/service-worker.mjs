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

import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {CacheFirst, StaleWhileRevalidate} from 'workbox-strategies';
import {cleanupOutdatedCaches, matchPrecache, precacheAndRoute}
  from 'workbox-precaching';
import {clientsClaim, skipWaiting} from 'workbox-core';
import {ExpirationPlugin} from 'workbox-expiration';
import {registerRoute} from 'workbox-routing';
import {strategy as streamsStrategy} from 'workbox-streams';

import {API_CACHE_NAME, DEFAULT_TAG} from './lib/constants.mjs';
import * as templates from './lib/templates.mjs';
import * as urls from './lib/urls.mjs';
import partials from './lib/partials.mjs';
import {initialize as pbsInitialize} from './lib/periodic-background-sync.mjs';
import routeMatchers from './lib/route-matchers.mjs';

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const apiStrategy = new StaleWhileRevalidate({
  cacheName: API_CACHE_NAME,
  plugins: [
    new ExpirationPlugin({maxEntries: 50}),
  ],
});

registerRoute(
    routeMatchers.get('about'),
    streamsStrategy([
      () => matchPrecache(partials.head),
      () => matchPrecache(partials.navbar),
      () => matchPrecache(partials.about),
      () => matchPrecache(partials.foot),
    ]),
);

registerRoute(
    routeMatchers.get('questions'),
    streamsStrategy([
      () => matchPrecache(partials.head),
      () => matchPrecache(partials.navbar),
      async ({event, params}) => {
        try {
          const questionId = params[1];
          const questionResponse = await apiStrategy.handle({
            event,
            request: urls.getQuestion(questionId),
          });
          const data = await questionResponse.json();
          return templates.question(data.items[0]);
        } catch (error) {
          return templates.error(error.message);
        }
      },
      () => matchPrecache(partials.foot),
    ]),
);

registerRoute(
    routeMatchers.get('index'),
    streamsStrategy([
      () => matchPrecache(partials.head),
      () => matchPrecache(partials.navbar),
      async ({event, url}) => {
        try {
          const tag = url.searchParams.get('tag') || DEFAULT_TAG;
          const listResponse = await apiStrategy.handle({
            event,
            request: urls.listQuestionsForTag(tag),
          });
          const data = await listResponse.json();
          return templates.index(tag, data.items);
        } catch (error) {
          return templates.error(error.message);
        }
      },
      () => matchPrecache(partials.foot),
    ]),
);

// Gravatar images support CORS, so we won't be storing opaque responses.
registerRoute(
    new RegExp('https://www\\.gravatar\\.com/'),
    new CacheFirst({
      cacheName: 'profile-images',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          purgeOnQuotaError: true,
        }),
      ],
    }),
);

registerRoute(
    new RegExp('^https://.*(?:\\.jpg|\\.png)'),
    new CacheFirst({
      cacheName: 'other-images',
      plugins: [
        new CacheableResponsePlugin({statuses: [0, 200]}),
        new ExpirationPlugin({
          maxEntries: 10,
          purgeOnQuotaError: true,
        }),
      ],
    }),
);

skipWaiting();
clientsClaim();

pbsInitialize();
