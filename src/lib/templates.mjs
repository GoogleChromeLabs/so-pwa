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

import defaultTag from './default-tag.mjs';

function escape(s) {
  return s.replace(/"/g, `&quot;`).replace(/'/g, `&#39;`)
    .replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
}

export function list(tag, items) {
  return `<h3>Top "${tag}" Questions</h3>
<form method="GET">
  <label for="tag">Switch to tag:</label>
  <input type="text" id="tag" name="tag" placeholder="${defaultTag}"></input>
</form>
<div id="questions">
` + items.map((item) => {
    return `
<a class="card" href="/questions/${item.question_id}">
  ${item.title}
</a>
`;
  }).join('') +
  `</div>
<script>
  function unescape(s) {
    return s.replace(/&gt;/g, '>').replace(/&lt;/g, '<')
      .replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  }
  document.title = 'Top "' + unescape('${escape(tag)}') + '" Questions';
</script>`;
}

export function question(item) {
  const questionDate = new Date(item.creation_date * 1000).toLocaleString();
  const question = `
<h3>${item.title}</h3>
<div>${item.body}</div>
<div>
  <img class="profile"
       src="${item.owner.profile_image}"
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
<div>
  <img class="profile"
       src="${answer.owner.profile_image}"
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
    function unescape(s) {
      return s.replace(/&gt;/g, '>').replace(/&lt;/g, '<')
        .replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    }
    document.title = unescape('${escape(item.title)}');
  </script>`;

  return [question, ...answers].join('<hr>') + metadataScript;
}
