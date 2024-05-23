import { Browser, chromium, Page } from "playwright";
import { urls } from "./testPages.js";

(async () => {
  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const page: Page = await browser.newPage();
  const url: string = urls[10];
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

    const ingredients: string[] = graph[arrayKey].recipeIngredient;
    const instructions: string[] = generateInstructionsArray(
      graph[arrayKey].recipeInstructions
    );
    console.log(ingredients);
    console.log(instructions);
  } // On root level
  else if (parsed.recipeIngredient && parsed.recipeInstructions) {
    console.log("version root");

    const ingredients: string[] = parsed.recipeIngredient;
    const instructions: string[] = generateInstructionsArray(
      parsed.recipeInstructions
    );
    console.log(ingredients);
    console.log(instructions);
  } else {
    console.log("data not found");
  }

  await browser.close();
})();
