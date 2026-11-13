import { useState, useEffect } from 'react';

import RecipeCard from './RecipeCard.jsx';
import FavouritesBadge from './FavouritesBadge.jsx';
import SavedDrawer from './SavedDrawer.jsx';

import { API, toRecipe } from './recipes.js';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loadStatus, setLoadStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setLoadStatus('loading');

    const controller = new AbortController();

    const api = `${API}/search.php?s=${encodeURIComponent(search)}`;

    console.log(api);
    fetch(api,
          { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP Response: ${response.status}`);

        return response.json();
      })
      .then((data) => {
        setRecipes((data.meals ?? []).map(toRecipe));
        setLoadStatus('ok');
      })
      .catch((error) => {
        console.error(error);
        setLoadStatus('error');
      });
    return () => controller.abort();
  }, [search]);

  const visible = recipes
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    .filter((r) => category === 'all' || r.category === category)

  return (
    <div className="app">
      <header>
        <h1>Recipe Browser</h1>
        <FavouritesBadge />

        <div className="filters">
          <input value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search recipes..." />
          <select value={category}
                  onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="Chicken">Chicken</option>
            <option value="Dessert">Dessert</option>
            <option value="Pasta">Pasta</option>
            <option value="Seafood">Seafood</option>
            <option value="Vegetarian">Vegetarian</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Default</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </header>

      <SavedDrawer />

      {loadStatus === 'loading' && <p>Loading recipes...</p>}
      {loadStatus === 'error' && <p>Could not load recipes.</p>}
      {loadStatus === 'ok' && (
        visible.length === 0
        ? <p className="empty">No matches</p>
        : <div className="recipe-list">
            {visible.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
      )}
    </div>
  )
}
