import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavouriteStore = create(
    persist(
        (set) => ({
            saved: [],

            toggle: (recipe) => 
                set((state) => ({
                    saved: state.saved.some((r) => r.id === recipe.id) 
                           ? state.saved.filter((r) => r.id !== recipe.id)
                           : [...state.saved, recipe],
                })),
            
            remove: (id) =>
                set((state) => ({
                    saved: state.saved.filter((r) => r.id !== id)
                })),

            clear: () => set({ saved: [] }),
        }),
        { name: 'recipe-browser:favourites'},
    ),
);

// hack to experiment in the console
window.useFavouriteStore = useFavouriteStore;

export const useIsFavourite = (id) => useFavouriteStore((state) => state.saved.some((r) => r.id === id));

export const useFavouriteCount = () => useFavouriteStore((state) => state.saved.length);