
const env = 'prod';

let dbName;
let API_CONSUMER;
let mailPass = '';
let mailService = 'rentronics.a1abilities.co.nz'
let domainName;


if (env === 'uat') {
  dbName = 'rentronics_uat'  
  API_CONSUMER = 'http://uat.rentronics.a1abilities.co.nz';
  domainName = 'uat.rentronics.a1abilities.co.nz';
}
else if (env === 'prod') {
  dbName = 'rentronics_prod';  
  API_CONSUMER = 'http://rentronics.a1abilities.co.nz';
  domainName = 'rentronics.a1abilities.co.nz';
  mailService = 'rentronics.a1abilities.co.nz';
  mailPass = 'y&GFh$16U';
}
else if (env === 'dev') {
  dbName = 'rentronics_dev';
  API_CONSUMER = 'http://dev.rentronics.a1abilities.co.nz';
  domainName = 'dev.rentronics.a1abilities.co.nz';
}
else {
  dbName = 'rentronics_prod'
  API_CONSUMER = 'http://localhost:3000';
}

module.exports = {
  domainName: domainName, mailPass: mailPass, mailService: mailService, 
  dbName: dbName, env: env, API_CONSUMER: API_CONSUMER};
