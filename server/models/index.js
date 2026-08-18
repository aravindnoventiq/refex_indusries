"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const allConfig = require(__dirname + "/../config/config.json");
const baseConfig = allConfig[env];
const db = {};

if (!baseConfig) {
  const available = Object.keys(allConfig).join(", ");
  throw new Error(
    `No database config for NODE_ENV="${env}". ` +
      `Add a "${env}" block in server/config/config.json. ` +
      `Available: ${available}`,
  );
}

// Docker/UAT overrides (DB_HOST=mysql, etc.) take precedence over config.json
const config = {
  ...baseConfig,
  host: process.env.DB_HOST || baseConfig.host,
  port: process.env.DB_PORT
    ? Number(process.env.DB_PORT)
    : baseConfig.port,
  username:
    process.env.DB_USER || process.env.DB_USERNAME || baseConfig.username,
  password: process.env.DB_PASSWORD || baseConfig.password,
  database:
    process.env.DB_NAME || process.env.DB_DATABASE || baseConfig.database,
};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

function loadModels(directory) {
  // Read all files and directories in the given directory
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      loadModels(fullPath); // Recursively load models from subdirectories
    } else if (
      file.indexOf(".") !== 0 && // Not a hidden file
      file !== basename && // Not the current file
      file.slice(-3) === ".js" && // JavaScript file
      file.indexOf(".test.js") === -1 // Not a test file
    ) {
      const model = require(fullPath)(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });
}

loadModels(__dirname);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
