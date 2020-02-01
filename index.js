const cron = require('cron');
const moment = require("moment");
const nodemailer = require('nodemailer');

const Franchise = require("./models/franchise.js");
const Customer = require("./models/customer");
const Report = require("./models/Report");
const Mailer = require("./mailer");
const { trans } = require("./mailtransporter");

const pdfmake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const FinanceReportDoc = require('./GenerateReport/FinanceReportDoc.js');


const cronJob = cron.job("0 */1 * * * *", function () {
  console.log("DOB scheduler is running.....");

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


const paymentReport = cron.job("*/5 * * * * *", async function () {
  console.log("paymentReport scheduler is running.....");

  const franchise = new Franchise();

    franchise.getFranchiseDBName().then((franchiseResult) => {
      franchiseResult.map((franchiseDetail) => {

      const report = new Report({ dbName: franchiseDetail.fdbname });

        report.getActiveOrder().then((activeOrder) => {
          activeOrder.map(async (order) => {
            if(order.id != null && order.customer_id != null) {
              
              const reportData  = await report.getOrderReport(order.id, order.customer_id);
              const productData = await report.getProductDetail(order.product_id);
              const orderType   = await report.getOrderType(order.id, order.order_type, order.order_type_id);
              
                if(reportData != null && reportData != "") {
                  pdfmake.vfs = pdfFonts.pdfMake.vfs;
                  
                  let financeReportDoc = FinanceReportDoc(reportData, franchiseDetail, order, productData, orderType);
                
                  pdfmake.createPdf(financeReportDoc).getBase64((encodedString) => {
                      const mail = {
                        from: 'sktanwar.2020@gmail.com',
                        // from: 'admin@' + domainName,
                        //to: 'mpurohit88@gmail.com	',
                        // cc: 'admin@' + domainName,
                        // to: that.emailId,
                        to: 'sktanwar.2014@gmail.com',
                        subject: `Payment Report`,
                        attachments: [{
                          filename: "test.pdf",
                          type: "application/pdf",
                          content: Buffer.from(encodedString, 'base64')
                        }],
                        html: 'Check your last month report'
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
                }
              
              // const mailer = new Mailer({ dbName: franchiseDetail.fdbname, emailId: customer.email, name: (customer.first_name + ' ' + customer.last_name), id: customer.id });
              // mailer.sendBirthdayWish();
          }
        });
      });
    });
  });
});

paymentReport.start();
cronJob.start();
