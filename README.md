# hello

## Scope

write hello alex on a nicely designed page.

Created from the phone via Paseo intake. Previews: https://preview-main.hello.pages.dev

## Usage

The page is plain HTML and CSS, with no build step or external dependencies.
Open `index.html` directly, or serve the repository with Python 3:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. The layout adapts to mobile and desktop screens.

## Tests

```sh
python3 -m unittest discover -s tests -v
```

Tests check the greeting, semantic page structure, mobile viewport metadata,
and HTTP delivery of the page and its stylesheet. Visual appearance should
also be reviewed in a browser at mobile and desktop widths before deployment.
