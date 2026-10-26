# Practice Midterm - Part A answers

| Q | Answer | Why |
|---|---|---|
| A1 | b | GET puts the form fields in the query string. |
| A2 | a, b, d | 403 means "logged in, but not allowed"; 404 means "no such resource". A crash is 5xx. |
| A3 | b | The icon is just text; `aria-label` names the button. `title` on a child isn't the button's name, and `alt` only works on images. |
| A4 | a | `#list li` has an id (1,0,1), which beats any number of classes: `li.card.done` is only (0,2,1). |
| A5 | b | `em` is relative to the element's own font size (20px, inherited from `.card`); `rem` is relative to the root (16px). |
| A6 | c | 50% of 400 = 200, + 2 × 10 padding + 2 × 2 border = 224. |
| A7 | b | At 70rem both queries match, and they have the same specificity, so the **later** one (2 columns) wins. Mobile-first queries must go from small to large. |
| A8 | b | Without the viewport tag, phones use a ~980px "virtual" layout width. |
| A9 | b | 900 − 300 = 600 left, split into 3 fr: 1fr = 200px. |
| A10 | b | `copy` and `book` point to the same object. `const` stops reassignment, not mutation. |
| A11 | a, b, e | `"0"` is a non-empty string and `[]` is an object: both are truthy. |
| A12 | c | `*` runs first (8); then `"3" + 8` concatenates: `"38"`. |
| A13 | c | That's why a total like `totalHours` needs `reduce(..., 0)`. |
| A14 | a, c, e | `sort` sorts in place; d changes the object it was given. |
| A15 | b | Spread is a **shallow** copy. Use `a.map((o) => ({ ...o }))` to copy the objects too. |
| A16 | c | Synchronous code first (1, 4), then promise callbacks (microtasks: 3), then timers (2). |
| A17 | b | `response.json()` returns a Promise too; it needs `await`. |
| A18 | c | `fetch` only rejects on network errors. For 404 and 500 you check `response.ok`; a bad body makes `response.json()` reject, not `fetch`. |
| A19 | b | `target` is where the click happened; `currentTarget` is the element whose listener is running. That's why delegation uses `event.target.closest(...)`. |
| A20 | c | `data-*` names become camelCase in `dataset`. |
| A21 | b | Use `defer`, `type="module"`, or put the script at the end of the `<body>`. |
| A22 | a | `~` allows patch updates only (3.4.x). `^` would also allow 3.5.0. |
| A23 | a, b, c | The browser doesn't know where the bare name `"marked"` is; a bundler (or an import map) resolves it. |
| A24 | b | You have to narrow the union before you can use string-only methods. |
| A25 | b | `?` makes the property optional, so it may be missing. |
| A26 | c | TypeScript types are erased at runtime. `as` is a promise *you* make to the compiler; validate data you don't control. |
| A27 | b | A value like `x" onerror="steal()` breaks out of the attribute. Setting `img.src` never parses HTML. |
| A28 | c | Same scheme + host + port. 443 is the default for https, so c is the same origin. |
| A29 | c | `HttpOnly` hides the cookie from JavaScript, but requests sent from the page still carry it. XSS has to be fixed at the source (`textContent`, escaping, CSP). |
| A30 | c | Anyone can send the request with DevTools or `curl`. The client only gives a nicer experience; the server enforces the rule. |
