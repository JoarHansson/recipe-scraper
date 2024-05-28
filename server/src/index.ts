import express from "express";
import router from "./server.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/", router);

app.use("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
