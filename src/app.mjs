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

import {unescape} from 'html-escaper';

import {API_CACHE_NAME} from './lib/constants.mjs';
import {syncContentIndex} from './lib/content-indexing.mjs';

window.addEventListener('load', async () => {
  if (self._title) {
    document.title = unescape(self._title);
  }

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register(
        '/service-worker.js');

    syncContentIndex(registration);
  }

  const apiCache = await caches.open(API_CACHE_NAME);
  const cachedRequests = await apiCache.keys();
  const cachedUrls = cachedRequests.map((request) => request.url);

  const offlineIndicator = document.querySelector('#offline');
  const cards = document.querySelectorAll('.card');
  const uncachedCards = [...cards].filter((card) => {
    return !cachedUrls.includes(card.dataset.cacheUrl);
  });

  const onlineHandler = () => {
    for (const uncachedCard of uncachedCards) {
      uncachedCard.style.opacity = '1.0';
    }
    offlineIndicator.style.display = 'none';
  };

  const offlineHandler = () => {
    for (const uncachedCard of uncachedCards) {
      uncachedCard.style.opacity = '0.3';
    }
    offlineIndicator.style.display = 'block';
  };

  if (navigator.onLine) {
    onlineHandler();
  } else {
    offlineHandler();
  }

  window.addEventListener('online', onlineHandler);
  window.addEventListener('offline', offlineHandler);
});
