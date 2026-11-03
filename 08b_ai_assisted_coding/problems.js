function RecipeCount({ recipes }) {
    const [n, setN] = useState(0);
    setN(recipes.length);
    return <p>{n} recipes</p>;
}

// placeholder for a state { tags, setTags } = ...
const tags = [];
function setTags(tags) {
    // placeholder
}

function addTag(tag) {
    tags.push(tag);
    setTags(tags);

    // correction:
    // setTags([...tags, tag]);
}

