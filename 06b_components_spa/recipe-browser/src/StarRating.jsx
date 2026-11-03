// AI Assisted - see AI-USAGE.md #1
export default function StarRating({ value, onChange }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="star-rating">
            {stars.map((n) => (
                <button key={n}
                        className="star"
                        aria-label={`Rate ${n} ${n === 1 ? 'star' : 'stars'}`}
                        onClick={() => onChange(n)}>
                    {n <= value ? '★' : '☆'}
                </button>
            ))}
        </div>
    );
}
