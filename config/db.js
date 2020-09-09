const env = 'local';
let dbName;
let API_CONSUMER;

if (env === 'uat') {
  dbName = 'rentronic_uat'  
} else if (env === 'prod') {
  dbName = 'rentronics_prod';
  API_CONSUMER = 'http://rentronics.a1abilities.co.nz';
} else if (env === 'dev') {
  dbName = 'rentrodev_test';
} else {
  dbName = 'rentronics_prod'
  API_CONSUMER = 'http://localhost:3000';
}

module.exports = { dbName: dbName, env: env, API_CONSUMER: API_CONSUMER};
