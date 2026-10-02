export async function loadTags() {
    try {
        const response = await fetch('tags.json');
        if (!response.ok) {
            throw new Error(`HTTP: ${response.status}`);
        }
        const books = await response.json();
        return books;
    } catch (error) {
        console.error('Failed to load:', error);
        return [];
    }
}