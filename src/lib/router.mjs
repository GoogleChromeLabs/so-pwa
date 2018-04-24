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

import regExpParam from 'regexparam';

import routes from './routes.mjs';

const regexpRoutes = new Map();
for (const [routeName, expressRoute] of routes) {
  regexpRoutes.set(routeName, regExpParam(expressRoute).pattern);
}

export default function router(pathname) {
  for (const [route, regexp] of regexpRoutes) {
    const matches = regexp.exec(pathname);
    if (matches) {
      return {
        route,
        params: matches.slice(1),
      };
    }
  }
}
