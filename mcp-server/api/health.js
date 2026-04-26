module.exports = function handler(req, res) {
  const hasMysqlHost = Boolean(process.env.MYSQL_HOST);
  const hasMysqlUser = Boolean(process.env.MYSQL_USER);
  const hasMysqlDatabase = Boolean(process.env.MYSQL_DATABASE);
  const hasMysqlUrl = Boolean(process.env.MYSQL_URL || process.env.DATABASE_URL);

  const isDbConfigured = hasMysqlUrl || (hasMysqlHost && hasMysqlUser && hasMysqlDatabase);

  res.status(200).json({
    ok: true,
    service: "cms-mcp",
    timestamp: new Date().toISOString(),
    env: {
      hasMysqlHost,
      hasMysqlUser,
      hasMysqlDatabase,
      hasMysqlUrl,
      isDbConfigured
    },
    hint: isDbConfigured
      ? "MySQL config detected"
      : "Thiếu config DB. Set MYSQL_URL (hoặc DATABASE_URL) hoặc MYSQL_HOST + MYSQL_USER + MYSQL_DATABASE."
  });
};
