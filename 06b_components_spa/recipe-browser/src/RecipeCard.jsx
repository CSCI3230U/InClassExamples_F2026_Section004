import { useState } from 'react';

import StarRating from './StarRating.jsx';

export default function RecipeCard({ image, title, category, cookTime, description }) {
    const [fav, setFav] = useState(false);
    const [cooked, setCooked] = useState(0);
    const [rating, setRating] = useState(0);

    return (
        <article className="recipe-card">
            <img src={image} alt={title} />
            <div className="body">
                <p className="meta">{category} - {cookTime} minutes</p>
                <h2>{title}</h2>
                <p className="description">{description}</p>
                <StarRating value={rating} onChange={setRating} />
                <div className="actions">
                    <button className={fav ? 'active' : ''}
                            onClick={() => setFav(!fav)}>
                        {fav ? 'Favourited' : 'Favourite'}
                    </button>
                    <button className={cooked > 0 ? 'active' : ''}
                            onClick={() => setCooked((prev) => prev + 1)}>
                        Cooked {cooked} times
                    </button>
                </div>
            </div>
        </article>
    );
}
