import { useState } from "react";
import type { Recipe } from "schema-dts";
import { IoClose } from "react-icons/io5";
import RecipeCard from "./components/RecipeCard/RecipeCard.tsx";
import { IconButtonMenu } from "./components/IconButtonMenu/IconButtonMenu.tsx";

interface AppProps {
  recipes: Recipe[];
}

function App({ recipes }: AppProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(recipes.length === 0);

  if (recipes.length === 0) {
    return (
      <div className="w-full h-full p-4 overflow-y-scroll rounded-lg shadow-md">
        <p>No recipes found</p>
      </div>
    );
  }

  const toggleClosed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <IconButtonMenu /*isCollapsed={isCollapsed}*/>
        <div className="max-h-[90vh] w-100 bg-gray-200 rounded-xl right-0">
          <div onClick={toggleClosed} className="justify-end items-center">
            <IoClose className="text-md" />
          </div>
          {recipes.map((recipe: Recipe, index: number) => (
            <RecipeCard
              key={recipe.name?.toString() || index}
              recipe={recipe}
            />
          ))}
        </div>
      </IconButtonMenu>
    </div>
  );
}

export default App;
