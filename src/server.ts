import express from "express";
import { getScrapedRecipe } from "./functions.js";

const app = express();
app.use(express.json());

app.post("/recipe", async (req, res) => {
  console.log(req.body);

  const { url } = req.body;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  const data = await getScrapedRecipe(url);

  res.send(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
