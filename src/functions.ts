import he from "he";
import { Browser, chromium, Page } from "playwright";

// Type for instruction object
type Instruction = {
  text: string;
  name?: string;
  url?: string; // Not always present
};

type GraphObject = {
  "@type": string | any[];
  recipeIngredient: string[];
  recipeInstructions: Instruction[];
};

type RawRecipeData = GraphObject | { "@graph": GraphObject[] };

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

export const getScrapedRecipe = async (
  url: string
): Promise<{ ingredients: string[]; instructions: string[] }> => {
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

    await browser.close();

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
    const rawRecipeData: RawRecipeData = JSON.parse(scriptWithRecipeData);

    let recipeData: GraphObject | undefined;

    //
    if ("@graph" in rawRecipeData) {
      const graph: GraphObject[] = rawRecipeData["@graph"];

      // Get the recipe object
      recipeData = graph.find((obj: GraphObject) => {
        return obj["@type"] === "Recipe";
      });
    } else {
      recipeData = rawRecipeData;
    }

    if (!recipeData) {
      throw new Error("no recipedata found");
    }

    const ingredientsData = recipeData.recipeIngredient;
    const instructionsData: string[] = generateInstructionsArray(
      recipeData.recipeInstructions
    );

    const decodeIngredients: string[] = decodeData(ingredientsData);
    const decodeInstructions: string[] = decodeData(instructionsData);

    return {
      ingredients: decodeIngredients,
      instructions: decodeInstructions,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
