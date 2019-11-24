const cron = require('cron');

const Franchise = require("./models/franchise.js");
const Customer = require("./models/customer");
const Mailer = require("./mailer");

const cronJob = cron.job("0 */1 * * * *", function () {
  // perform operation e.g. GET request http.get() etc.

  const franchise = new Franchise();

  franchise.getFranchiseDBName().then((result) => {
    result.map((franchiseDBName) => {
      const customer = new Customer({ dbName: franchiseDBName.fdbname });

      customer.getBirthDate().then((customers) => {
        customers.map((customer) => {
          const mailer = new Mailer({ dbName: franchiseDBName.fdbname, emailId: customer.email, name: customer.customer_name, id: customer.id });

          mailer.sendBirthdayWish();
        });
      });
    });
  });
});

cronJob.start();