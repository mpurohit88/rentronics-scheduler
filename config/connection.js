// This will be in some JSON config we'll say
let dbOptions = '';
const { env } = require("./db.js");

if (env === 'dev' || env === 'uat' || env === 'prod') {
  dbOptions = {
    host: 'localhost',
    user: 'root',
    password: 'ekLZGG7L2bUYvpBv',
    port: 3306
    // database: 'rentronics'
  };
} else {
  dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '',
    // database: 'rentronics'
  };
}

//This will depend on which version/module/db you're using, but here's what mine looks like
const MySQL = require("mysql");
// const config = require("../config/db.json");
let connectionPool = MySQL.createPool({ host: dbOptions.host, user: dbOptions.user, password: dbOptions.password, port: dbOptions.port, database: dbOptions.database });

const getConnection = async function (done) {
  try {
    connectionPool.getConnection(done);
  } catch (ex) {
    console.log("ex........", ex);
    throw ex;
  }
};

module.exports = { getConnection: getConnection };
