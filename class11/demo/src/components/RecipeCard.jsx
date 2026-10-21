// One recipe. Everything it shows comes in through props.
export default function RecipeCard({ name, minutes, tags }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>{minutes} min</p>
      <ul className="tags">
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}
