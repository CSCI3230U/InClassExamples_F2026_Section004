import { useState } from 'react';
import { useFavouriteStore } from './stores/favourites';

export default function SavedDrawer() {
    const [open, setOpen] = useState(false);
    
    const saved = useFavouriteStore((state) => state.saved);
    const remove = useFavouriteStore((state) => state.remove);
    const clear = useFavouriteStore((state) => state.clear);

    if (saved.length === 0) return null;

    return (
        <section className="saved-drawer">
            <button className="saved-drawer-toggle" onClick={() => setOpen((p) => !p)} aria-expanded={open}>
                {open ? "\u25BE" : "\u25B8"} Your saved recipes ({saved.length})
            </button>
            {open && (
                <>
                    <ul className="saved-list">
                        {saved.map((r) => (
                            <li key={r.id} className="saved-item">
                                <img src={r.image} alt={r.title} />
                                <span className="saved-item-title">{r.title}</span>
                                <button onClick={() => remove(r.id)} aria-label={`Remove ${r.title}`}>&times;</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={clear}>Clear All</button>
                </>
            )}
        </section>
    );

}