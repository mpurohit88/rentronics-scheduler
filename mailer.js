const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
var fs = require('fs');

const Scheduler = require('./models/scheduler.js');

const { trans } = require("./mailtransporter");
const { domainName } = require("./config/db.js");

const Mailer = function (params) {
  this.emailId = params.emailId;
  this.name = params.name;
  this.id = params.id;
  this.dbName = params.dbName;
};

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) { throw err;}
    else { callback(null, html); }
  });
};

Mailer.prototype.sendBirthdayWish = function () {
  const that = this;

  readHTMLFile(__dirname + '/template/birthdayTemplate.html', function (err, html) {
    const template = handlebars.compile(html);
    const replacements = {
      username: that.name
    };
    const htmlToSend = template(replacements);

    const mail = {
      from: 'Rentronics <admin@' + domainName + '>',
      cc: 'admin@' + domainName,
      bcc: 'mpurohit88@gmail.com,a1abilities@gmail.com',
      to: that.emailId,
      cc: 'admin@' + domainName,
      subject: `Happy Birthday ${that.name}`,
      attachments: [{
        filename: 'birthday.jpg',
        path: __dirname + '/template/img/birthday.jpg',
        cid: 'unique@cid'
      }],
      html: htmlToSend
    }

    // const mail = {      
    //   from: 'sktanwar.2020@gmail.com',
    //   to: 'sktanwar.2014@gmail.com',
    //   subject: `Happy Birthday Shahrukh`,
    //   attachments: [{
    //     filename: 'birthday.jpg',
    //     path: __dirname + '/template/img/birthday.jpg',
    //     cid: 'unique@cid'
    //   }],
    //   html: htmlToSend
    // }


    trans.sendMail(mail, (err, info) => {
      if (err) {
        return console.log(err);
      }

      const scheduler = new Scheduler({ dbName: that.dbName, type: 1, customerId: that.id });
      scheduler.saveScheduler();

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });

  console.info('cron job completed');
}

module.exports = Mailer;
