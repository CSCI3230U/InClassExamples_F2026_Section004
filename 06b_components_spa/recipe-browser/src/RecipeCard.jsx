import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import StarRating from './StarRating.jsx';
import { ThemeContext } from './ThemeContext.js';
import { useFavouriteStore, useIsFavourite } from './stores/favourites.js';

export default function RecipeCard({ recipe }) {
    const [cooked, setCooked] = useState(0);
    const [rating, setRating] = useState(0);

    const isFavourite = useIsFavourite(recipe.id);
    const toggle = useFavouriteStore((state) => state.toggle);

    const theme = useContext(ThemeContext); // "dark"

    return (
        <article className="recipe-card">
            <img src={recipe.image} alt={recipe.title} />
            <div className="body">
                <p className="meta">{recipe.category} - {recipe.area}</p>
                <h2>{recipe.title}</h2>
                <p className="description">{recipe.description}</p>
                <StarRating value={rating} onChange={setRating} />
                <div className="actions">
                    {/* we want toggle() to run on click, not during render */}
                    <button className={isFavourite ? 'active' : ''}
                            onClick={() => toggle(recipe)}>
                            {isFavourite ? 'Favourited' : 'Favourite'}
                    </button>
                    <button className={cooked > 0 ? 'active' : ''}
                            onClick={() => setCooked((prev) => prev + 1)}>
                        Cooked {cooked} times
                    </button>
                    <Link to={`/recipes/${recipe.id}`}>View recipe</Link>
                </div>
            </div>
        </article>
    );
}
