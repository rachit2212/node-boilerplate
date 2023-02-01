const appFactory = require("../app");
const loadConfig = require("../src/loadConfiguration");
const serviceLocatorFactory = require("../src/serviceLocator");

const config = loadConfig();
const serviceLocator = serviceLocatorFactory(config);

const app = appFactory(serviceLocator);

app.listen(config.server.port, () =>
  console.log("Now listening on port", config.server.port)
);

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, initiating shutdown procedure.");

  // anything that we want to handle before server shutdown will go here
});
