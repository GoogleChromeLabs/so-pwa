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

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleString();
}

function profile({imageUrl, date, profileLink, displayName, anchorLink}) {
  return `<div class="profile">
  <img src="${imageUrl}"
       title="Profile picture"
       ${imageUrl && imageUrl.startsWith('https://www.gravatar.com/') ?
         'crossorigin="anonymous"' : ''}>
  <a href="${profileLink}">${displayName}</a>
  at
  <a href="${anchorLink}">${date}</a>
</div>`;
}

function questionCard({id, title}) {
  return `<a class="card"
             href="/questions/${id}"
             data-cache-url="${getQuestion(id)}">${title}</a>`;
}

export function list(tag, items) {
  if (!items) {
    return `<p class="error">Unable to list questions for the tag.</p>`;
  }

  const title = `<h3>Top "${tag}" Questions</h3>`;

  const form = `<form method="GET">
  <label for="tag">Switch to tag:</label>
  <input type="text" id="tag" name="tag" placeholder="${DEFAULT_TAG}"></input>
</form>`;

  const questionCards = items.map((item) => questionCard({
    id: item.question_id,
    title: item.title,
  })).join('');

  const questions = `<div id="questions">${questionCards}</div>`;

  const metadataScript = `<script>
  self._title = 'Top "${escape(tag)}" Questions';
</script>`;

  return title + form + questions + metadataScript;
}

export function question(item) {
  if (!item) {
    return `<p class="error">Unable to load question.</p>`;
  }

  const ownerProfile = profile({
    anchorLink: item.link,
    date: formatDate(item.creation_date),
    displayName: item.owner.display_name,
    imageUrl: item.owner.profile_image,
    profileLink: item.owner.link,
  });

  const question = `<h3>${item.title}</h3>` + ownerProfile +
    `<div>${item.body}</div>`;

  const answers = item.answers ? item.answers
    .sort((a, b) => a.score < b.score)
    .map((answer) => {
      const answererProfile = profile({
        anchorLink: answer.link,
        date: formatDate(answer.creation_date),
        displayName: answer.owner.display_name,
        imageUrl: answer.owner.profile_image,
        profileLink: answer.owner.link,
    });

    return answererProfile + `<div>${answer.body}</div>`;
  }) : [];

  const metadataScript = `<script>
  self._title = '${escape(item.title)}';
</script>`;

  return [question, ...answers].join('<hr>') + metadataScript;
}
