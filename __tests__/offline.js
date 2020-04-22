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

const util = require('util');
const exec = util.promisify(require('child_process').exec);

describe('offline behavior', () => {
  let server;
  beforeAll(async () => {
    const {child} = exec('npm run firebase-serve');
    server = child;
    await new Promise((fulfill) => setTimeout(fulfill, 5 * 1000));
  });

  afterAll(() => {
    server.kill();
  });

  it('page loads as expected', async () => {
    expect.assertions(1);

    await page.goto('http://localhost:5000/');
    const title = await page.title();
    expect(title).toMatch('Google');
  });
});
