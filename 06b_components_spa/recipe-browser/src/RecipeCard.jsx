export default function RecipeCard({ image, title, category, cookTime, description }) {
    return (
        <article className="recipe-card">
            <img src={image} alt={title} />
            <div className="body">
                <h2>{title}</h2>
                <p className="meta">{category} - {cookTime} minutes</p>
                <p className="description">{description}</p>
            </div>
        </article>
    );
}