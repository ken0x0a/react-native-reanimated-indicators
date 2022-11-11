module.exports = {
  branches: ["main"],
  // https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md
  // https://github.com/semantic-release/semantic-release/blob/master/docs/extending/plugins-list.md
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git",
  ],
};
