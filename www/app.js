(function () {
  'use strict';

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

  const API_CACHE_NAME = 'api-cache';

  function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

  window.addEventListener('load', _asyncToGenerator(function* () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }

    const apiCache = yield caches.open(API_CACHE_NAME);
    const apiCacheContents = yield apiCache.keys();

    const offlineIndicator = document.querySelector('#offline');
    const cards = document.querySelectorAll('.card');
    const uncachedCards = [...cards].filter(function (card) {
      return !apiCacheContents.includes(card.dataset.cacheUrl);
    });

    window.addEventListener('online', function () {
      for (const uncachedCard of uncachedCards) {
        uncachedCard.style.opacity = '1.0';
      }
      offlineIndicator.style.display = 'none';
    });

    window.addEventListener('offline', function () {
      for (const uncachedCard of uncachedCards) {
        uncachedCard.style.opacity = '0.3';
      }
      offlineIndicator.style.display = 'inline-block';
    });
  }));

}());
