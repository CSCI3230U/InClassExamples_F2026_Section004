import { useSharedFavourites } from "../stores/favourites.js";

// Unrelated to RecipeList: no shared parent passes it anything.
export default function FavouritesCount() {
  const { count } = useSharedFavourites();
  return <p className="fav-count">★ {count} favourite{count === 1 ? "" : "s"}</p>;
}
