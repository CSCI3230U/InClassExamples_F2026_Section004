import { test, expect } from 'vitest';

import { toRecipe } from './recipes';

test("toRecipe maps the API's fields into our recipe dict", () => {
    // setup
    const meal = {
        idMeal: '52772',
        strMeal: 'Teriyaki Chicken',
        strMealThumb: 'https://example.com/teriyaki.jpg',
        strCategory: 'Chicken',
        strArea: 'Japanese',
        strInstructions: 'Marinate, then grill.',
    };

    // execute and compare
    expect(toRecipe(meal)).toEqual({
        id: '52772',
        title: 'Teriyaki Chicken',
        image: 'https://example.com/teriyaki.jpg',
        category: 'Chicken',
        area: 'Japanese',
        description: 'Marinate, then grill.',
    });
});

test('toRecipe tolerates a meal with no instructions', () => {
    // setup
    const meal = {
        idMeal: '1',
        strMeal: 'Mystery Dish',
        strMealThumb: 'https://example.com/x.jpg',
        strCategory: 'Miscellaneous',
        strArea: 'Unknown',
        // strInstructions: 'Marinate, then grill.',
    };

    // execute and compare
    expect(toRecipe(meal).description).toBe('');
});