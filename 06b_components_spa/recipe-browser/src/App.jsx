import { Routes, Route } from 'react-router-dom';

import RecipeList from './RecipeList.jsx';
import RecipeDetail from './RecipeDetail.jsx';
import NotFound from './NotFound.jsx';

import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RecipeList />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
