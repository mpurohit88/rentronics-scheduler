const cron = require('cron');
const moment = require("moment");

const Franchise = require("./models/franchise.js");
const Customer = require("./models/customer");
const Mailer = require("./mailer");

const PaymentSchedule = require("./controllers/migration/paymentSchedules");


const cronJob = cron.job("0 */1 * * * *", function () {
  // perform operation e.g. GET request http.get() etc.
  console.log("started.....");

  PaymentSchedule.readSchedule();

  // const franchise = new Franchise();

  // franchise.getFranchiseDBName().then((result) => {
  //   result.map((franchiseDBName) => {
  //     const customer = new Customer({ dbName: franchiseDBName.fdbname });

  //     customer.getCustomerDetails().then((customers) => {
  //       customers.map((customer) => {
  //         var isCurrentDate = moment().isSame(new Date(customer.dob), "day");

  //         if (isCurrentDate) {
  //           const mailer = new Mailer({ dbName: franchiseDBName.fdbname, emailId: customer.email, name: customer.customer_name, id: customer.id });
  //           mailer.sendBirthdayWish();
  //         }
  //       });
  //     });
  //   });
  // });
});

cronJob.start();