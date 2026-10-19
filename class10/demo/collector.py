#!/usr/bin/env python3
"""
collector.py - the "attacker's server" for the XSS demo, on localhost only.

In a real stored-XSS attack, the injected script sends the victim's cookie to
a server the attacker controls. Here that server is this script, running on
your own machine, so the class can SEE the cookie arrive. Nothing leaves the
laptop.

Run it in its own terminal:

    python3 collector.py          # listens on http://localhost:9000

Every request it receives is printed in full. The injected payload (see
README.md, step 4) points an <img> at this server with the cookie in the
query string, so a line like

    >>> STOLEN  ?c=session=abc123; theme=dark

appears here the moment the vulnerable page renders the malicious book.

This exists to show why `textContent`, a CSP, and HttpOnly cookies matter.
Don't point real payloads at a real server you don't own.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import unquote

PORT = 9000


class Collector(BaseHTTPRequestHandler):
    def _log_and_reply(self):
        # The path is everything after the host, e.g. "/?c=session=abc123".
        query = self.path[1:] if self.path.startswith("/") else self.path
        print("\n>>> STOLEN  " + unquote(query), flush=True)
        print("    (from " + self.client_address[0] + ")", flush=True)
        # A 1x1 response so the <img> "loads" and the browser stays quiet.
        self.send_response(200)
        self.send_header("Content-Type", "image/gif")
        self.end_headers()
        self.wfile.write(b"")

    # The payload uses an <img>, which is a GET. Handle both to be safe.
    def do_GET(self):
        self._log_and_reply()

    def do_POST(self):
        self._log_and_reply()

    # Quieter default logging: we print our own line above.
    def log_message(self, *args):
        pass


if __name__ == "__main__":
    print("Collector listening on http://localhost:%d" % PORT)
    print("Waiting for a stolen cookie... (Ctrl-C to stop)")
    HTTPServer(("localhost", PORT), Collector).serve_forever()
