/**
 * Copyright 2020 Google Inc.
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

import {API_CACHE_NAME, DEFAULT_TAG, PBS_TAG} from './constants.mjs';
import {listQuestionsForTag} from './urls.mjs';

export async function initialize() {
  if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', (event) => {
      event.waitUntil((async () => {
        const cache = await caches.open(API_CACHE_NAME);
        const url = listQuestionsForTag(DEFAULT_TAG);
        await cache.add(url);
        console.log(`In periodicsync handler, updated`, url);
      })());
    });

    const status = await self.navigator.permissions.query({
      name: 'periodic-background-sync',
    });

    if (status.state === 'granted') {
      const tags = await self.registration.periodicSync.getTags();
      if (tags.includes(PBS_TAG)) {
        console.log(`Already registered for periodic background sync with tag`,
            PBS_TAG);
      } else {
        try {
          await registration.periodicSync.register(PBS_TAG, {
            // An interval of one day.
            minInterval: 24 * 60 * 60 * 1000,
          });
          console.log(`Registered for periodic background sync with tag`,
              PBS_TAG);
        } catch (error) {
          console.error(`Periodic background sync permission is 'granted', ` +
              `but something went wrong:`, error);
        }
      }
    } else {
      console.info(`Periodic background sync permission is not 'granted', so ` +
          `skipping registration.`);
    }
  } else {
    console.log(`Periodic background sync is not available in this browser.`);
  }
}
