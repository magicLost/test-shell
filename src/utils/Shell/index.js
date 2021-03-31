const { exec } = require("child_process");
const { promisify } = require("util");

const shellExec = promisify(exec);

const gitAdd = async () => {
  const { stdout, stderr } = await shellExec("git add .");

  console.log("stdout", stdout);

  if (stderr) throw new Error(stderr);
};

const gitCommit = async () => {
  const { stdout, stderr } = await shellExec(`git commit -m "Initial commit"`);

  console.log("stdout", stdout);

  if (stderr) throw new Error(stderr);
};

const gitPush = async () => {
  const { stdout, stderr } = await shellExec(`git push -u origin"`);

  console.log("stdout", stdout);

  if (stderr) throw new Error(stderr);
};

const checkCommitedFiles = (stdout) => {
  const res = stdout.match(/.jpeg|.svg|.png|.jpg/);
  if (res !== null) throw Error(`We get bad files ${JSON.stringify(res)}`);
};

const makeCommit = async () => {
  await gitAdd();

  await gitCommit();

  await gitPush();
};

gitAdd();
