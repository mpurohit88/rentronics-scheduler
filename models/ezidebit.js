const soap = require('soap');
const xml2js = require('xml2js');
const fs = require('fs');
const axios = require('axios');
const connection = require('../config/connection.js');
const { dbName } = require('../config/db.js');
const { wsdlUrl, custUrl } = require("../config/ezidebit.js");
const { isNullOrUndefined } = require('util');
const { getDateTime, getDate } = require('../common/datetime.js');

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
  this.order_id = params.order_id;
};





// Direct Fetch from Ezidebit API
EzidebitPayments.prototype.GetPayments = function () {
  const that = this;

  return new Promise((resolve, reject) => {
    const payParams = {
      // DigitalKey: '3AF80E10-D1B9-4D44-1D74-CBC198226A97',
      DigitalKey: that.DigitalKey,
      PaymentType: that.PaymentType,
      PaymentMethod: that.PaymentMethod,
      PaymentSource: that.PaymentSource,
      DateFrom: that.DateFrom,
      DateTo: that.DateTo,
      DateField: that.DateField,
      PaymentReference: '',
      EziDebitCustomerID: '',
      YourSystemReference: ''
    };

    console.log('** pay param **', payParams);

    let xml =
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:px="https://px.ezidebit.com.au/">'
      + '<soapenv:Header/>'
      + '<soapenv:Body>'
      + '<px:GetPayments>'
      + '<px:DigitalKey>' + payParams.DigitalKey + '</px:DigitalKey>'
      + '<px:PaymentType>' + payParams.PaymentType + '</px:PaymentType>'
      + '<px:PaymentMethod>' + payParams.PaymentMethod + '</px:PaymentMethod>'
      + '<px:PaymentSource>' + payParams.PaymentSource + '</px:PaymentSource>'
      + '<px:PaymentReference></px:PaymentReference>'
      + '<px:DateFrom>' + payParams.DateFrom + '</px:DateFrom>'
      + '<px:DateTo>' + payParams.DateTo + '</px:DateTo>'
      + '<px:DateField>' + payParams.DateField + '</px:DateField>'
      // + '<px:EziDebitCustomerID></px:EziDebitCustomerID>'
      // + '<px:YourSystemReference></px:YourSystemReference>'
      + '</px:GetPayments>'
      + '</soapenv:Body>'
      + '</soapenv:Envelope>'

    axios.post('https://api.ezidebit.com.au/v3-5/nonpci', xml, {
      headers:
      {
        'Content-Type': 'text/xml',
        'SOAPAction': 'https://px.ezidebit.com.au/INonPCIService/GetPayments'
      }
    })
      .then(function (response) {
        // console.log(response);
        // convert XML to JSON
        xml2js.parseString(response.data, (err, result) => {
          if (err) {
            throw err;
          }

          resolve({ Data: result["s:Envelope"]["s:Body"][0].GetPaymentsResponse[0].GetPaymentsResult[0].Data[0].Payment })

        });
      })
      .catch(function (error) {
        console.log(error)
      });
    //   soap.createClient(wsdlUrl, [{ returnFault: true }], (err, soapClient) => {
    //     soapClient.GetPayments(payParams, (err, result) => {
    //       console.log("soapClient GetPayments err", err);
    //       console.log("soapClient GetPayments GetPaymentsResult", result.GetPaymentsResult);

    //       fs.writeFile('ezidebitLog.txt', result.body, function (err) {
    //         if (err) return console.log(err);
    //         console.log('Hello World > helloworld.txt');
    //       });

    //       const error = result.GetPaymentsResult;
    //       if (!isNullOrUndefined(err) || isNullOrUndefined(error)) {
    //         // console.log('Error...', error);
    //         reject(err);
    //       } else if (error.Error) {
    //         // console.log('Error...', error.ErrorMessage);
    //         reject(error.Error);
    //       } else {
    //         resolve(result.GetPaymentsResult);
    //         // console.log(result.GetPaymentsResult.Data.Payment)
    //       }
    //     });
    //   });
  });
};



