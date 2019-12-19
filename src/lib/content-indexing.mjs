/**
 * Copyright 2019 Google Inc.
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

import {API_CACHE_NAME} from './constants.mjs';

// This method syncs the currently cached media with the Content Indexing API
// (on browsers that support it). The Cache Storage is the source of truth.
export async function syncContentIndex(registration) {
  //  Bail early if the Content Indexing API isn't supported.
  if (!('index' in registration)) {
    return;
  }

  // Get a list of everything currently in the content index.
  const ids = new Set();
  for (const contentDescription of await registration.index.getAll()) {
    // Add each currently indexed id to the set.
    ids.add(contentDescription.id);
  }

  // Get a list of all cached media.
  const cache = await caches.open(API_CACHE_NAME);
  const cachedRequests = await cache.keys();

  for (const request of cachedRequests) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // If this is a cached API result for a page, then the 3rd split item
    // will be a number.
    if (!isNaN(pathParts[3])) {
      const response = await cache.match(request);
      const json = await response.json();
      const [data] = json.items;

      // Use the question_id as the authoritative id value.
      const id = data.question_id;

      if (ids.has(id)) {
        ids.delete(id);
      } else {
        await registration.index.add({
          id,
          launchUrl: `/questions/${id}`,
          category: 'article',
          description: 'A question from Stack Overflow.',
          icons: [{
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png',
          }],
          title: data.title,
        });
      }
    }
  }

  // Finally, for all of the ids that are currently in the index but aren't
  // cached (i.e. all values that are still in the ids set), remove
  // them from the index.
  for (const id of ids) {
    await registration.index.delete(id);
  }
}
