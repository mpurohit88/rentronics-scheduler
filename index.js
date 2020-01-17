const cron = require('cron');
const moment = require("moment");

const Franchise = require("./models/franchise.js");
const Customer = require("./models/customer");
const Report = require("./models/Report");
const Mailer = require("./mailer");

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

       
// const generatePaymentReport = async (reportData, franchiseDetail, order) => {
//     pdfmake.vfs = pdfFonts.pdfMake.vfs;
//     let doc = {
//       pageSize: "A4",
//       pageOrientation: "portrait",
//       pageMargins: [30, 30, 30, 30],
//       content: []
//     };
//     let financeReportDoc = FinanceReportDoc(reportData, franchiseDetail, order);
//       if(financeReportDoc.content) {
//         doc.content.push(financeReportDoc.content);
//       }
//       // console.log(doc)
    
//       // pdfmake.createPdf(doc).download('test.pdf');
// }

// const paymentReport = cron.job("*/5 * * * * *", function () {
//   console.log("paymentReport scheduler is running.....");

//   const franchise = new Franchise();

//     franchise.getFranchiseDBName().then((franchiseResult) => {
//       franchiseResult.map((franchiseDetail) => {

//       const report = new Report({ dbName: franchiseDetail.fdbname });

//         report.getActiveOrder().then((activeOrder) => {
//           activeOrder.map(async (order) => {
//             if(order.id != null && order.customer_id != null) {
              
//               const reportData = await report.getOrderReport(order.id, order.customer_id);
//               // const orderType = await report.getOrderType(order.order_type, order.order_type_id )
              
//                 if(reportData != null && reportData != "") {
//                   // console.log(reportData);
//                   generatePaymentReport(reportData, franchiseDetail, order);
//                 }
              
//               // const mailer = new Mailer({ dbName: franchiseDetail.fdbname, emailId: customer.email, name: (customer.first_name + ' ' + customer.last_name), id: customer.id });
//               // mailer.sendBirthdayWish();
//           }
//         });
//       });
//     });
//   });
// });

// paymentReport.start();
cronJob.start();
