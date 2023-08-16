// @ts-check
const {execSync} = require('child_process');

/**
 * @typedef {Object} ProjectsHash
 */

/**
 * @typedef {Object} GetProjectsFromWorkspaceJsonJsonOptions
 * @property {string} workspaceJsonFilePath - the path to the workspace.json file
 * /

/**
 *
 * @param {GetProjectsFromWorkspaceJsonJsonOptions} options
 * @returns {ProjectsHash}
 */
function getProjectsFromWorkspaceJson ({ workspaceJsonFilePath }) {
  const workspace = require(workspaceJsonFilePath);
  return workspace && workspace.projects || {};
}

/**
 * @typedef {Object} GetProjectsFromProjectJsonOptions
 * @property {import('@typed-actions/github-script').Toolkit['core']} core - the core github module
 */

/**
 * Get the list of projects in the workspace.
 * Tries to read the workspace.json file, if it fails, it will try to find all project.json files.
 * @param {GetProjectsFromProjectJsonOptions} options
 * @returns {ProjectsHash}
 */
function getProjectsFromProjectJson ({ core }) {
  // find all project.json and map them to their path

  const projectFiles = execSync('find . -name project.json', { encoding: 'utf-8' }).split('\n');
  core.debug(`getProjectsFromProjectJson.projectFiles ${projectFiles.join(',')}`);

  return projectFiles.reduce((acc, projectFile) => {
    const project = require(`./${projectFile}`);
    acc[project.name] = project.root;
    return acc;
  }, {});
}

/**
 * @typedef {Object} GetProjectsResult
 * @property {ProjectsHash} projects - a map of project name to path
 * @property {(path: string) => boolean} hasProjectPath - returns true if the path is a project path
 * @property {(path: string) => boolean} startsWithProjectPath - returns true if the path starts with a project path
 * @property {(path: string) => string} getContainingProject - returns the project path that contains the given path
 */

/**
 * @typedef {Object} GetProjectsOptions
 * @property {import('@typed-actions/github-script').Toolkit['core']} core - the core github module
 * @property {string} workspaceJsonFilePath - the path to the workspace.json file
 */

/**
  * Get the list of projects in the workspace.
  * Tries to read the workspace.json file, if it fails, it will try to find all project.json files.
  *
  * @param {GetProjectsOptions} options
  * @returns {GetProjectsResult}
  */
function getProjects ({ workspaceJsonFilePath, core }) {
  let projects = {}
  try {
    projects = getProjectsFromWorkspaceJson({ workspaceJsonFilePath });
  } catch (error) {
    projects = getProjectsFromProjectJson({ core });
  }

  return {
    projects,
    hasProjectPath: (path) => Object.values(projects).includes(path),
    startsWithProjectPath: (path) => Object.values(projects).some((project) => path.startsWith(project)),
    getContainingProject: (path) => Object.values(projects).find((project) => path.startsWith(project)),
  }
}


/**
 * @typedef {Object} GetChangedProjectsOptions
 * @property {string} comparisonRef - the comparison ref to use to get the changes since last release
 * @property {import('@typed-actions/github-script').Toolkit['core']} core - the core github module
 * @property {string} workspaceJsonFilePath - the path to the workspace.json file
 */

/**
  * Get the list of changed projects since last release.
  *
  * @param {GetChangedProjectsOptions} options
  * @returns {string[]} the list of changed projects
  */
function getChangedProjects ({ comparisonRef, workspaceJsonFilePath, core }) {
  /**
  * Get the list of changed projects since the comparison ref.
  */
  const status = execSync(
    `git diff --name-only ${comparisonRef}`,
    { encoding: 'utf-8'}
  );
  const source = status.split('\n');

  core.debug(`getChangedProjects.source ${source.join(',')}`);

  const { projects, getContainingProject } = getProjects({ core, workspaceJsonFilePath });
  core.debug(`getChangedProjects.projects ${JSON.stringify(projects)}`);

  const changes = source.reduce((acc, key) => {
    const project = getContainingProject(key);
    core.debug(`getChangedProjects.project ${key}: ${project}`);

    if (project) {
      acc.add(project);
      core.info(`Found change in project ${project}`);
    }
    return acc;
  }, new Set());

  const output = Array.from(changes);

  core.debug(`getChangedProjects.output ${output.join(',')}`);

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
 * @property {string} workspaceJsonFilePath - the path to the workspace.json file
 * @property {string} githubRepository - the github repository
 */

/**
 * @param {NxRelasePleaseOptions} options
 */
module.exports = async function NxRelasePlease({ core, github, workspaceJsonFilePath, githubRepository  }) {

  /**
   * Get the comparison ref to use to get the changes since last release.
   */
  const comparisonRef = await getComparisonRef({ core, github, githubRepository });

  /**
   * Get the list of changed projects since last release.
   */
  const changes = getChangedProjects({
    workspaceJsonFilePath,
    comparisonRef,
    core
  });

  core.setOutput('changes', changes);
  return changes;
};
