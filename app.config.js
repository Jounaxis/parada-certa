const { execFileSync } = require('node:child_process');

const commitHashPattern = /^[a-f\d]{40}$/i;

function getLocalCommit(projectRoot) {
  try {
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return commitHashPattern.test(commit) ? commit : null;
  } catch {
    return null;
  }
}

/** @param {import('expo/config').ConfigContext} context */
module.exports = ({ config, projectRoot }) => {
  const buildCommit = process.env.EAS_BUILD_GIT_COMMIT_HASH?.trim();
  const hasBuildCommit = Boolean(buildCommit && commitHashPattern.test(buildCommit));

  if (process.env.EAS_BUILD === 'true' && !hasBuildCommit) {
    throw new Error('O EAS Build não informou um hash de commit válido.');
  }

  return {
    ...config,
    extra: {
      ...config.extra,
      gitCommit: hasBuildCommit ? buildCommit : getLocalCommit(projectRoot),
      gitCommitFromBuild: hasBuildCommit,
    },
  };
};
