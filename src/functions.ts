import he from "he";
import { Browser, chromium, Page } from "playwright";
import { decode } from "punycode";

// Type for instruction object
type Instruction = {
  text: string;
  name?: string;
  url?: string; // Not always present
};

type GraphObject = {
  "@type": string | Array<any>;
};

//Function to generate array of recipeInstructions
function generateInstructionsArray(
  recipeInstructions: Instruction[]
): string[] {
  return recipeInstructions.map((instruction) => instruction.text);
}

// Function to decode ingredients and instructions
function decodeData(data: string[]): string[] {
  return data.map((item: string) => he.decode(item));
}

//TODO JULIA: Write function for string or object array logic

export const getScrapedRecipe = async (url: string) => {
  try {
    const browser: Browser = await chromium.launch({
      headless: true,
    });

    const page: Page = await browser.newPage();
    await page.goto(url);

    // Get all scripts of type "application/ld+json" from the provided url
    const jsonLdData: string[] = await page.evaluate(() => {
      const scriptTags: NodeListOf<HTMLScriptElement> =
        document.querySelectorAll('script[type="application/ld+json"]');

      const data: string[] = [];

      scriptTags.forEach((scriptTag: HTMLScriptElement) => {
        data.push(scriptTag.innerHTML);
      });

      return data;
    });

    let scriptWithRecipeData: string = "";

    // Find the correct json string
    jsonLdData.forEach((jsonString: string) => {
      if (
        jsonString.includes("recipeIngredient") &&
        jsonString.includes("recipeInstructions")
      ) {
        scriptWithRecipeData = jsonString;
      }
    });

    if (!scriptWithRecipeData) {
      throw new Error("no application/ld+json scripts");
    }

    // Parse the correct json string
    const parsed = JSON.parse(scriptWithRecipeData);

    // Check if desired data is on graph or root level
    //On graph level
    if (parsed["@graph"]) {
      console.log("version graph");

      const graph = parsed["@graph"];

      let arrayKey: number = 0;

      // Get the recipe object
      graph.forEach((obj: GraphObject) => {
        if (obj["@type"] === "Recipe") {
          arrayKey = graph.indexOf(obj);
        }
      });

      const ingredientsData = graph[arrayKey].recipeIngredient;
      const instructionsData: string[] = generateInstructionsArray(
        graph[arrayKey].recipeInstructions
      );

      //TODO JULIA: Add function for string or object array logic

      const decodeIngredients: string[] = decodeData(ingredientsData);
      const decodeInstructions: string[] = decodeData(instructionsData);

      return {
        ingredients: decodeIngredients,
        instructions: decodeInstructions,
      };
    } // On root level
    else if (parsed.recipeIngredient && parsed.recipeInstructions) {
      console.log("version root");

      const ingredientsData: string[] = parsed.recipeIngredient;

      let instructionsData: string[];
      if (
        Array.isArray(parsed.recipeInstructions) &&
        parsed.recipeInstructions.length > 0 &&
        typeof parsed.recipeInstructions[0] === "object"
      ) {
        // If recipeInstructions is an array of objects, process it with generateInstructionsArray
        instructionsData = generateInstructionsArray(parsed.recipeInstructions);
      } else {
        // Otherwise, use it as is
        instructionsData = parsed.recipeInstructions;
      }

      const decodeIngredients: string[] = decodeData(ingredientsData);
      const decodeInstructions: string[] = decodeData(instructionsData);

      return {
        ingredients: decodeIngredients,
        instructions: decodeInstructions,
      };
    } else {
      console.log("data not found");
    }

    await browser.close();
  } catch (error) {
    console.error(error);
    return error;
  }
};
