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
  "@type": string | any[];
  recipeIngredient: string[];
  recipeInstructions: Instruction[];
};

type RawRecipeData = GraphObject | { "@graph": GraphObject[] };

//Function to generate array of recipeInstructions
function generateStringArray(recipeInstructions: Instruction[]): string[] {
  return recipeInstructions.map((instruction) => instruction.text);
}

// Function to decode ingredients and instructions
function decodeData(data: string[]): string[] {
  return data.map((item: string) => he.decode(item));
}

// function to use in catch blocks
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
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
      throw new Error("no recipe data found");
    }

    const ingredientsData = recipeData.recipeIngredient;
    let instructionsArray: any[] = []; // Initialize as an array of any type
    let instructionsData: string[] = [];

    if (
      Array.isArray(recipeData.recipeInstructions) &&
      recipeData.recipeInstructions.length > 0
    ) {
      instructionsArray = recipeData.recipeInstructions;
    } else {
      throw new Error("Instructions is not an correct array or it is empty");
    }

    if (instructionsArray.length > 0) {
      if (typeof instructionsArray[0] === "string") {
        instructionsData = instructionsArray as string[];
      } else if (typeof instructionsArray[0] === "object") {
        instructionsData = generateStringArray(instructionsArray);
      } else {
        throw new Error(
          "Instructions must be of either type objects or strings"
        );
      }
    } else {
      throw new Error("Instructions array is empty");
    }

    const decodedIngredients: string[] = decodeData(ingredientsData);
    const decodedInstructions: string[] = decodeData(instructionsData);

    return {
      ingredients: decodedIngredients,
      instructions: decodedInstructions,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
