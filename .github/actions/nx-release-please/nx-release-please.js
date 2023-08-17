// @ts-check
const {execSync} = require('child_process');

/**
 * @typedef {Object} ProjectsHash
 */


/**
 * @typedef {Object} GetChangedProjectsOptions
 * @property {string} comparisonRef - the comparison ref to use to get the changes since last release
 * @property {import('@typed-actions/github-script').Toolkit['core']} core - the core github module
 */

/**
  * Get the list of changed projects since last release.
  *
  * @param {GetChangedProjectsOptions} options
  * @returns {string[]} the list of changed projects
  */
function getChangedProjects ({ comparisonRef, core }) {
  const projects = execSync(
    `yarn nx print-affected --base=${comparisonRef} --select=projects`,
    { encoding: 'utf-8'}
  )

  const changes = projects?.split(',').map(item => item.trim());
  const output = Array.from(changes);

  core.debug(`getChangedProjects.changes ${changes}`);
  return output;
}

/**
 * @typedef {Object} GetComparisonRefOptions
 * @property {import('@typed-actions/github-script').Toolkit['core']} core - the core github module
 * @property {import('@typed-actions/github-script').Toolkit['github']} github - the github module
 * @property {string} githubRepository - the github repository
 */

/**
 * Get the comparison ref to use to get the changes since last release.
 * If no release is found, it will use HEAD^
 * @see https://docs.github.com/en/rest/reference/repos#get-the-latest-release
 *
 * @param {GetComparisonRefOptions} options
 *
 * @returns {Promise<string>} the comparison ref
 */
async function getComparisonRef({ core, github, githubRepository }) {
  let comparisonRef = 'HEAD^';
  try {
    const [owner, repo] = githubRepository.split('/');
    const latestRelease = await github.rest.repos.getLatestRelease({
      owner,
      repo
    });
    const tagName = latestRelease.data.tag_name;
    core.info(`Found latest release ${tagName}`);
    comparisonRef = JSON.stringify(tagName);
  } catch (error) {}

  return comparisonRef;
}


/**
 * @typedef {Object} NxRelasePleaseOptions
 * @property {import('@typed-actions/github-script').Toolkit['core']} core - the core github module
 * @property {import('@typed-actions/github-script').Toolkit['context']} context - the context github module
 * @property {import('@typed-actions/github-script').Toolkit['github']} github - the github module
 * @property {string} githubRepository - the github repository
 */

/**
 * @param {NxRelasePleaseOptions} options
 */
module.exports = async function NxRelasePlease({ core, github, githubRepository  }) {

  /**
   * Get the comparison ref to use to get the changes since last release.
   */
  const comparisonRef = await getComparisonRef({ core, github, githubRepository });

  /**
   * Get the list of changed projects since last release.
   */
  const changes = getChangedProjects({
    comparisonRef,
    core
  });

  core.setOutput('changes', changes);
  return changes;
};
