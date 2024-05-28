import { useState } from "react";
import "./App.css";
import { Form } from "./components/Form/Form";
import { RecipeWrapper } from "./components/Recipe/RecipeWrapper";

export type RecipeData =
  | undefined
  | {
      ingredients?: Ingredients;
      instructions?: Instructions;
    }
  | {
      message?: string;
    };

type Ingredients = string[];

type Instructions = string[];

function App() {
  const [recipeData, setRecipeData] = useState<RecipeData>();
  const [url, setUrl] = useState<string>();

  async function getRecipeData(url?: string) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        url: url,
      }),
    };

    const response = await fetch(
      "http://localhost:3001/recipe",
      requestOptions
    );

    const data = await response.json();

    setRecipeData(data as RecipeData);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(url);
    getRecipeData(url);
  }

  console.log(recipeData?.message);

  return (
    <div className="App">
      <h1>Recipe declutter</h1>
      <Form handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
      <RecipeWrapper recipeData={recipeData} />
    </div>
  );
}

export default App;
