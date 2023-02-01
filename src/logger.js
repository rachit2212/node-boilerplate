const winston = require("winston");
const WinstonCloudWatch = require("winston-cloudwatch");

module.exports = (config) => {
  const { createLogger, format, transports } = winston;
  let logger = winston;

  const logFormat = format.printf((info) => {
    let formattedMessage = `${info.timestamp} ${info.level}: ${info.message}`;
    if (info.message && typeof info.message === "object") {
      formattedMessage = `${info.timestamp} ${info.level}: ${JSON.stringify(
        info
      )}`;
    }
    return formattedMessage;
  });

  logger = createLogger({
    transports: new transports.Console({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
    exitOnError: false,
  });

  if (config.logger.logToCloudwatch) {
    logger.add(
      new WinstonCloudWatch({
        logGroupName: config.logger.groupName,
        logStreamName: `ms-${process.env.NODE_ENV || "development"}-logs`,
        level: config.logger.level,
        jsonMessage: true,
        retentionInDays: config.logger.retentionInDays,
        uploadRate: config.logger.uploadRate || 2000,
        awsRegion: "us-east-1",
      })
    );
  }
  return logger;
};