// const env = process.env.NODE_ENV;
const env = 'prod';

let domainName;
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> b685a7e24e78c42a232b4e48be9f5ff74ac9788c
let mailPass = 'y&GFhE16U';
let mailService = 'rentronics.saimrc.com'
=======
let mailPass = '';
let mailService = 'rentronics.a1abilities.co.nz'
>>>>>>> 56b84a442de636b2044046103405ce989ce6d8b6

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
