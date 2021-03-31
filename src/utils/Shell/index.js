const { exec, spawn } = require("child_process");
const { promisify } = require("util");
const wait = require("waait");

const shellExec = promisify(exec);

const gitAdd = async () => {
  const { stdout, stderr } = await shellExec("git add .");

  console.log("stdout", stdout);

  if (stderr) throw new Error(stderr);
};

const gitCommit = async (commitText) => {
  const text = commitText
    ? commitText
    : `Auto commit | ${new Date().toLocaleString()}`;

  const { stdout, stderr } = await shellExec(`git commit -m "${text}"`);

  console.log("stdout", stdout);

  if (stderr) throw new Error(stderr);
};

const gitStatus = async () => {
  const { stdout, stderr } = await shellExec(`git status`);

  //console.log("stdout", stdout);

  if (stderr) throw new Error(stderr);

  return stdout;
};

const gitPush = async () => {
  const { stdout, stderr } = await shellExec(`git push origin master`);

  console.log("stdout", stdout);

  if (stderr) throw new Error(stderr);
};

/* const gitPushWithSpawn = async () => {
  const childProcess = spawn(`git`, ["push", "-u", "origin", "master"]);

  childProcess.stdout.on("data", (data) => {
    console.log("DATA", data.toString());
    //proc.stdin.write();
  });

  childProcess.on("message", (msg) => {
    console.log("MESSAGE", msg.toString());
    //proc.stdin.write();
  });

  childProcess.on("exit", (data) => {
    console.log("EXIT", data.toString());
    //proc.stdin.write();
  });

  childProcess.on("disconnect", (data) => {
    console.log("DISCONNECT", data.toString());
    //proc.stdin.write();
  });
}; */

const checkCommitedFiles = (stdout) => {
  const res = stdout.match(/.jpeg|.svg|.png|.jpg/);
  if (res !== null) throw Error(`We get bad files ${JSON.stringify(res)}`);
};

const makeCommit = async () => {
  await gitAdd();

  const filesToCommit = await gitStatus();

  checkCommitedFiles(filesToCommit);

  await gitCommit();

  await gitPush();
};

makeCommit();
