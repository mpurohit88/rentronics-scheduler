const cron = require('cron');
const moment = require("moment");

const Franchise = require("./models/franchise.js");
const Customer = require("./models/customer");
const Mailer = require("./mailer");


const cronJob = cron.job("00 00 09 * * *", function () {
  console.log("scheduler is running.....");

  const franchise = new Franchise();

  franchise.getFranchiseDBName().then((result) => {
    result.map((franchiseDBName) => {

      const customer = new Customer({ dbName: franchiseDBName.fdbname });

      customer.getCustomerDetails().then((customers) => {
        customers.map((customer) => {
         if(customer.dob !== null) {
 
          const isCurrentDate = moment().isSame(new Date(customer.dob), "day");
	        const customerDOB  = moment(customer.dob);
          const currentDate = moment().add(7, 'hours');
 
            // console.log("DOB", customer.dob);
            // console.log("date dob", customerDOB.format('D'));
            // console.log("date moment", currentDate.format('D'));
            // console.log("month dob", customerDOB.format('M'));
            // console.log("month moment", currentDate.format('M'));
  
           if (customerDOB.format('D') === currentDate.format('D') && customerDOB.format('M') === currentDate.format('M')) {
              
              console.log("email...", customer.email);
              console.log("inside current date");

              const mailer = new Mailer({ dbName: franchiseDBName.fdbname, emailId: customer.email, name: (customer.first_name + ' ' + customer.last_name), id: customer.id });
              mailer.sendBirthdayWish();
           }
          }
        });
      });
    });
  });
});

cronJob.start();
