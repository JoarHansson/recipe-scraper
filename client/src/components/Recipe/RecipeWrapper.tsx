import { RecipeData } from "../../App";
import { RecipeCard } from "./RecipeCard";
import styled from "@emotion/styled";

let Wrapper = styled.section({
  background: "hotpink",
});

type Props = {
  recipeData: RecipeData;
  loading: boolean;
};

export const RecipeWrapper = ({ recipeData, loading }: Props) => {
  let ingredients = recipeData?.ingredients;
  let instructions = recipeData?.instructions;

  let message = loading ? "Loading..." : "Go get that recipe!";

  return (
    <Wrapper>
      {Object.keys(recipeData).length > 0 ? (
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
                  <li key={instruction}>{instruction}</li>
                ))
          }
        ></RecipeCard>
      ) : (
        message
      )}
    </Wrapper>
  );
};
