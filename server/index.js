const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getWord", (req, res) => {
  try {
    const words = fs.readFileSync("./words.csv", {
      encoding: "utf8",
      flag: "r",
    });
    // save words to array
    const wordsArray = words.replaceAll(",", "").split("\n");

    // get random indexed word
    const index = Math.floor(Math.random() * 100);

    res.send(wordsArray[index]);
  } catch (error) {
    res.error("Error: ", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
