import { useParams, Link } from 'react-router-dom';

import { recipes } from './recipes.js';

export default function RecipeDetail() {
    const { id } = useParams();
    const recipe = recipes.find((r) => String(r.id) === id);

    if (!recipe) return <p className="recipe-missing">No such recipe. <Link to="/">Back</Link></p>
    return (
        <article className="recipe-detail">
            <Link className="back-link" to="/">Back to recipes</Link>
            <h1>{recipe.title}</h1>
            <p className="meta">{recipe.category} - {recipe.cookTime} minutes</p>
            <img src={recipe.image} alt={recipe.title} />
            <p className="description">{recipe.description}</p>
        </article>
    );
}
