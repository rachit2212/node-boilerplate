const { Pool } = require("pg");

module.exports = function PostgresClient(config) {
  const poolObj = new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:admin@localhost:5423/scale",
    max: 20,
    idleTimeoutMillis: config.idleTimeoutMillis || 30000,
    connectionTimeoutMillis: config.connectionTimeoutMillis || 3000,
  });

  async function connect() {
    return await poolObj.connect();
  }

  async function query(clientObj, text, values) {
    if (values && !Array.isArray(values)) {
      throw new Error("Values supplied to query string should be array");
    }
    return clientObj.query(text, values);
  }

  function release(clientObj) {
    clientObj && clientObj.release();
  }

  return {
    connect,
    query,
    release,
  };
};
