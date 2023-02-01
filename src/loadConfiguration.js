const oconf = require("oconf");
const path = require("path");
const fs = require("fs");

/**
 * Find the configuration file to be used in development.
 *
 * Allows developers to have a gitignored config file in `config/config.cjson`
 * with overrides that they need.
 *
 * Extending the development.cjson file is a best-practice as that allows you
 * to only mention things that are different from that.
 *
 * ```json
 * {
 *     "#include": "./development.cjson",
 *     "overrides": {
 *         "goes": "here"
 *     }
 * }
 * ```
 *
 * @returns String
 */
function resolveConfiguration(envName = "development") {
  const configDir = path.resolve(__dirname, "../config");
  const developmentConfigPath = path.resolve(configDir, `${envName}.cjson`);
  const overrideConfigPath = path.resolve(configDir, "config.cjson");

  try {
    fs.statSync(overrideConfigPath);

    console.log("Using config override found in:", overrideConfigPath);

    return overrideConfigPath;
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log("Using default development config:", developmentConfigPath);
      return developmentConfigPath;
    }
  }
}

module.exports = function loadConfig() {
  const envName = process.env.NODE_ENV || "development";
  const configPath = resolveConfiguration(envName);
  return oconf.load(configPath);
};
