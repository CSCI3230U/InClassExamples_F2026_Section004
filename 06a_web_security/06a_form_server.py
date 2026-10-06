#!/usr/bin/env python3
"""
Lecture 06a, D9 - "the server is the gate."

Serves 06a_form_demo.html and accepts its POST, so students can submit the form
in the browser, copy the request as cURL, and replay it with values the form
would never have allowed.

    python3 06a_form_server.py              # validation OFF - the server trusts the client
    VALIDATE=1 python3 06a_form_server.py   # validation ON  - the fix

Then open http://localhost:8080/. Watch THIS terminal: every request prints what
the server actually received. Standard library only; binds to localhost.
"""
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from html import escape
from pathlib import Path
from urllib.parse import parse_qs

HOST, PORT = "127.0.0.1", 8080
PAGE = Path(__file__).with_name("06a_form_demo.html")

# switch between client-only and server validation
VALIDATE = os.environ.get("VALIDATE", "0") == "1"

# The catalogue. Note that the browser never gets to add to it, and that
# prices live here, not in the request.
CATALOGUE = {"sticker-pack": 5.00, "mug": 12.50, "hoodie": 45.00}
COUPONS = {"SAVE10": 0.10}
MAX_QUANTITY = 10

def check_order(form):
    """Re-validate everything the form claimed to enforce.

    Allow-list what we expect and reject the rest. Returns a list of problems;
    empty means the request is acceptable.
    """
    problems = []

    email = form.get("email", "")
    if "@" not in email or not 3 <= len(email) <= 254:
        problems.append(f"email: {email!r} is missing or malformed")

    item = form.get("item", "")
    if item not in CATALOGUE:
        problems.append(f"item: {item!r} is not in the catalogue")

    quantity = form.get("quantity", "")
    if not quantity.isdigit() or not 1 <= int(quantity) <= MAX_QUANTITY:
        problems.append(f"quantity: {quantity!r} is outside 1-{MAX_QUANTITY}")

    coupon = form.get("coupon", "")
    if coupon and coupon not in COUPONS:
        problems.append(f"coupon: {coupon!r} is not a valid coupon")

    if len(form.get("notes", "")) > 80:
        problems.append("notes: longer than 80 characters")

    return problems


def price_the_order(form):
    """What the customer is charged.

    Validation OFF: the price comes from the request, so the client sets it.
    Validation ON:  the price is looked up on the server; the submitted
                    'price' field is ignored entirely.
    """
    quantity = int(form.get("quantity", "0") or 0)
    if VALIDATE:
        unit = CATALOGUE[form["item"]]
        discount = COUPONS.get(form.get("coupon", ""), 0.0)
        return unit * quantity * (1 - discount)
    return float(form.get("price", "0") or 0) * quantity


class Handler(BaseHTTPRequestHandler):
    # Quiet the default access log; we print our own.
    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path in ("/", "/06a_form_demo.html"):
            self._send(200, "text/html; charset=utf-8", PAGE.read_bytes())
        else:
            self._send(404, "text/plain; charset=utf-8", b"not found\n")

    def do_POST(self):
        if self.path != "/api/order":
            self._send(404, "text/plain; charset=utf-8", b"not found\n")
            return

        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length).decode("utf-8", "replace")
        form = {k: v[0] for k, v in parse_qs(body, keep_blank_values=True).items()}

        problems = check_order(form) if VALIDATE else []
        if problems:
            self._report(form, None, problems)
            self._send(400, "text/html; charset=utf-8", self._rejected(problems))
            return

        total = price_the_order(form)
        self._report(form, total, [])
        self._send(200, "text/html; charset=utf-8", self._receipt(form, total))

    # ----- output ----------------------------------------------------------

    def _report(self, form, total, problems):
        """Print what the server received. This is the surface to watch in class."""
        mode = "ON" if VALIDATE else "OFF"
        print("\n" + "-" * 62)
        print(f"POST /api/order            (server-side validation: {mode})")
        for key in ("email", "item", "quantity", "coupon", "notes", "price"):
            value = form.get(key, "")
            tag = "   <- IGNORED, looked up on the server" if (key == "price" and VALIDATE) else ""
            print(f"  {key:<9}= {value!r}{tag}")
        if problems:
            print("  -> REJECTED (400)")
            for problem in problems:
                print(f"       {problem}")
        else:
            source = "from the catalogue" if VALIDATE else "price x quantity, straight from the request"
            print(f"  total    = ${total:,.2f}   ({source})")
            print("  -> ACCEPTED")
        print("-" * 62, flush=True)

    def _receipt(self, form, total):
        rows = "".join(
            f"<tr><td>{escape(k)}</td><td><code>{escape(form.get(k, ''))}</code></td></tr>"
            for k in ("email", "item", "quantity", "coupon", "notes", "price")
        )
        return self._page(
            "Order accepted",
            f"<p>The server accepted this order and charged "
            f"<strong>${total:,.2f}</strong>.</p>"
            f"<table border='1' cellpadding='6' cellspacing='0'>{rows}</table>"
            f"<p>Server-side validation is <strong>{'ON' if VALIDATE else 'OFF'}</strong>.</p>",
        )

    def _rejected(self, problems):
        items = "".join(f"<li>{escape(p)}</li>" for p in problems)
        return self._page(
            "Order rejected",
            f"<p>The server re-validated the request and refused it:</p><ul>{items}</ul>",
        )

    def _page(self, title, body):
        return (
            "<!doctype html><html lang='en'><head><meta charset='utf-8'>"
            f"<title>{escape(title)}</title>"
            "<style>body{font-family:system-ui,sans-serif;margin:2rem;max-width:40rem}"
            "code{background:#f3eee3;padding:0 3px}td{font-size:0.95em}</style></head>"
            f"<body><h1>{escape(title)}</h1>{body}"
            "<p><a href='/'>Back to the form</a></p></body></html>"
        ).encode("utf-8")

    def _send(self, status, content_type, body):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    if not PAGE.exists():
        sys.exit(f"missing {PAGE.name} - run this from lectures/examples/")
    mode = "ON - the server re-validates" if VALIDATE else "OFF - the server trusts the client"
    print(f"Order form on http://{HOST}:{PORT}/   (server-side validation: {mode})")
    print("Watch this terminal for what each request actually sends. Ctrl+C to stop.")
    try:
        ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print()
