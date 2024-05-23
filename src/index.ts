import he from "he";
import { Browser, chromium, Page } from "playwright";
import { urls } from "./testPages.js";

(async () => {
  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const page: Page = await browser.newPage();
  const url: string = urls[2];
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

  // Type for instruction object
  type Instruction = {
    text: string;
    name?: string;
    url?: string; // Not always present
  };

  //Function to generate array of recipeInstructions
  function generateInstructionsArray(
    recipeInstructions: Instruction[]
  ): string[] {
    return recipeInstructions.map((instruction) => instruction.text);
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

    const ingredientsData: string[] = graph[arrayKey].recipeIngredient;
    const instructionsData: string[] = generateInstructionsArray(
      graph[arrayKey].recipeInstructions
    );

    // this logic can be re-used for recipeInstructions when we have it as a string[]
    const encodedIngredients: string[] = ingredientsData.map(
      (ingredient: string) => {
        return he.decode(ingredient);
      }
    );

    const encodedInstructions: string[] = instructionsData.map(
      (instruction: string) => {
        return he.decode(instruction);
      }
    );
    console.log(encodedIngredients);
    console.log(encodedInstructions);
  } // On root level
  else if (parsed.recipeIngredient && parsed.recipeInstructions) {
    console.log("version root");

    const ingredientsData: string[] = parsed.recipeIngredient;
    const instructionsData: string[] = generateInstructionsArray(
      parsed.recipeInstructions
    );

    // this logic can be re-used for recipeInstructions when we have it as a string[]
    const encodedIngredients: string[] = ingredientsData.map(
      (ingredient: string) => {
        return he.decode(ingredient);
      }
    );

    const encodedInstructions: string[] = instructionsData.map(
      (instruction: string) => {
        return he.decode(instruction);
      }
    );

    console.log(encodedIngredients);
    console.log(encodedInstructions);
  } else {
    console.log("data not found");
  }

  await browser.close();
})();
