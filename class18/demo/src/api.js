// Everything about TheMealDB lives in this file.
// TheMealDB is a free recipe web service: you request a URL, it answers with JSON.
const API = "https://www.themealdb.com/api/json/v1/1";

export const categoryUrl = (category) => `${API}/filter.php?c=${category}`;
export const recipeUrl = (id) => `${API}/lookup.php?i=${id}`;

// Step 3: map at the boundary.
// TheMealDB's shape: { idMeal, strMeal, strMealThumb, ... }
// Our shape:         { id, title, image }
// Components only ever see our shape. If the API renames a field,
// this is the only function to fix.
export function toRecipe(meal) {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
  };
}

// The real API answers in ~100 ms, too fast to see the race in class.
// With SLOW = true every request waits a random 0.3 to 2 seconds first,
// so answers come back in a different order than you asked.
const SLOW = true;

export function fetchJson(url, { signal } = {}) {
  const wait = SLOW ? 300 + Math.random() * 1700 : 0;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      fetch(url, { signal })
        // fetch only rejects when no answer arrives; a 404 or 500 is
        // still an answer, so check r.ok ourselves.
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then(resolve, reject);
    }, wait);
    // If the request is cancelled while we are still waiting, stop here too.
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
