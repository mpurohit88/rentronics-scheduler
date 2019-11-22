const cron = require('cron');
const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');

const { trans } = require("./mailtransporter");
const { domainName } = require("./config");

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    }
    else {
      callback(null, html);
    }
  });
};

const cronJob = cron.job("0 */1 * * * *", function () {
  // perform operation e.g. GET request http.get() etc.

  readHTMLFile(__dirname + '/birthdayTemplate.html', function (err, html) {

    var template = handlebars.compile(html);
    var replacements = {
      username: "Ravindra Sharma"
    };
    var htmlToSend = template(replacements);

    const mail = {
      from: 'admin@' + domainName,
      to: 'avindrasharma.rs2211@gmail.com, mpurohit88@gmail.com',
      // to: director.email,
      subject: 'Rentronics Scheduler',
      text: 'activate your account ',
      html: htmlToSend
    }

    trans.sendMail(mail, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });

  console.info('cron job completed');
});

cronJob.start();