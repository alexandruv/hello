"""Validate the static page's content and locally served assets."""

from functools import partial
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import unittest
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.elements = []
        self.heading = []
        self.in_heading = False

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))
        if tag == "h1":
            self.in_heading = True

    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_heading = False

    def handle_data(self, data):
        if self.in_heading:
            self.heading.append(data)


class PageTests(unittest.TestCase):
    def test_accessible_greeting_and_mobile_metadata(self):
        page = PageParser()
        page.feed((ROOT / "index.html").read_text())
        self.assertEqual("".join(page.heading), "hello alex.")
        self.assertEqual(sum(tag == "h1" for tag, _ in page.elements), 1)
        self.assertIn(("html", {"lang": "en"}), page.elements)
        self.assertTrue(any(tag == "main" for tag, _ in page.elements))
        self.assertTrue(any(tag == "meta" and attrs.get("name") == "viewport"
                            for tag, attrs in page.elements))

    def test_page_and_styles_are_served(self):
        handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
        server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            base = f"http://127.0.0.1:{server.server_port}"
            with urlopen(base) as response:
                page = PageParser()
                page.feed(response.read().decode())
                self.assertEqual(response.status, 200)
            styles = [attrs["href"] for tag, attrs in page.elements
                      if tag == "link" and attrs.get("rel") == "stylesheet"]
            self.assertEqual(styles, ["styles.css"])
            for stylesheet in styles:
                with urlopen(f"{base}/{stylesheet}") as response:
                    self.assertEqual(response.status, 200)
                    self.assertEqual(response.headers.get_content_type(), "text/css")
        finally:
            server.shutdown()
            server.server_close()
            thread.join()


if __name__ == "__main__":
    unittest.main()
