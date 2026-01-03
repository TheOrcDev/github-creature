/** @type {import('stylelint').Config} */
const config = {
  /**
   * Ultracite runs `stylelint .` which causes stylelint to consider many non-CSS
   * files (e.g. README.md). Without a config, stylelint throws
   * "No configuration provided".
   *
   * This project doesn't currently rely on Stylelint rules, so we treat
   * stylelint as a no-op while still providing a valid configuration.
   */
  ignoreFiles: ["**/*"],
  rules: {},
};

export default config;
