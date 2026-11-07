import { useState, useContext } from 'react';

import StarRating from './StarRating.jsx';
import { ThemeContext } from './ThemeContext.js';
import { useFavouriteStore, useIsFavourite } from './stores/favourites.js';

export default function RecipeCard({ recipe }) {
    // const [fav, setFav] = useState(false);
    const [cooked, setCooked] = useState(0);
    const [rating, setRating] = useState(0);
    const isFavourite = useIsFavourite(recipe.id);
    const toggle = useFavouriteStore((state) => state.toggle);

    const theme = useContext(ThemeContext); // "dark"

    return (
        <article className="recipe-card">
            <img src={image} alt={recipe.title} />
            <div className="body">
                <p className="meta">{recipe.category} - {recipe.cookTime} minutes</p>
                <h2>{recipe.title}</h2>
                <p className="description">{recipe.description}</p>
                <StarRating value={recipe.rating} onChange={setRating} />
                <div className="actions">
                    <button className={isFavourite ? 'active' : ''}
                            onClick={toggle(recipe)}>
                            {isFavourite ? 'Favourited' : 'Favourite'}
                    </button>
                    <button className={recipe.cooked > 0 ? 'active' : ''}
                            onClick={() => setCooked((prev) => prev + 1)}>
                        Cooked {recipe.cooked} times
                    </button>
                </div>
            </div>
        </article>
    );
}
