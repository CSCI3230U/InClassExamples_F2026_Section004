import { useState } from 'react'

import './App.css'

import RecipeCard from './RecipeCard.jsx'

const recipes = [
  {id: 1, image: "/images/Spaghetti_alla_carbonara.jpg", title:"Spaghetti alla Carbonara", category:"Pasta", cookTime: 25, description:"Eggs, cheese, pork, pepper."},
  {id: 2, image: "/images/Greek_salad.jpg", title:"Greek Salad", category:"Salad", cookTime:10, description:"Tomato, cucumber, olives, feta cheese."},
  {id: 3, image: "/images/Fish_tacos.jpg", title:"Fish Tacos",category:"Mexican", cookTime: 20, description:"White fish, lime crema, cabbage."},
];

function App() {
  const [search, setSearch] = useState('');
  const [quick, setQuick] = useState(false);
  const [category, setCategory] = useState('all');

  const visible = recipes 
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    .filter((r) => !quick || r.cookTime <= 20)
    .filter((r) => category === 'all' || r.category === category)


  return (
    <div className="app">
      <header>
        <h1>Recipe Browser</h1>
        <input value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search recipes..." />
        <label>
          <input type="checkbox"
                 checked={quick}
                 onChange={(e) => setQuick(e.target.checked)} />
          Quick recipes only (&lt;= 20 mins)
        </label>
        <select value={category}
                onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="Pasta">Pasta</option>
          <option value="Salad">Salad</option>
          <option value="Mexican">Mexican</option>
        </select>
      </header>
      {visible.length === 0 
      ? <p>No matches</p>
      : <div className="recipe-list">
          {visible.map((r) => (
            <RecipeCard key={r.id} {...r} />
          ))}
        </div>
      }
    </div>
  )
}

export default App
