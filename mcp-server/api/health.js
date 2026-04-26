module.exports = function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "cms-mcp",
    timestamp: new Date().toISOString(),
    env: {
      hasMysqlHost: Boolean(process.env.MYSQL_HOST),
      hasMysqlUser: Boolean(process.env.MYSQL_USER),
      hasMysqlDatabase: Boolean(process.env.MYSQL_DATABASE),
      hasMysqlUrl: Boolean(process.env.MYSQL_URL || process.env.DATABASE_URL)
    }
  });
};
