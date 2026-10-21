// Helper functions for Practice Room. There is no DOM code in this file.

// Fetch the list of songs.
// Rejects with Error("HTTP <status>") when the response is not OK.
export async function loadSongs(url = "songs.json") {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

// The songs that need practice: practised `practiceEvery` or more days ago.
export function needsPractice(songs) {
  return songs.filter((song) => song.daysSincePractised > song.practiceEvery);
}

// A NEW array where the song called `title` has just been practised
// (daysSincePractised is 0). The other songs are left as they were.
export function withPractised(songs, title) {
  return songs.map((song) => {
    if (song.title === title) {
      song.daysSincePractised = 0;
    }
    return song;
  });
}

// How many songs there are for each instrument, e.g. { guitar: 2, drums: 1 }.
// An empty list gives {}.
export function countByInstrument(songs) {
  const counts = {};
  for (const song of songs) {
    counts[song.instrument] += 1;
  }
  return counts;
}

// A NEW array with the same songs sorted by title, A to Z.
export function byTitle(songs) {
  return [...songs].sort((a, b) => a.title > b.title);
}
