import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { API, toRecipe } from './recipes.js';

export default function RecipeDetail() {
    const { id } = useParams();
    // const recipe = recipes.find((r) => String(r.id) === id);
    const [recipe, setRecipe] = useState(null);
    const [loadStatus, setLoadStatus] = useState('loading');

    useEffect(() => {
        setLoadStatus('loading');

        const controller = new AbortController();

        fetch(`${API}/lookup.php?i=${id}`, 
              { signal: controller.signal})
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP Response: ${response.status}`);

            return response.json();
          })
          .then((data) => {
            setRecipe(data.meals ? toRecipe(data.meals[0]) : null);
            setLoadStatus('ok');
          })
          .catch((error) => {
            if (error.name === 'AbortError') return;

            console.error(error);
            setLoadStatus('error');
          });
        return () => controller.abort();
    }, [id]);

    if (loadStatus === 'loading') return <p>Loading recipe...</p>;
    if (loadStatus === 'error') return <p>Could not load this recipe. <Link to="/">Back</Link></p>
    if (!recipe) return <p className="recipe-missing">No such recipe. <Link to="/">Back</Link></p>
    return (
        <article className="recipe-detail">
            <Link className="back-link" to="/">Back to recipes</Link>
            <h1>{recipe.title}</h1>
            <p className="meta">{recipe.category} - {recipe.area}</p>
            <img src={recipe.image} alt={recipe.title} />
            <p className="description">{recipe.description}</p>
        </article>
    );
}
