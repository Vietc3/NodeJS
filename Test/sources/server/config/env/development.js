/**
 * Development environment settings
 * (sails.config.*)
 */
let dotenv = require('dotenv');
dotenv.config()

module.exports = {
  jwt_secret: "SECRET123",
  datastores: {
    default: {
      adapter: "sails-mysql",
      url: "mysql://" + process.env.DB_USER + (process.env.DB_PASSWORD ? (":" + process.env.DB_PASSWORD) : "") + "@" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME
    }
  },

  models: {
    migrate: "safe"
  },
  database_seeding: false // create sample data or not
};
