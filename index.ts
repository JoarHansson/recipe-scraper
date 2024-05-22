import { chromium } from "playwright";
import { urls } from "./testPages";
import he from "he";

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const url = urls[0];

  await page.goto(url);

  // Get all scripts of type "application/ld+json" from the provided url
  const jsonLdData: string[] = await page.evaluate(() => {
    const scriptTags: NodeListOf<HTMLScriptElement> = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    const data: string[] = [];

    scriptTags.forEach((scriptTag: HTMLScriptElement) => {
      data.push(scriptTag.innerHTML);
    });

    return data;
  });

  let scriptWithRecipeData: string = "";

  // Find the correct json string
  jsonLdData.forEach((jsonString: string) => {
    if (jsonString.includes("recipeIngredient")) {
      scriptWithRecipeData = jsonString;
    }
  });

  // Parse the correct json string
  const parsed = JSON.parse(scriptWithRecipeData);

  if (jsonLdData) {
    console.log(true);
  } else {
    console.log(false);
  }

  // Check if desired data is on graph or root level
  //On graph level
  if (parsed["@graph"]) {
    console.log("version graph");

    const graph = parsed["@graph"];

    type GraphObject = {
      "@type": string | Array<any>;
    };

    let arrayKey: number = 0;

    // Get the recipe object
    graph.forEach((obj: GraphObject) => {
      if (obj["@type"] === "Recipe") {
        arrayKey = graph.indexOf(obj);
      }
    });

    const ingredientsData = graph[arrayKey].recipeIngredient;
    const instructionsData = graph[arrayKey].recipeInstructions;

    console.log(ingredientsData);
    console.log(instructionsData);

    // this logic can be re-used for recipeInstructions when we have it as a string[]
    const parsedIngredients: string[] = ingredientsData.map(
      (ingredient: string) => {
        return he.decode(ingredient);
      }
    );

    console.log(parsedIngredients);
  } // On root level
  else if (parsed.recipeIngredient && parsed.recipeInstructions) {
    console.log("version root");

    console.log(parsed.recipeIngredient);
    console.log(parsed.recipeInstructions);

    // this logic can be re-used for recipeInstructions when we have it as a string[]
    const parsedIngredients: string[] = parsed.recipeIngredient.map(
      (ingredient: string) => {
        return he.decode(ingredient);
      }
    );

    console.log(parsedIngredients);
  } else {
    console.log("data not found");
  }

  await browser.close();
})();
