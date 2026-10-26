// Pokémon Team - reference solution
const form = document.querySelector("#add-form");
const list = document.querySelector("#team-list");
const filter = document.querySelector("#filter");
const summary = document.querySelector("#summary");
const message = document.querySelector("#message");

let team = [];

// Requirement 2: load the data with async/await
async function loadTeam() {
  const response = await fetch("pokemon.json");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// Requirement 3: one card per Pokémon, built with textContent
function pokemonCard(pokemon) {
  const li = document.createElement("li");
  li.className = pokemon.trainedToday ? "card trained" : "card";

  const name = document.createElement("h3");
  name.textContent = pokemon.name;

  const badge = document.createElement("span");
  badge.className = `badge ${pokemon.type}`;
  badge.textContent = pokemon.type;

  const level = document.createElement("p");
  level.textContent = `Level ${pokemon.level}`;

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = pokemon.id;
  button.disabled = pokemon.trainedToday;
  button.textContent = "Train";

  li.append(name, badge, level, button);
  return li;
}

function render() {
  // Requirement 6: filter what is shown, but summarize the whole team
  const visible =
    filter.value === "all" ? team : team.filter((pokemon) => pokemon.type === filter.value);

  list.replaceChildren();
  for (const pokemon of visible) {
    list.append(pokemonCard(pokemon));
  }

  const trained = team.filter((pokemon) => pokemon.trainedToday).length;
  const highest = team.reduce((max, pokemon) => Math.max(max, pokemon.level), 0);
  summary.textContent = `${team.length} Pokémon - ${trained} trained today - highest level ${highest}`;
}

// Requirement 4: add on submit
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const pokemon = {
    id: crypto.randomUUID(),
    name: data.get("name"),
    type: data.get("type"),
    level: 1,
    trainedToday: false,
  };
  team = [...team, pokemon];
  form.reset();
  render();
});

// Requirement 5: one delegated listener for every Train button
list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  team = team.map((pokemon) =>
    pokemon.id === button.dataset.id ? { ...pokemon, level: pokemon.level + 1, trainedToday: true } : pokemon,
  );
  render();
});

filter.addEventListener("change", render);

try {
  team = await loadTeam();
} catch (error) {
  message.textContent = "Could not load the team.";
}
render();
