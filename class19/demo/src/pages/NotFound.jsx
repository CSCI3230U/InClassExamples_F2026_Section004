import { Link, useLocation } from "react-router";

// Shown by the path="*" route, and by RecipeDetail for an unknown id.
export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <p>
      No page at <code>{pathname}</code>. <Link to="/">Back to the recipes</Link>
    </p>
  );
}
