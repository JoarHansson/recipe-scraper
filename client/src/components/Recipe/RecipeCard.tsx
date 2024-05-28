import styled from "@emotion/styled";

const Wrapper = styled.div({
  "@media (min-width: 1100px)": {
    flexDirection: "row",
    maxWidth: "1200px",
    padding: "2rem",
  },
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  maxWidth: "800px",
});

const IngredientsDiv = styled.div({
  "@media (min-width: 1100px)": {
    width: "50%",
  },
});

const InstructionsDiv = styled.div({
  "@media (min-width: 1100px)": {
    width: "50%",
  },
});

const StyledOl = styled.ol({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
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
        <div>{ingredients}</div>
      </IngredientsDiv>
      <InstructionsDiv>
        <h2>Instructions</h2>
        <StyledOl>{instructions}</StyledOl>
      </InstructionsDiv>
    </Wrapper>
  );
};
