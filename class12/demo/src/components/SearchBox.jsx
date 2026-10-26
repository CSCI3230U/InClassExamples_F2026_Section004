// The search text lives in App, because RecipeList needs it too.
// This component shows it and reports changes: data down, events up.
export default function SearchBox({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Search recipes"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
