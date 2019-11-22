const cron = require('cron');

const { trans } = require("./mailtransporter");
const { domainName } = require("./config");

const cronJob = cron.job("0 */1 * * * *", function () {
  // perform operation e.g. GET request http.get() etc.

  const mail = {
    from: 'admin@' + domainName,
    to: 'mpurohit88@gmail.com',
    // to: director.email,
    subject: 'Rentronics Scheduler',
    text: 'activate your account ',
    html: 'Scheduler email'
  }

  trans.sendMail(mail, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });

  console.info('cron job completed');
});

cronJob.start();