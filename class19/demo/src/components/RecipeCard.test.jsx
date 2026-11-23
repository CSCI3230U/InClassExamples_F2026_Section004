import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import RecipeCard from "./RecipeCard.jsx";
import { useFavouriteStore } from "../stores/favourites.js";

// Step 2: a component test. Find things the way a user would (role + name),
// and check what the user can observe (aria-pressed), not the store.
const recipe = { id: "1", title: "Carbonara", image: "x.jpg" };

// The store lives outside React, so tests would share it: reset it.
beforeEach(() => useFavouriteStore.setState({ saved: [] }));

test("clicking the star marks the recipe as a favourite", async () => {
  // Arrange: RecipeCard has a <Link>, which only works inside a router.
  render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} />
    </MemoryRouter>,
  );
  const star = screen.getByRole("button", { name: "Favourite" });

  // Act
  await userEvent.click(star);

  // Assert
  expect(star.getAttribute("aria-pressed")).toBe("true");
});

test("clicking the star twice removes the favourite", async () => {
  render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} />
    </MemoryRouter>,
  );
  const star = screen.getByRole("button", { name: "Favourite" });

  await userEvent.click(star);
  await userEvent.click(star);

  expect(star.getAttribute("aria-pressed")).toBe("false");
});

test("the title links to the recipe's page", () => {
  render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} />
    </MemoryRouter>,
  );
  const link = screen.getByRole("link", { name: "Carbonara" });
  expect(link.getAttribute("href")).toBe("/recipes/1");
});
