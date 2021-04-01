const express = require("express");
const path = require("path");
const cors = require("cors");
const wait = require("waait");
const { makeCommit } = require("../utils/Shell");

const app = express();
const port = 3009;

app.get("/", async (req, res, next) => {
  console.log("PATH - /");

  await makeCommit();

  res.status(200).json({
    status: "success",
    data: {},
  });
});

app.use((err, req, res, next) => {
  console.log(`[GLOBAL_ERROR_HANDLER] ${err.message}`);

  const json = {
    status: "error",
    data: {
      error: err.message,
    },
  };

  res.status(200).json(json).end();

  return app;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
