type Props = {
  ingredients: React.ReactNode;
  instructions: React.ReactNode;
};

export const RecipeCard = ({ ingredients, instructions }: Props) => {
  return (
    <div>
      <div>
        <p>INGREDIENTS</p>
        {ingredients}
      </div>
      <div>
        <p>INSTRUCTIONS</p>
        {instructions}
      </div>
    </div>
  );
};
