// TODO:
// simple node server, listen for /__refresh POST request
// on request, run fetchProjectData and createDocFiles

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const {
  resolve: { createDocFiles },
  fetch: { fetchProjectData },
} = require("./utils");

app.post("/__refresh", async (req, res) => {
  try {
    console.log("⌛️ Received a POST request for refreshing data");

    await fetchProjectData();
    createDocFiles(null);

    console.log("✅ Done refreshing project data");
    res.send("");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Preview helper is listening on port ${port}`);
});
