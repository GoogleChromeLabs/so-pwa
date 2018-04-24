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

import {DEFAULT_TAG} from './constants.mjs';
import {escape} from './escaping.mjs';
import {getQuestion} from './urls.mjs';

export function list(tag, items) {
  return `<h3>Top "${tag}" Questions</h3>
<form method="GET">
  <label for="tag">Switch to tag:</label>
  <input type="text" id="tag" name="tag" placeholder="${DEFAULT_TAG}"></input>
</form>
<div id="questions">
` + items.map((item) => {
    return `
<a class="card" href="/questions/${item.question_id}"
   data-cache-url="${getQuestion(item.question_id)}">
  ${item.title}
</a>
`;
  }).join('') +
  `</div>
<script>
  self._title = 'Top "${escape(tag)}" Questions';
</script>`;
}

export function question(item) {
  const questionDate = new Date(item.creation_date * 1000).toLocaleString();
  const question = `
<h3>${item.title}</h3>
<div>${item.body}</div>
<div class="profile">
  <img src="${item.owner.profile_image}"
       title="Profile image"
       ${item.owner.profile_image &&
         item.owner.profile_image.startsWith('https://www.gravatar.com/') ?
         'crossorigin="anonymous"' : ''}>
  <a href="${item.owner.link}">${item.owner.display_name}</a>
  asked this at
  <a href="${item.link}">${questionDate}</a>.
</div>
`;

  const answers = item.answers ? item.answers.map((answer) => {
    return `
<div class="profile">
  <img src="${answer.owner.profile_image}"
       title="Profile image"
       ${answer.owner.profile_image &&
        answer.owner.profile_image.startsWith('https://www.gravatar.com/') ?
        'crossorigin="anonymous"' : ''}>
  <a href="${answer.owner.link}">${answer.owner.display_name}</a>
  answered:
</div>
<div>${answer.body}</div>

`;
  }) : [];

  const metadataScript = `<script>
    self._title = '${escape(item.title)}';
  </script>`;

  return [question, ...answers].join('<hr>') + metadataScript;
}
