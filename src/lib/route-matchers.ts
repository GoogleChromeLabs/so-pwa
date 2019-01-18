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

import routes from './routes.ts';

const routeMatchers = new Map();
for (const [routeName, expressRoute] of routes) {
  // regexparam creates a RegExp that works when matched against just the
  // pathname, but Workbox matches against the full URL (including origin and
  // search params) when doing RegExp matching. To work around this,
  // we'll create our own functions that implement the matchCallback interface:
  // https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.routing.Route#~matchCallback
  const regExp = regexparam(expressRoute).pattern;
  const matcher = ({url}: {url: URL}) => regExp.exec(url.pathname);
  routeMatchers.set(routeName, matcher);
}

export default routeMatchers;
