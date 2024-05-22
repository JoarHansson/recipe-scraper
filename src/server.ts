import express from "express";

const app = express();
app.use(express.json());

app.post("/recipe", async (req, res) => {
  console.log(req.body);

  const { url } = req.body;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  res.send(`Checked`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
