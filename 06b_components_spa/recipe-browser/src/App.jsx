import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import RecipeCard from './RecipeCard.jsx'

const recipes = [
  {id: 1, image: "/images/Spaghetti_alla_carbonara.jpg", title:"Spaghetti alla Carbonara", category:"Pasta", cookTime: 25, description:"Eggs, cheese, pork, pepper."},
  {id: 2, image: "/images/Greek_salad.jpg", title:"Greek Salad", category:"Salad", cookTime:10, description:"Tomato, cucumber, olives, feta cheese."},
  {id: 3, image: "/images/Fish_tacos.jpg", title:"Fish Tacos",category:"Mexican", cookTime: 20, description:"White fish, lime crema, cabbage."},
];

function App() {
  return (
    <div className="app">
      <header>
        <h1>Recipe Browser</h1>
      </header>
      <div className="recipe-list">
        {recipes.map((r) => (
          <RecipeCard key={r.id} {...r} />
        ))};
      </div>
    </div>
  )
}

export default App
