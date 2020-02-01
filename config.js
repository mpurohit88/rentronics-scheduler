// const env = process.env.NODE_ENV;
const env = 'dev';

let domainName;
let mailPass = 'y&GFhE16U';
let mailService = 'rentronics.saimrc.com'

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
