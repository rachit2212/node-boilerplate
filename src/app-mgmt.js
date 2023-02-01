const express = require("express");

module.exports = () => {
  const app = express();

  app.get("/heartbeat", (req, res) => {
    const response = {
      name: require("../package.json").name,
      pid: process.pid,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    };

    return res.status(200).json(response);
  });

  return app;
};
