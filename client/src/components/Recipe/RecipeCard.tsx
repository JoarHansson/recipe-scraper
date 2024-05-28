import styled from "@emotion/styled";

const Wrapper = styled.div({
  "@media (min-width: 1100px)": {
    flexDirection: "row",
  },
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  background: "lightblue",
});

const IngredientsDiv = styled.div({
  "@media (min-width: 1100px)": {
    width: "50%",
    background: "pink",
  },
  background: "yellow",
});

const InstructionsDiv = styled.div({
  "@media (min-width: 1100px)": {
    width: "50%",
    background: "pink",
  },
  background: "green",
});

type Props = {
  ingredients: React.ReactNode;
  instructions: React.ReactNode;
};

export const RecipeCard = ({ ingredients, instructions }: Props) => {
  return (
    <Wrapper>
      <IngredientsDiv>
        <h2>Ingredients</h2>
        {ingredients}
      </IngredientsDiv>
      <InstructionsDiv>
        <h2>Instructions</h2>
        <ol>{instructions}</ol>
      </InstructionsDiv>
    </Wrapper>
  );
};
