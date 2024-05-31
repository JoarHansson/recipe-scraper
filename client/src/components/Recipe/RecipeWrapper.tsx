import { RecipeData } from "../../App";
import { RecipeCard } from "./RecipeCard";
import styled from "@emotion/styled";
import { Confetti } from "../Confetti/Confetti";

let Wrapper = styled.section({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
  padding: "1rem",
});

type Props = {
  recipeData: RecipeData;
  loading: boolean;
  confetti: boolean;
};

export const RecipeWrapper = ({ recipeData, loading, confetti }: Props) => {
  let ingredients = recipeData?.ingredients;
  let instructions = recipeData?.instructions;
  let message = loading ? "Fetching recipe..." : "Go get that recipe!";

  return (
    <Wrapper>
      {confetti && <Confetti />}
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
        <div>{message}</div>
      )}
    </Wrapper>
  );
};