EzidebitPayments.prototype.updateScheduleTable = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({ database: that.fdbName });
      console.log("inside model to insert into ezidebit payments");
      
      Object.values(that.scheduleData).map(async (data, index) => {

        let whereClouse = ` WHERE debitDate = '${data.DebitDate}' AND ezidebitCustomerID = '${data.EzidebitCustomerID}' AND is_active = 1 `;
        let selectQuery = 'SELECT * FROM ezidebit_payments ' + whereClouse + ' ORDER BY id DESC;';

        let insertQuery = `INSERT INTO ezidebit_payments(bankFailedReason, bankReceiptID, bankReturnCode, customerName, debitDate, eziDebitCustomerID, invoiceID, paymentAmount, paymentID, 
          paymentMethod, paymentReference, paymentSource, paymentStatus, settlementDate, scheduledAmount, transactionFeeClient, transactionFeeCustomer, yourGeneralReference, yourSystemReference, is_active)
          VALUES ('${data.BankFailedReason}', '${data.BankReceiptID}', '${data.BankReturnCode}', '${data.CustomerName}', '${data.DebitDate}', '${data.EzidebitCustomerID}', 
          '${data.InvoiceID}', '${data.PaymentAmount}', '${data.PaymentID}', '${data.PaymentMethod}', '${data.PaymentReference}','${data.PaymentSource}', '${data.PaymentStatus}', '${data.SettlementDate}', 
          '${data.ScheduledAmount}','${data.TransactionFeeClient}','${data.TransactionFeeCustomer}', '${data.YourGeneralReference}', '${data.YourSystemReference}', 1);`


        connection.query(selectQuery, function (error, result, fields) {
          if (error) { console.log("Error...", error); reject(error); }
          // console.log('selectQuery*********', selectQuery)
          // If row already exist
          if(result !== "" && result.length > 0 && !isNullOrUndefined(result)) {            
            let r = result[0];
            // console.log('selectQuery get some rows');
            // if found a diffrent value in any column
            // console.log(r.bankFailedReason, data.BankFailedReason , ',', r.bankReceiptID, data.BankReceiptID , ',', r.bankReturnCode, data.BankReturnCode , ',', r.customerName, data.CustomerName , ',', r.invoiceID, data.InvoiceID , ',', r.paymentAmount, data.PaymentAmount , ',', r.paymentID, data.PaymentID , ',', r.paymentMethod, data.PaymentMethod , ',', r.paymentReference, data.PaymentReference , ',', r.paymentSource, data.PaymentSource , ',', r.paymentStatus, data.PaymentStatus , ',', r.settlementDate, data.SettlementDate, ',', r.scheduledAmount, data.ScheduledAmount , ',', r.transactionFeeClient, data.TransactionFeeClient , ',', r.transactionFeeCustomer, data.TransactionFeeCustomer , ',', r.yourGeneralReference, data.YourGeneralReference , ',', r.yourSystemReference, data.YourSystemReference);
            // console.log(r.bankFailedReason != data.BankFailedReason, r.bankReceiptID != data.BankReceiptID, r.bankReturnCode != data.BankReturnCode, r.customerName != data.CustomerName, r.invoiceID != data.InvoiceID, r.paymentAmount != data.PaymentAmount, r.paymentID != data.PaymentID, r.paymentMethod != data.PaymentMethod, r.paymentReference != data.PaymentReference, r.paymentSource != data.PaymentSource, r.paymentStatus != data.PaymentStatus, r.settlementDate != data.SettlementDate, r.scheduledAmount != data.ScheduledAmount, r.transactionFeeClient != data.TransactionFeeClient, r.transactionFeeCustomer != data.TransactionFeeCustomer, r.yourGeneralReference != data.YourGeneralReference, r.yourSystemReference != data.YourSystemReference, r.settlementDate, data.SettlementDate)
            
            if(r.bankFailedReason != data.BankFailedReason 
                || r.bankReceiptID != data.BankReceiptID 
                || r.bankReturnCode != data.BankReturnCode 
                || r.customerName != data.CustomerName 
                || r.invoiceID != data.InvoiceID 
                || r.paymentAmount != data.PaymentAmount 
                || r.paymentID != data.PaymentID 
                || r.paymentMethod != data.PaymentMethod 
                || r.paymentReference != data.PaymentReference 
                || r.paymentSource != data.PaymentSource 
                || r.paymentStatus != data.PaymentStatus 
                // || r.settlementDate != data.SettlementDate
                || r.scheduledAmount != data.ScheduledAmount 
                || r.transactionFeeClient != data.TransactionFeeClient 
                || r.transactionFeeCustomer != data.TransactionFeeCustomer 
                || r.yourGeneralReference != data.YourGeneralReference 
                || r.yourSystemReference != data.YourSystemReference                 
            ){
              console.log('found a new value for a column****');
              connection.query('UPDATE ezidebit_payments SET is_active = 0, updated_at = now() ' + whereClouse, function (error, rows, fields) {
                if (error) { console.log("Error...", error); reject(error); }
                connection.query(insertQuery, function (error, insertedRows, fields) {
                  if (error) { console.log("Error...", error); reject(error); }
                  // resolve(insertedRows);       
                });
              });
            }
          }else{
            console.log('it\'s a totally new record', data.DebitDate);
            connection.changeUser({ database: that.fdbName });
            connection.query(insertQuery, function (error, insertedRows, fields) {
              if (error) { console.log("Error...", error); reject(error); } 
              // resolve(insertedRows);       
            });
          }
        });
        if((index + 1) === that.scheduleData.length){
          // console.log(index + 1, that.scheduleData.length)
          resolve();
        }
      });

      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
};




EzidebitPayments.prototype.getUpdatedSchedule = function ({order_id}) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({ database: that.fdbName });
      connection.query(`SELECT id, bankFailedReason, bankReceiptID, bankReturnCode, customerName, eziDebitCustomerID, invoiceID, paymentAmount, paymentID, paymentMethod, paymentReference, paymentSource, paymentStatus, scheduledAmount, transactionFeeClient, transactionFeeCustomer, yourGeneralReference, yourSystemReference, is_updated, is_active, created_at, updated_at,  DATE_FORMAT(debitDate, '%Y-%m-%d') AS debitDate, DATE_FORMAT(settlementDate, '%Y-%m-%d') AS settlementDate FROM ezidebit_payments WHERE yourSystemReference = '${order_id}' AND is_active = 1 AND is_updated = 0 AND paymentID NOT IN("SCHEDULED", "") ORDER BY debitDate`, function (error, result, fields) {
        if (error) { console.log("Error...", error); reject(error); }
        resolve(result);
      });

      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
};



EzidebitPayments.prototype.setScheduleUpdateForCustomer = function ({id}) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({ database: that.fdbName });
      connection.query(`UPDATE ezidebit_payments SET is_updated = 1 WHERE id = '${id}';`, function (error, result, fields) {
        if (error) { console.log("Error...", error); reject(error); }
        resolve(result);
      });

      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
};


module.exports = EzidebitPayments;