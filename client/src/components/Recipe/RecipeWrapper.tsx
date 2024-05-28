import { RecipeData } from "../../App";
import { RecipeCard } from "./RecipeCard";

type Props = {
  recipeData: RecipeData;
};

export const RecipeWrapper = ({ recipeData }: Props) => {
  let ingredients = recipeData?.ingredients;
  let instructions = recipeData?.instructions;
  return (
    <section>
      {recipeData ? (
        <RecipeCard
          ingredients={
            !recipeData
              ? "Loading..."
              : ingredients?.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))
          }
          instructions={
            !recipeData
              ? "Loading..."
              : instructions?.map((instruction) => (
                  <ol key={instruction}>{instruction}</ol>
                ))
          }
        ></RecipeCard>
      ) : (
        "Go get that recipe!"
      )}
    </section>
  );
};
