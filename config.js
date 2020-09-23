// const env = process.env.NODE_ENV;
const env = 'local';

let domainName;
let mailPass = '';
let mailService = 'rentronics.a1abilities.co.nz'

if (env === 'uat') {
  domainName = 'rentronicsuat.saimrc.com'
} else if (env === 'prod') {
  domainName = 'rentronics.a1abilities.co.nz';
  mailService = 'rentronics.a1abilities.co.nz';
  mailPass = 'y&GFh$16U';
} else if (env === 'dev') {
  domainName = 'rentronicsdev.saimrc.com'
} else {
  domainName = 'localhost:3000'
}

module.exports = { domainName: domainName, mailPass: mailPass, mailService: mailService, env: env };
