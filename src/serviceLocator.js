const Dislocator = require("dislocator");
const logger = require("./logger");
const postgresClient = require("./lib/services/postgresClient");

module.exports = function (config) {
  const serviceLocator = new Dislocator();

  serviceLocator
    .register("config", config)
    .register("logger", () => logger(config))
    .register("db", () => postgresClient(config));

  return serviceLocator;
};
