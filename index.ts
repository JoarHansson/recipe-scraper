import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  // example url:s

  // version 1:
  // await page.goto("https://thewoksoflife.com/dan-dan-noodles/");
  // await page.goto("https://lindseyeatsla.com/spicy-sichuan-noodles/");

  // version 2:
  await page.goto("https://www.ica.se/recept/pannkakor-grundsmet-2083/");

  const jsonLdData: any = await page.evaluate(() => {
    const scriptTag = document.querySelector(
      'script[type="application/ld+json"]'
    );
    return scriptTag ? scriptTag.innerHTML : null;
  });

  const parsed = JSON.parse(jsonLdData);

  if (jsonLdData) {
    console.log(true);
  } else {
    console.log(false);
  }

  if (parsed["@graph"]) {
    console.log(parsed["@graph"][parsed["@graph"].length - 1].recipeIngredient);
    console.log(
      parsed["@graph"][parsed["@graph"].length - 1].recipeInstructions
    );
  } else if (parsed.recipeIngredient && parsed.recipeInstructions) {
    console.log(parsed.recipeIngredient);
    console.log(parsed.recipeInstructions);
  } else {
    console.log("data not found");
  }

  await browser.close();
})();
