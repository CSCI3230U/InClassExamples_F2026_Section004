import { useFavouriteCount } from './stores/favourites.js';

export default function FavouritesBadge() {
    const count = useFavouriteCount();

    return (
        <div className="favourite-summary">
            &hearts; <strong>{count}</strong> saved
        </div>
    );
}