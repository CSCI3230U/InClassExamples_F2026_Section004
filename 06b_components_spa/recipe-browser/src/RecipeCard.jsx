import { useState } from 'react';

export default function RecipeCard({ image, title, category, cookTime, description }) {
    const [fav, setFav] = useState(false);
    const [cooked, setCooked] = useState(0);

    return (
        <article className="recipe-card">
            <img src={image} alt={title} />
            <div className="body">
                <h2>{title}</h2>
                <p className="meta">{category} - {cookTime} minutes</p>
                <p className="description">{description}</p>
                <button onClick={() => setFav(!fav)}>{fav ? 'Favourited' : 'Favourite'}</button>
                <button onClick={() => setCooked((prev) => prev + 1)}>Cooked {cooked} times</button>
            </div>
        </article>
    );
}