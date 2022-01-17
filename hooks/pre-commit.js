const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('./exec');

const branchName = exec('git rev-parse --abbrev-ref HEAD', { trim: true });
// check if this branch already exists in the remote
const isInRemote =
  exec(`git show-branch remotes/origin/${branchName}`, { toString: false })
    .code === 0;

if (!isInRemote) {
  const validBranchPrefix = 'feature|fix|hotfix|chore|tests|automation';
  const validBranchesRegex = new RegExp(`^(${validBranchPrefix})\/[\\w.-]+$`);

  if (!validBranchesRegex.test(branchName)) {
    const msg = `Branch names in this project must adhere to this contract: ${validBranchPrefix}.`;
    console.log(chalk.bgRed.black.bold(msg));
    process.exit(1);
  }
}

/* Check Forbidden Tokens */
const FILES_REGEX = { ts: /\.ts$/, spec: /\.spec\.ts$/ };
/** Map of forbidden tokens and their match regex */
const forbiddenTokens = {
  fit: { rgx: /fit\(/, fileRgx: FILES_REGEX.spec },
  fdescribe: { rgx: /fdescribe\(/, fileRgx: FILES_REGEX.spec },
  '.skip': { rgx: /(describe|context|it)\.skip/, fileRgx: FILES_REGEX.spec },
  '.only': { rgx: /(describe|context|it)\.only/, fileRgx: FILES_REGEX.spec },
  debugger: { rgx: /(debugger);?/, fileRgx: FILES_REGEX.ts },
};

let status = 0;

const gitCommand = `git diff --staged --name-only`;
const stagedFiles = exec(gitCommand).split('\n');
for (let [term, value] of Object.entries(forbiddenTokens)) {
  const { rgx, fileRgx, message } = value;
  /* Filter relevant files using the files regex */
  const relevantFiles = stagedFiles.filter(file => fileRgx.test(file.trim()));
  const failedFiles = relevantFiles.reduce((acc, fileName) => {
    const filePath = path.resolve(
      process.cwd(),
      fileName.replace('client/', '')
    );
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
      if (rgx.test(content)) {
        status = 1;
        acc.push(fileName);
      }
    }
    return acc;
  }, []);

  /* Log all the failed files for this token with the matching message */
  if (failedFiles.length > 0) {
    const msg = message || `The following files contains '${term}' in them:`;
    console.log(chalk.bgRed.black.bold(msg));
    console.log(chalk.bgRed.black(failedFiles.join('\n')));
  }
}

process.exit(status);
