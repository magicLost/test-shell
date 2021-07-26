const { exec } = require("child_process");
const { promisify } = require("util");

//const shellExec = promisify(exec);

type GitConfig = {
  commitIgnoreFiles: RegExp;
  branchName: string;
};

const initConfig = {
  commitIgnoreFiles: /.jpeg|.svg|.png|.jpg|.env/,
  branchName: "master",
};

export interface IGit {
  makeCommit: (commitText: string, branchName?: string) => Promise<void>;
  execCommand: (command: string) => Promise<void>;

  execCommandAndReturn: (command: string) => Promise<any>;

  init: () => Promise<void>;

  status: () => Promise<any>;

  add: () => Promise<void>;

  commit: (commitText: string) => Promise<void>;

  push: (branchName: string) => Promise<void>;

  checkCommitedFiles: (stdout: string) => void;

  cleanAddedFiles: () => Promise<void>;

  createBranch: (branchName: string) => Promise<void>;

  amend: (commitText: string) => Promise<void>;
}

class Git implements IGit {
  shellExec = promisify(exec);
  config: GitConfig;
  repoName: string;
  userName: string;
  gitToken: string;
  gitHubUrl: string;
  //git remote add origin https://[USERNAME]:[NEW TOKEN]@github.com/[USERNAME]/[REPO].git

  constructor(config: GitConfig) {
    this.config = { ...initConfig, ...config };

    if (!process.env.REPO_NAME)
      throw new Error("You must add REPO_NAME variable to your .env file");
    if (!process.env.USER_NAME)
      throw new Error("You must add USER_NAME variable to your .env file");
    if (!process.env.GITHUB_ACCESS_TOKEN)
      throw new Error(
        "You must add GITHUB_ACCESS_TOKEN variable to your .env file"
      );

    this.repoName = process.env.REPO_NAME;
    this.userName = process.env.USER_NAME;
    this.gitToken = process.env.GITHUB_ACCESS_TOKEN;

    this.gitHubUrl = `https://${this.gitToken}@github.com/${this.userName}/${this.repoName}.git`;
  }

  /* git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/magicSweep/happy-shell.git
git push -u origin main */

  makeCommit = async (commitText: string, branchName?: string) => {
    await this.add();

    const filesToCommit = await this.status();

    this.checkCommitedFiles(filesToCommit);

    await this.commit(commitText);

    await this.push(branchName);
  };

  execCommand = async (command: string) => {
    const { stdout, stderr } = await this.shellExec(command);

    if (stderr) throw new Error(stderr);

    console.log("stdout", stdout);
  };

  execCommandAndReturn = async (command: string) => {
    const { stdout, stderr } = await this.shellExec(command);

    if (stderr) throw new Error(stderr);

    console.log("stdout", stdout);

    return stdout;
  };

  init = async () => {
    await this.execCommand("git init");

    await this.execCommand("git branch -M main");
  };

  status = async () => {
    return await this.execCommandAndReturn("git status");
  };

  add = async () => {
    await this.execCommand("git add .");
  };

  commit = async (commitText: string) => {
    const text = commitText
      ? commitText
      : `Auto commit | ${new Date().toLocaleString()}`;

    await this.execCommand(`git commit -m "${text}"`);
  };

  push = async (branchName = "main") => {
    await this.execCommand(`git push -u ${this.gitHubUrl} ${branchName}`);
  };

  checkCommitedFiles = (stdout: string) => {
    const res = stdout.match(this.config.commitIgnoreFiles);
    if (res !== null) throw Error(`We get bad files ${JSON.stringify(res)}`);
  };

  cleanAddedFiles = async () => {
    await this.execCommand("git rm -r --cached .");
  };

  createBranch = async (branchName: string) => {
    await this.execCommand(`git checkout -b ${branchName}`);
  };

  amend = async (commitText: string) => {
    const text = commitText
      ? commitText
      : `Auto commit | ${new Date().toLocaleString()}`;

    await this.execCommand(`git --amend commit -m "${text}"`);
  };
}

export default Git;
