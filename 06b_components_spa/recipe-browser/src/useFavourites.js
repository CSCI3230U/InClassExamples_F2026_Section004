import { useState, useEffect } from 'react';

export function useFavourites() {
    const stored = JSON.parse(localStorage.getItem('favs') ?? '[]');
    const [ids, setIds] = useState(() => new Set(stored));

    // write to localStorage whenever the set changes
    useEffect(() => {
        localStorage.setItem('favs', JSON.stringify([...ids]));
    }, [ids]);

    const toggle = (id) => 
        setIds((prev) => {
            const next = new Set(prev); // copy of prev (Set)
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    
    return { isFavourite: (id) => ids.has(id), toggle };
}