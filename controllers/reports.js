const Report = require("../models/Report");
const Franchise = require("../models/franchise.js");
const FinanceReportDoc = require('../GenerateReport/FinanceReportDoc.js');
const { trans } = require("../mailtransporter");


const { isNullOrUndefined } = require('util');
const pdfmake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const paymentReport = async function() {
  const franchise = new Franchise();

    franchise.getFranchiseDBName().then((franchiseResult) => {
      franchiseResult.map((franchiseDetail) => {

      const report = new Report({ dbName: franchiseDetail.fdbname });

        report.getActiveOrder().then((activeOrder) => {
          activeOrder.map(async (order) => {
            if(!(isNullOrUndefined(order.id)) &&  !(isNullOrUndefined(order.customer_id))) {
              
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
                        if (err) { return console.log(err); }
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                      });
                  });
                }
          }
        });
      });
    });
  });
}


module.exports = {
    paymentReport : paymentReport,
};