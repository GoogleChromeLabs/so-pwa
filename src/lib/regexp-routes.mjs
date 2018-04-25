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

import regexparam from 'regexparam';

import routes from './routes.mjs';

const regexpRoutes = new Map();
for (const [routeName, expressRoute] of routes) {
  // regexparam creates a RegExp with a leading ^, but Workbox routes against
  // the full url.href, not just the url.pathname. We need to strip the ^ from
  // the start of the RegExp to ensure that we can match.
  const regExpString = regexparam(expressRoute).pattern.source;
  const regExp = new RegExp(regExpString.slice(1));

  regexpRoutes.set(routeName, regExp);
}

export default regexpRoutes;
