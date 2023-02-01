const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const httpErrors = require("http-errors");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const swaggerDocument = require("./swagger.json");
const mgmtAppFactory = require("./src/app-mgmt");

const app = express();

module.exports = function (serviceLocator) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(helmet());
  app.use(cors());

  app.use((req, res, next) => {
    let requestId = req.headers["x-request-id"] || uuidv4();
    req.headers["x-request-id"] = requestId;
    next();
  });

  // will contain endpoint related to management of server
  const mgmtApp = mgmtAppFactory(serviceLocator);
  app.use(mgmtApp);

  // below endpoint is for swagger documentation
  const env = process.env.NODE_ENV || "development";
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const logger = serviceLocator.logger;

  // declare all the routes here

  app.use(function (req, res, next) {
    next(httpErrors.NotFound("Requested resource does not exist"));
  });

  // eslint-disable-next-line no-unused-vars
  app.use(function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    const error = {
      message: err.message,
      stack: err.stack,
      url: req.url,
      request_id: req.headers["x-request-id"],
      method: req.method,
    };
    delete err["x-request-id"];

    for (let prop in err) error[prop] = err[prop];

    logger.error(error);
    res.setHeader("x-request-id", error.request_id);

    delete error.stack;
    delete error.url;
    delete error.method;
    delete error.request_id;
    delete error.service_name;
    const json = JSON.stringify(error, null, 2);
    res.statusCode = err.statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(json);
  });

  process.on("uncaughtException", (err) => {
    err.isUncaughtException = true;
    logger.error(err);
    process.exit(1);
  });

  return app;
};
