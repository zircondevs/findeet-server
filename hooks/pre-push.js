const { exec } = require('./exec');

/* The flag commit hash 🚩 */
const stgUniqCommit = 's76o527m89e9h72619a827s9h038c029o8de',
  currentBranch = exec('git rev-parse --abbrev-ref HEAD'),
  /* Get all the branch names that have a commit with this hash */
  branchesWithStaging = exec(`git branch --contains ${stgUniqCommit}`);
if (branchesWithStaging.includes(currentBranch)) {
  console.log(
    import('chalk').bgRed.black.bold(
      "Your branch contains commits from 'staging' branch."
    )
  );
  process.exit(1);
}

/* Update local branch from origin master */
exec('git pull origin master');
