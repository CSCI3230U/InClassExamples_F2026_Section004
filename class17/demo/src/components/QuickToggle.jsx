// A controlled checkbox. Like SearchBox, it has no state of its own:
// App owns `checked`, this component shows it and reports changes.
// A checkbox reports e.target.checked (true/false), not e.target.value.
export default function QuickToggle({ checked, onChange, count }) {
  return (
    <label className="quick">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      Quick (≤ 20 min)
      {/* count > 0, not count: when count is 0, {count && ...} shows "0". */}
      {count > 0 && <span className="badge">{count}</span>}
    </label>
  );
}
