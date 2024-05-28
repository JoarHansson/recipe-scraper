import express from "express";
import router from "./server.js";
import path from "path";

const PORT = 3001;
const app = express();

app.use(express.json());

app.use("/", router);

app.use("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
