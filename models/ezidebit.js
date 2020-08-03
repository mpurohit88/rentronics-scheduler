const soap = require('soap');
const connection = require('../config/connection.js');
const { dbName } = require('../config/db.js');
const { wsdlUrl, custUrl } = require("../config/ezidebit.js");
const { isNullOrUndefined } = require('util');
const { getDateTime } = require('../common/datetime.js');

var EzidebitPayments = function (params) {
  this.fdbName = params.fdbName;
  this.PaymentType = params.PaymentType;
  this.PaymentMethod = params.PaymentMethod;
  this.PaymentSource = params.PaymentSource;
  this.DateField = params.DateField;
  this.DateFrom = params.DateFrom;
  this.DateTo = params.DateTo;
  this.DigitalKey = params.DigitalKey;
  this.scheduleData = params.scheduleData;
};





// Direct Fetch from Ezidebit API
EzidebitPayments.prototype.GetPayments = function () {
  const that = this;

  return new Promise((resolve, reject) => {
    const payParams = {
      DigitalKey: that.DigitalKey,
      PaymentType: that.PaymentType,
      PaymentMethod: that.PaymentMethod,
      PaymentSource: that.PaymentSource,
      DateFrom: that.DateFrom,
      DateTo: that.DateTo,
      DateField: that.DateField,
    };

    console.log('** pay param **', payParams);

    soap.createClient(wsdlUrl, (err, soapClient) => {
      console.log("wsdl client: ", soapClient);
      console.log("wsdl client error: ", err);
      soapClient.GetPayments(payParams, (err, result) => {
        const error = result.GetPaymentsResult;
        if (!isNullOrUndefined(err) || isNullOrUndefined(error)) {
          console.log('Error...', error);
          reject(err);
        } else if (error.Error) {
          console.log('Error...', error.ErrorMessage);
          reject(error.Error);
        } else {
          resolve(result.GetPaymentsResult);
          // console.log(result.GetPaymentsResult.Data.Payment)
        }
      });
    });
  });
};



EzidebitPayments.prototype.updateScheduleTable = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({ database: that.fdbName });

      Object.values(that.scheduleData).map((data, index) => {
        let dDate = isNullOrUndefined(data.DebitDate) ? '' : getDateTime(data.DebitDate);
        let sDate = isNullOrUndefined(data.SettlementDate) ? '' : getDateTime(data.SettlementDate);


        // console.log('data', sDate, dDate);

        let updateQuery = `UPDATE ezidebit_payments SET bankFailedReason = '${data.BankFailedReason}', bankReceiptID = '${data.BankReceiptID}', bankReturnCode = '${data.BankReturnCode}', 
            customerName = '${data.CustomerName}', debitDate = '${dDate}', eziDebitCustomerID = '${data.EzidebitCustomerID}', invoiceID = '${data.InvoiceID}', 
            paymentAmount = '${data.PaymentAmount}', paymentID = '${data.PaymentID}', paymentMethod = '${data.PaymentMethod}', paymentReference = '${data.PaymentReference}', 
            paymentSource = '${data.PaymentSource}', paymentStatus = '${data.PaymentStatus}', settlementDate = '${sDate}', scheduledAmount = '${data.ScheduledAmount}',
            transactionFeeClient = '${data.TransactionFeeClient}', transactionFeeCustomer = '${data.TransactionFeeCustomer}', yourGeneralReference = '${data.YourGeneralReference}',
            yourSystemReference = '${data.YourSystemReference}', is_active = 1, updated_at = now()
            WHERE debitDate LIKE '${dDate}%' AND ezidebitCustomerID = '${data.EzidebitCustomerID}';`;

        let insertQuery = `INSERT INTO ezidebit_payments(bankFailedReason, bankReceiptID, bankReturnCode, customerName, debitDate, eziDebitCustomerID, invoiceID, paymentAmount, paymentID, 
            paymentMethod, paymentReference, paymentSource, paymentStatus, settlementDate, scheduledAmount, transactionFeeClient, transactionFeeCustomer, yourGeneralReference, yourSystemReference, is_active)
            VALUES ('${data.BankFailedReason}', '${data.BankReceiptID}', '${data.BankReturnCode}', '${data.CustomerName}', '${dDate}', '${data.EzidebitCustomerID}', 
            '${data.InvoiceID}', '${data.PaymentAmount}', '${data.PaymentID}', '${data.PaymentMethod}', '${data.PaymentReference}','${data.PaymentSource}', '${data.PaymentStatus}', '${sDate}', 
            '${data.ScheduledAmount}','${data.TransactionFeeClient}','${data.TransactionFeeCustomer}', '${data.YourGeneralReference}', '${data.YourSystemReference}', 1);`

        connection.query(updateQuery, function (error, updateResult, fields) {
          if (error) { console.log("Error...", error); reject(error); }
          if (updateResult.changedRows === 0) {
            connection.query(insertQuery, function (error, insertResult, fields) {
              if (error) { console.log("Error...", error); reject(error); }
              resolve(insertResult);
            });
          } else {
            resolve(updateResult);
          }
        });
      });

      connection.release();
      // console.log('Process Complete %d', connection.threadId);
    });
  });
};


module.exports = EzidebitPayments;