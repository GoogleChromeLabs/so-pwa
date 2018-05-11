## "Beyond Single Page Apps" @ Google I/O 2018

[![Google I/O Session](https://img.youtube.com/vi/X6yof_vIQnk/0.jpg)](https://www.youtube.com/watch?v=X6yof_vIQnk)

## About SO PWA

Live deployment: https://so-pwa.firebaseapp.com/

This is a sample
[progressive web app](https://developers.google.com/web/progressive-web-apps/)
which uses the [Stack Exchange API](https://api.stackexchange.com/) to fetch the
top questions and answers from [Stack Overflow](https://stackoverflow.com/) for
a given tag.

Under the hood, it's powered by the following technologies:

- Service worker generation and [Streams API](https://streams.spec.whatwg.org/)
logic via [Workbox](https://developers.google.com/web/tools/workbox/).
- Static and dynamic web hosting via
[Firebase Cloud Functions](https://firebase.google.com/docs/functions/).
- "Universal" JavaScript via ES2015 source modules, bundled for the browser and
[Node](https://nodejs.org/) by [Rollup](https://rollupjs.org/), with
[`babel-preset-env`](https://babeljs.io/docs/plugins/preset-env/) ensuring
compatibility with various runtimes.
- Shared server + service worker routing logic using
[Express-style](https://expressjs.com/en/guide/routing.html) patterns and the
[`regexparam`](https://github.com/lukeed/regexparam) library in the service
worker.

## Contributing

Please read the [guide to contributing](CONTRIBUTING.md) prior to filing any
pull requests.

## License

Copyright 2018 Google, Inc.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License");
you may not use this file except in compliance with the License. You may
obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
