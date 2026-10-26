# Practice Midterm - Solutions

- Part A: [`part-a-answers.md`](part-a-answers.md)
- Part B: [`part-b-practice-room/`](part-b-practice-room/) - every fix is marked `FIX N`
- Part C: [`part-c-pokemon-team/`](part-c-pokemon-team/) - comments point to each requirement

## Part B - what was wrong

| Bug | Cause | Fix |
|---|---|---|
| 1 | The `try/catch` inside `loadSongs` catches its own `throw`, logs it, and returns `undefined`. The caller never sees the error. | Re-throw in the `catch` (`throw error;`), or remove the `try/catch`. |
| 2 | `>` misses the songs that are exactly due. | `>=` |
| 3 | `map` returns a new array, but the callback changes the song object itself, so the original list changes too. | `song.title === title ? { ...song, daysSincePractised: 0 } : song` |
| 4 | `counts[instrument]` starts as `undefined`, and `undefined + 1` is `NaN`. | `counts[instrument] = (counts[instrument] ?? 0) + 1` |
| 5 | A comparator must return a number (negative, 0, positive). `a.title > b.title` returns a boolean, so `false` reads as "equal" and nothing moves. | `a.title.localeCompare(b.title)` |
| 6 | The Practised control is a `<span>`: not focusable and not a button to assistive tech. | `document.createElement("button")` |
| 7 | `--warn` is defined on `header`, so only `header` and its children can see it. The cards are in `main`. | Move `--warn` into `:root`. |
| 8 | The form is a flex row with no wrapping, so its children can't wrap onto a new line. | `flex-wrap: wrap` on `form` |
| 9 | When you click the note, `event.target` is the inner `<span>`, which has no `data-title`. | `event.target.closest("[data-title]")` |
| 10 | The "Added …" notice uses `innerHTML` with the song's title. | `notice.textContent = \`Added ${song.title}.\`` |

## Part C - common mistakes

- Media queries in the wrong order (64rem before 40rem): at desktop width the 2-column rule wins.
- `pokemon.level += 1` inside `map`: it returns a new array but changes the old objects (same problem as Part B bug 3).
- `event.target.dataset.id` instead of `closest(...)`: works today, breaks as soon as the button has an icon inside.
- Computing the summary from the *filtered* list: the counts change when you pick a type.
- `reduce` without a starting value: crashes when the list is empty (e.g. when the load fails).
