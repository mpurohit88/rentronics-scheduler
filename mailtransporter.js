const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { domainName, mailPass, mailService } = require("./config");

// const mailAccountUser = 'admin@' + domainName
// const mailAccountPass = mailPass

const mailAccountUser = 'sktanwar.2020@gmail.com'
const mailAccountPass = '829044701486'


const trans = nodemailer.createTransport(smtpTransport({
  // service: mailService,
  service: 'GMAIL',
  tls: { rejectUnauthorized: false },
  auth: {
    user: mailAccountUser,
    pass: mailAccountPass
  }
}));


module.exports = { trans: trans };
