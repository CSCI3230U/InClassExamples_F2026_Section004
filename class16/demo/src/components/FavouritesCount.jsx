import { useFavouriteStore } from "../stores/favourites.js";

// Header badge. Zero props, no Provider: it subscribes to one number.
// It re-renders only when the count changes.
export default function FavouritesCount() {
  const count = useFavouriteStore((s) => s.saved.length);
  return <p className="fav-count">★ {count} favourite{count === 1 ? "" : "s"}</p>;
}
