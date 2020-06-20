const Franchise = require("../models/franchise.js");
const Customer = require("../models/customer");
const Mailer = require("../mailer");

const moment = require("moment");
const { isNullOrUndefined } = require('util');


const birthdayMail =  async function () {
    const franchise = new Franchise();
    await franchise.getFranchiseDBName().then((result) => {
        result.map((franchiseDBName) => {

        const customer = new Customer({ dbName: franchiseDBName.fdbname });

        customer.getCustomerDetails().then((customers) => {
            customers.map(async (customer) => {
            if(!isNullOrUndefined(customer.dob)) {
            
                const isCurrentDate = moment().isSame(new Date(customer.dob), "day");
                const customerDOB  = moment(customer.dob);
                const currentDate = moment().add(7, 'hours');
               
                if (customerDOB.format('D') === currentDate.format('D') && customerDOB.format('M') === currentDate.format('M')) {
                    console.log("email...", customer.email);
                    console.log("inside current date");
                    const mailer = new Mailer({ dbName: franchiseDBName.fdbname, emailId: customer.email, name: (customer.first_name + ' ' + customer.last_name), id: customer.id });
                    await mailer.sendBirthdayWish();
                }
            }
            });
        });
        });
    });
}

module.exports = {
    birthdayMail : birthdayMail,
}