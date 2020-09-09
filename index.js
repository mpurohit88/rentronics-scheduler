const cron = require('cron');

// Controllers 
const ezidebit = require('./controllers/ezidebit.js');
const mails =  require('./controllers/mails.js');
const reports = require('./controllers/reports.js');




const cronTime = "*/10 * * * * *";
// const cronTime = "00 00 09 * * *";


const cronJob = cron.job(cronTime, async function () {
  console.log("scheduler is running.....");
  await ezidebit.getPayments();
  // await mails.birthdayMail();
});

ezidebit.getPayments();

// const paymentReport = cron.job("*/5 * * * * *", async function () {
//   console.log("paymentReport scheduler is running.....");
//   await reports.paymentReport();
// });

// paymentReport.start();
// cronJob.start();
