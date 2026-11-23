// Pulled out of HomePage so it can be tested without React:
// a pure function, same input -> same output.
export function filterRecipes(recipes, query) {
  const q = query.toLowerCase();
  return recipes.filter((r) => r.title.toLowerCase().includes(q));
}
