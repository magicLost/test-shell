const express = require("express");
const path = require("path");
const cors = require("cors");
const wait = require("waait");

const app = express();
const port = 3009;

const { exec } = require("child_process");
const { promisify } = require("util");

const shellExec = promisify(exec);

const ls = async () => {
  const { stdout, stderr } = await shellExec("git status");

  console.log("stdout", stdout);

  console.log("stderr", stderr);
};

app.get("/", async (req, res, next) => {
  console.log("PATH - /");

  await ls();

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
