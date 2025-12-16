import './App.css'
import type { Recipe } from './types/recipe.ts';
import { useEffect, useState } from 'react';

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  console.log(recipes);

  useEffect(() => {
    // This is where getRecipes is triggered
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getRecipes" }, 
          (response) => {
            if (response?.recipes) {
              setRecipes(response.recipes);
            }
          }
        );
      }
    });
  }, []);

  return (
    <>
      <div>
        <p className="read-the-docs">
          {recipes.map((recipe: Recipe) => <div>{recipe.name}</div>)}
        </p>
      </div>
    </>
  )
}

export default App
