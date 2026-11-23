import { test, expect } from "vitest";
import { toRecipe } from "./api.js";

// Step 1: a pure function. No server, no page, no clicks.
test("toRecipe maps the API's fields to our shape", () => {
  const meal = { idMeal: "52772", strMeal: "Carbonara", strMealThumb: "x.jpg" };
  expect(toRecipe(meal)).toEqual({ id: "52772", title: "Carbonara", image: "x.jpg" });
});

// Step 4: an edge case. TheMealDB sends a meal with no strMeal.
// Without the fix in toRecipe this is RED (received undefined),
// and filterRecipes then crashes on undefined.toLowerCase().
test("toRecipe gives a missing title a fallback", () => {
  expect(toRecipe({ idMeal: "1" }).title).toBe("Untitled");
});
