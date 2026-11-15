// A controlled input: the text lives in App (state), the input shows it,
// and every keystroke sends the new text back up through onChange.
export default function SearchBox({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Search recipes"
      aria-label="Search recipes"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
