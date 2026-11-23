import { test, expect } from "vitest";
import { filterRecipes } from "./filterRecipes.js";

// Step 3: logic we moved out of HomePage. Now it is a one-line test.
const list = [
  { id: "1", title: "Pad Thai" },
  { id: "2", title: "Beef Stew" },
];

test("search ignores upper/lower case", () => {
  expect(filterRecipes(list, "THAI")).toEqual([list[0]]);
});

test("an empty search shows every recipe", () => {
  expect(filterRecipes(list, "")).toEqual(list);
});

test("a search that matches nothing returns an empty list", () => {
  expect(filterRecipes(list, "zzzz")).toEqual([]);
});
