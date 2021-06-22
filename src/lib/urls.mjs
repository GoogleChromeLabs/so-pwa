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

const PATH = `https://api.stackexchange.com/2.2/questions`;

// As per https://api.stackexchange.com/docs/throttle
// While this is a read-only, non-secret key, please register your own
// and replace this value if you fork this project!
const KEY = `LJ54sdY)tUYvfsHg2kwLvQ((`;
const SITE = 'stackoverflow';

export function listQuestionsForTag(tag, sort) {
  const url = new URL(PATH);

  url.searchParams.set('filter', '!C(o*VY))7BGSrm5xK');
  url.searchParams.set('key', KEY);
  url.searchParams.set('order', 'desc');
  url.searchParams.set('pagesize', 100);
  url.searchParams.set('site', SITE);
  url.searchParams.set('sort', sort);
  url.searchParams.set('tagged', tag);

  return url.href;
}

export function getQuestion(questionId) {
  const url = new URL(PATH);
  url.pathname += `/${questionId}`;

  url.searchParams.set('filter',
      '!oDhDpbIIc)pcGHpmWvn_fa0Hu6PKHizd-W.RnKEVsIq');
  url.searchParams.set('key', KEY);
  url.searchParams.set('site', SITE);

  return url.href;
}
