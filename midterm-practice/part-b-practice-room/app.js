import { loadSongs, needsPractice, withPractised, countByInstrument, byTitle } from "./lib.js";

const form = document.querySelector("#add-form");
const notice = document.querySelector("#notice");
const list = document.querySelector("#song-list");
const show = document.querySelector("#show");
const sorted = document.querySelector("#sorted");
const summary = document.querySelector("#summary");
const message = document.querySelector("#message");

let songs = [];

function songCard(song, due) {
  const li = document.createElement("li");
  li.className = due ? "card due" : "card";

  const title = document.createElement("h3");
  title.textContent = song.title;

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = song.instrument;

  const detail = document.createElement("p");
  detail.textContent = `Every ${song.practiceEvery} days - practised ${song.daysSincePractised} days ago`;

  const practise = document.createElement("span");
  practise.className = "practise";
  practise.dataset.title = song.title;
  const note = document.createElement("span");
  note.setAttribute("aria-hidden", "true");
  note.textContent = "🎵";
  practise.append(note, " Practised");

  li.append(title, badge, detail, practise);
  return li;
}

function render() {
  const due = needsPractice(songs);
  let visible = show.value === "due" ? due : songs;
  if (sorted.checked) {
    visible = byTitle(visible);
  }

  list.replaceChildren();
  for (const song of visible) {
    list.append(songCard(song, due.includes(song)));
  }

  const instruments = Object.entries(countByInstrument(songs))
    .map(([instrument, count]) => `${count} ${instrument}`)
    .join(", ");
  summary.textContent = `${songs.length} songs - ${due.length} need practice - ${instruments}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const song = {
    title: data.get("title"),
    instrument: data.get("instrument"),
    practiceEvery: Number(data.get("every")),
    daysSincePractised: 0,
  };
  songs = [...songs, song];
  notice.innerHTML = `Added <strong>${song.title}</strong>.`;
  form.reset();
  render();
});

list.addEventListener("click", (event) => {
  const title = event.target.dataset.title;
  if (!title) return;
  songs = withPractised(songs, title);
  render();
});

show.addEventListener("change", render);
sorted.addEventListener("change", render);

try {
  songs = await loadSongs();
} catch (error) {
  message.textContent = `Could not load songs: ${error.message}`;
}
render();
