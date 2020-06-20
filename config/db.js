const env = 'prod';
let dbName;

if (env === 'uat') {
  dbName = 'rentronic_uat'
} else if (env === 'prod') {
  dbName = 'rentronics_prod';
} else if (env === 'dev') {
  dbName = 'rentrodev_test';
} else {
  dbName = 'rentronics_prod'
}

module.exports = { dbName: dbName, env: env };
