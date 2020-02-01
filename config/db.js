const env = 'uat';
let dbName;

if (env === 'uat') {
  dbName = 'rentronic_uat'
} else if (env === 'prod') {
  dbName = 'a1ability_rentronic_prod';
} else if (env === 'dev') {
  dbName = 'rentrodev_test';
} else {
  dbName = 'rentronicnew'
}

module.exports = { dbName: dbName, env: env };
