# Practice Midterm

**CSCI 3230U · Fall 2026 · Practice only - not graded**

This has the same three parts as the real midterm, and it is a bit harder
on purpose. If you can finish it in about 80 minutes, you are ready.

| Part | What | Marks | Time |
|---|---|---|---|
| A | [30 short questions](part-a-questions.md) | 30 | ~25 min |
| B | Debugging: [Practice Room](part-b-practice-room/) - fix 10 bugs | 20 | ~25 min |
| C | Practical: [Pokémon Team](part-c-pokemon-team/) - build it from screenshots | 30 | ~30 min |

On the real midterm, Parts B and C come first in Canvas and are uploaded
as a `.zip` of the whole folder. Practise that too: zip your folder when
you're done, and keep 3-4 minutes for it.

**Rules to practise with:** it is open book (your own files and MDN), but
no AI tools (including Copilot or Cursor), no chat, and no help from anyone
else. Same as the real thing.

Solutions are in [`solution/`](solution/). Try everything before you look.

---

## Part B - Practice Room (20 marks, ~25 minutes)

Practice Room keeps track of the songs you're learning. It loads a list of
songs, shows them as cards, lets you add new ones, and has a **🎵 Practised**
button on each card. It has ten bugs. Each fixed bug is worth 2 marks.

**Get it running**

```
cd part-b-practice-room
node --test            # runs the unit tests for lib.js (bugs 1-5)
python3 -m http.server 8000
```

**The bug report**

Logic bugs - in `lib.js`, checked by `node --test`. Each Bug N test group must pass completely to earn its 2 marks.

1. `loadSongs` - if the server answers with an error (try temporarily renaming `songs.json`), the page should say "Could not load songs: HTTP 404". Instead the page stays empty, and the Console shows a TypeError from `render`.
2. `needsPractice` - a song that is due today isn't counted: Blackbird (practised 7 days ago, every 7 days) and Seven Nation Army aren't listed under *Needs practice*.
3. `withPractised` - must return a new array and leave the original list *and its songs* alone. (The page looks fine. The tests don't.)
4. `countByInstrument` - the header reads "NaN guitar, NaN piano, NaN drums".
5. `byTitle` - ticking A-Z doesn't change the order of the cards.

Page bugs - in `index.html`, `styles.css` or `app.js`.

6. The Practised "buttons" can't be reached with the Tab key, and a screen reader doesn't announce them as buttons.
7. Songs that need practice should have an orange stripe on the left (`--warn`), but no card has one, even after you fix bug 2.
8. On a phone, the Add form runs off the right edge of the screen and the page scrolls sideways. (Use the DevTools device toolbar.)
9. Clicking the 🎵 note in a Practised button does nothing; only clicking the word "Practised" works.
10. Adding a song titled `<img src=x onerror="alert('pwned')">` runs code. (Look closely: the cards are not the problem.)

**Rules**

- Fix, don't rewrite. Keep the existing files, ids, function names and signatures; make the smallest change that fixes each bug. Functions in `lib.js` must stay pure.
- Put a comment next to each fix naming the bug, e.g. `// FIX 4`, `<!-- FIX 6 -->`, or `/* FIX 7 */`.
- Do not edit anything in `test/`.

---

## Part C - Pokémon Team (30 marks, ~30 minutes)

Make Pokémon Team look and work like the screenshots in
`part-c-pokemon-team/`: `expected-desktop.png` (three columns),
`expected-tablet.png` (two columns) and `expected-phone.png` (one column).
`index.html` is finished - don't change it. Add your CSS at the bottom of
`styles.css` and your JavaScript to `app.js`. No libraries. Serve the folder
with `python3 -m http.server`.

| # | Requirement | Marks |
|---|---|---|
| 1 | CSS, mobile first: `#team-list` is a grid - 1 column by default, 2 columns from 40rem, 3 columns from 64rem. Each badge gets its type's colour (`--fire`, `--water`, `--grass`). A card for a Pokémon that was trained today has the class `trained` and is drawn at 60% opacity. | 6 |
| 2 | Load `pokemon.json` with async/await. If it fails or isn't OK, show `Could not load the team.` in `#message`; the rest of the page still works (you can add Pokémon). | 5 |
| 3 | Render each Pokémon as `<li class="card">` with an `<h3>` (name), `<span class="badge fire">` (type), `<p>` (`Level 12`) and a `<button>Train</button>` that carries the Pokémon's id in a `data-id` attribute and is disabled when it was trained today. Use `textContent`, never `innerHTML`. | 7 |
| 4 | Add on submit: no page reload; the new Pokémon gets an id from `crypto.randomUUID()`, level 1 and `trainedToday: false`; a new array (no `push`); reset the form; re-render. | 5 |
| 5 | **Train**: use **one** click listener on `#team-list` (event delegation - not one listener per button). Clicking a button adds 1 to that Pokémon's level and marks it trained today. Update with `map()` and spread - don't change the Pokémon object. Re-render. | 4 |
| 6 | The **Show** menu shows only the Pokémon of that type. The summary in `#summary` always counts the **whole** team, e.g. `6 Pokémon - 2 trained today - highest level 30`; compute the highest level with `reduce()`. | 3 |

**Check yourself:** add a Pokémon named `<b>Pikachu</b>`. Its card should show
the tags as plain text, not bold.
