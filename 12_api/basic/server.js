import express from 'express';

const app = express();

app.use(express.json());

const recipes = [
    { id: 1, title: 'Carbonara' },
    { id: 2, title: 'Tacos al Pastor' },
];

app.get('/api/recipes', (request, response) => {
    response.json(recipes);
});

app.post('/api/recipes', (request, response) => {
    recipes.push({ id: recipes.length + 1, ...request.body });
    response.status(201).end();
});

app.listen(3001, () => {
    console.log('Listening on port 3001.');
});