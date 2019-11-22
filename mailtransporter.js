const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { domainName, mailPass, mailService } = require("./config");

const mailAccountUser = 'admin@' + domainName
const mailAccountPass = mailPass

const trans = nodemailer.createTransport(smtpTransport({
  service: mailService,
  tls: { rejectUnauthorized: false },
  auth: {
    user: mailAccountUser,
    pass: mailAccountPass
  }
}));


module.exports = { trans: trans };
