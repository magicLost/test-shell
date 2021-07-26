import { IGit } from "../../service/Git";

type MainCommands = "git" | "npm" | "commit-and-publish";

type GitArgs =
  | "-commit"
  | "-init"
  | "-add"
  | "-status"
  | "-push"
  // make git add, git commit, git push
  | "-makeCommit";

type NpmArgs = "-pub";

class Shell {
  git: IGit;
  mainCommand: MainCommands;
  arg?: GitArgs | NpmArgs | string;
  otherArgs: string[];

  constructor(git: IGit) {
    this.git = git;

    const args = process.argv.slice(2);

    if (args.length === 0) throw new Error("We need args...");

    this.mainCommand = args[0] as MainCommands;

    if (args.length > 1) {
      this.arg = args[1] as GitArgs | NpmArgs | string;

      this.otherArgs = args.slice(2);
    } else {
      this.arg = undefined;
      this.otherArgs = [];
    }
  }

  run = () => {
    if (this.mainCommand === "commit-and-publish") {
    } else {
      if (this.arg === undefined)
        throw new Error("We need second args, for example -push");

      if (this.mainCommand === "git") {
      } else if (this.mainCommand === "npm") {
      }
    }
  };

  runGit = async () => {
    switch (this.arg) {
      case "-makeCommit":
        const [msg, branchName] = this.otherArgs;

        if (!msg) throw new Error("No commit text argument");

        await this.git.makeCommit(msg, branchName);
        break;

      case "-status":
        await this.git.status();
        break;
      case "-init":
        await this.git.init();
        break;

      default:
        throw new Error(`No implementation for arg - ${this.arg}`);
    }
  };

  runNpm = () => {};
}

export default Shell;
