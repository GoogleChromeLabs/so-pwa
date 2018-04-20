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

export function list(tag, items) {
  return `<h3>Top "${tag}" Questions</h3>` + items.map((item) => {
    return `
<div>
  <a href="/questions/${item.question_id}">
    ${item.title}
  </a>
</div>
`;
  }).join('');
}

export function question(item) {
  const question = `
<h3>${item.title}</h3>
<div>${item.body}</div>
<div>
  <img class="profile"
       src="${item.owner.profile_image}"
       title="Profile image"
       ${item.owner.profile_image.startsWith('https://www.gravatar.com/') ?
         'crossorigin="anonymous"' : ''}>
  <a href="${item.owner.link}">
    ${item.owner.display_name}
  </a>
  asked this on
  <a href="${item.link}">
    ${new Date(item.creation_date * 1000).toLocaleString()}
  </a>.
</div>
`;

  const answers = item.answers ? item.answers.map((answer) => {
    return `
<div>${answer.body}</div>
<div>
  <img class="profile"
       src="${answer.owner.profile_image}"
       title="Profile image"
       ${answer.owner.profile_image.startsWith('https://www.gravatar.com/') ?
         'crossorigin="anonymous"' : ''}>
  <a href="${answer.owner.link}">
    ${answer.owner.display_name}
  </a>
  answered this.
</div>
`;
  }) : [];

  // TODO: Escaping.
  const metadataScript = `<script>
    document.title = ${JSON.stringify(item.title)};
  </script>`;

  return [question, ...answers].join('<hr>') + metadataScript;
}
