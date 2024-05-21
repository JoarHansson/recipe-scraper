import { chromium } from "playwright";
import { urls } from "./testPages";

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const url = urls[0];

  // get all scripts of type "application/ld+json" from the provided url
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

  // find the correct json string
  jsonLdData.forEach((jsonString: string) => {
    if (jsonString.includes("recipeIngredient")) {
      scriptWithRecipeData = jsonString;
    }
  });

  const parsed = JSON.parse(scriptWithRecipeData);

  if (jsonLdData) {
    console.log(true);
  } else {
    console.log(false);
  }

  // console.log(parsed);

  if (parsed["@graph"]) {
    console.log("version graph");

    const graph = parsed["@graph"];

    type GraphObject = {
      "@type": string | Array<any>;
    };

    let arrayKey: number = 0;

    // get the correct object
    graph.forEach((obj: GraphObject) => {
      if (obj["@type"] === "Recipe") {
        arrayKey = graph.indexOf(obj);
      }
    });

    console.log(graph[arrayKey].recipeIngredient);
    console.log(graph[arrayKey].recipeInstructions);
  } else if (parsed.recipeIngredient && parsed.recipeInstructions) {
    console.log("version root");

    console.log(parsed.recipeIngredient);
    console.log(parsed.recipeInstructions);
  } else {
    console.log("data not found");
  }

  await browser.close();
})();
