import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchJson, recipeUrl, toRecipe } from "../api.js";
import NotFound from "./NotFound.jsx";

// The "/recipes/:id" page. Same pattern as HomePage: the id comes from the
// URL, the recipe comes from the web service.
export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchJson(recipeUrl(id), { signal: controller.signal })
      .then((data) => {
        const meal = data.meals?.[0];
        if (!meal) return setStatus("missing"); // unknown id: meals is null
        // Map at the boundary, plus two fields only this page needs.
        setRecipe({ ...toRecipe(meal), area: meal.strArea, instructions: meal.strInstructions });
        setStatus("ok");
      })
      .catch((e) => {
        if (e.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, [id]);

  if (status === "missing") return <NotFound />;
  if (status === "error") return <p className="error">Could not load this recipe.</p>;
  if (status !== "ok") return <p className="loading">Loading…</p>;

  return (
    <article className="detail">
      <img src={recipe.image} alt="" />
      <h2>{recipe.title}</h2>
      {recipe.area && <p>{recipe.area}</p>}
      <p className="instructions">{recipe.instructions}</p>
      <Link to="/">← All recipes</Link>
    </article>
  );
}
