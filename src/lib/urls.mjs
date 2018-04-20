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

const PREFIX = `https://api.stackexchange.com/2.2`;

export function listQuestionsForTag(tag) {
  return `${PREFIX}/questions?pagesize=100&order=desc&sort=votes&tagged=` +
    `${encodeURIComponent(tag)}&site=stackoverflow&filter=!C(o*VY))7BGSrm5xK`;
}

export function getQuestion(questionId) {
  return `${PREFIX}/questions/${encodeURIComponent(questionId)}?site=` +
    `stackoverflow&filter=!E-NoEOOqk.KxiVtgwUSr(q72V0fqfidE4Y)th*`;
}
