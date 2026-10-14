# hello

A blue `hello alex` greeting with a small, continuously rotating Three.js torus
knot on the same page. The responsive layout keeps the greeting readable and
places the decorative scene below it on mobile.

Preview: https://preview-main.hello.pages.dev

## Usage

This is a static HTML, CSS, and JavaScript page with no build step, backend,
accounts, secrets, or runtime network dependencies. Serve the repository with
Python 3 (ES modules require HTTP rather than opening the file directly):

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000 in a modern browser with WebGL2 support. The scene
starts automatically on every load, rotates and gently bobs without input, and
resizes with the page. If WebGL is unavailable, the greeting remains readable.

Three.js 0.180.0 is vendored in `vendor/three/` with its MIT license. The two
unmodified build files come from the `three@0.180.0` npm package's `build/`
directory (`three.module.min.js` imports `three.core.min.js`). No CDN is contacted
by the page. Node dependencies below are used only for browser tests.

## Tests

Run the standard content and HTTP asset delivery suite:

```sh
python3 -m unittest discover -s tests -v
```

Run the browser suite on a host that permits launching Google Chrome with
WebGL2 enabled (Node.js and installed Google Chrome required):

```sh
npm ci
npm run test:browser
```

The browser suite starts its own local server on port 8000; stop any existing
server first. It checks that all visible text is blue, the visible greeting,
scene bounds and separation from the heading at desktop and mobile widths, changing canvas screenshots without
input, restart after reload, and JavaScript errors. Chrome's sandbox stays
enabled. Browser tests are a separate host-only suite; they are not included in
the Python suite and are not reported as passing when unavailable.

Before deployment, open the page at desktop and mobile widths, confirm
all text (including `hello alex` and its period) is blue and readable, watch the
Three.js canvas move, then reload once and confirm motion starts again.

### Validation in the implementation environment

For issue #5, all three Python tests passed. The two host-only browser tests
were attempted, but Chrome aborted during launch (`SIGABRT`) in the restricted
execution environment before any page assertions ran. Neither browser test
passed or was skipped. The suite now checks computed blue text colors at both
viewport sizes and after reload, alongside the existing layout and motion checks.
Browser color, readability, animation, and reload validation remain pending on
an authorized host before deployment. Chrome's sandbox remains enabled.
