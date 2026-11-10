// AI-assisted - see AI-USAGE.md #2

// Pure: returns a new array, never mutates the one passed in.
export function sortRecipes(recipes, sortBy) {
    switch (sortBy) {
        case 'time-asc':
            return [...recipes].sort((a, b) => a.cookTime - b.cookTime);
        case 'time-desc':
            return [...recipes].sort((a, b) => b.cookTime - a.cookTime);
        case 'title-asc':
            return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
        default:
            return [...recipes];
    }
}
