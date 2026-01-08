import type { Recipe } from "schema-dts";
import { getRecipeImageUrl } from "../../../scripts/helpers/recipes";

export interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const imageUrl = getRecipeImageUrl(recipe);

  return (
    <div className="recipe-card m-4 p-4 rounded-lg shadow-md">
      {imageUrl && <img src={imageUrl} alt="recipe-image" />}
    </div>
  );
};

export default RecipeCard;
