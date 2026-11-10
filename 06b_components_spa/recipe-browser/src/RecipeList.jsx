import { useState } from 'react';

import RecipeCard from './RecipeCard.jsx';
import FavouritesBadge from './FavouritesBadge.jsx';
import SavedDrawer from './SavedDrawer.jsx';

import { recipes } from './recipes.js';

export default function RecipeList() {
  const [search, setSearch] = useState('');
  const [quick, setQuick] = useState(false);
  const [category, setCategory] = useState('all');

  const visible = recipes
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    .filter((r) => !quick || r.cookTime <= 20)
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
          <label>
            <input type="checkbox"
                   checked={quick}
                   onChange={(e) => setQuick(e.target.checked)} />
            Quick recipes only (&lt;= 20 mins)
          </label>
          <select value={category}
                  onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="Pasta">Pasta</option>
            <option value="Salad">Salad</option>
            <option value="Mexican">Mexican</option>
          </select>
        </div>
      </header>

      <SavedDrawer />

      {visible.length === 0
        ? <p className="empty">No matches</p>
        : <div className="recipe-list">
            {visible.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
      }
    </div>
  )
}
