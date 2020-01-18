const logo = require('../common/Logo.js');
// import { getDate, getCurrentDate, getDateInDDMMYYYY, getCurrentDateDDMMYYYY } from '../../../../../utils/datetime';
const styles = require('../common/Styles.js');


function buildFinancialReportTable(data, columns, valueKeys, fromDate, toDate){
  var body = [];
  body.push([
      { fillColor: '#C5C7C0', colSpan: 5,
        columns: [
          { text: 'FINANCIAL REPORT BETWEEN ' + getDateInDDMMYYYY(fromDate) + ' To ' + getDateInDDMMYYYY(toDate), bold: true, fontSize:10,  },
          // { text: 'From: ' + getDateInDDMMYYYY(fromDate) + '\t\t-\t\tTo: ' + getDateInDDMMYYYY(toDate) , style: styles.Header3Center},
        ]
      },{},{},{},{}
  ]);

  var headerRow = [];

  headerRow.push(
    { text: columns[0], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8 }
  );
  headerRow.push(    
    { text: columns[1], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8 }
  );
  headerRow.push(
    { text: columns[2], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8 }                   
  );
  headerRow.push(
    { text: columns[3], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8 }                   
  );
  headerRow.push(
    { text: columns[4], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8 }                   
  );
  body.push(headerRow);

  var total = 0 ;

  data.forEach(function(row, index) {
    
    switch (row.status) {
      case 2: 
      case 3:
      case 4:
      case 5:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        total = total + Number(row.payment_amt);
      break;
    }
    

    var dataRow = [];
    valueKeys.forEach(function(column, columnIndex) {
      if(columnIndex===0){
        dataRow.push({ text: (index + 1), style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8,  },);
      }else if(columnIndex===1 || columnIndex===2) {
        dataRow.push({ text: getDateInDDMMYYYY(row[column]), style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8,  },);
      }else{
        dataRow.push({ text: row[column.toLowerCase()], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8,  },);
      }
    })
    body.push(dataRow);
  });


  var footerRow = [];
  footerRow.push(
    { text: 'Total ($) ', style: styles.alignRight, bold: true, fontSize: 10, colSpan: 4 },{},{},{}
  );
  footerRow.push(    
    { text: total.toFixed(2), style: styles.margins, bold: true, alignment: screenLeft, fontSize: 10 }
  );
  
  body.push(footerRow);

  return body;
}

function buildTableBody(data, columns, valueKeys, orderType) {
  var body = [];

  body.push([
    { text: 'PRODUCT AND CREDIT DETAILS: ', style: styles.margins, bold: true, alignment: screenLeft, fontSize: 10, colSpan: 3,  fillColor: '#C5C7C0'}, {},{}
  ]);

  var dataRow1 = [];

  dataRow1.push(
    { text: columns[0], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8 }
  );
  dataRow1.push(    
    { text: columns[1], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8 }
  );
  dataRow1.push(
    { text: columns[2], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8 }                   
  );

  body.push(dataRow1);

  data.forEach(function(row) {
    var dataRow = [];

    valueKeys.forEach(function(column) {
      if(column === 'paymentType') {
        dataRow.push({ text: orderType[0].frequency == 1 ? 'MONTHLY PAYMENT' : orderType[0].frequency == 2 ? 'FORTNIGHTLY PAYMENT' : orderType[0].frequency == 4 ? 'WEEKLY PAYMENT': '', style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8,  },);
      } else {
        dataRow.push({ text: row[column.toLowerCase()], style: styles.margins, bold: true, alignment: screenLeft, fontSize: 8,  },);
      }
    })
    body.push(dataRow);
  });

  return body;
}


module.exports = function FixedOrderForm(reportData, franchiseDetail, order) {

  // const franchise = franchiseDetail;
  // const products = data.product;
  // const customer = data.customer[0];
  // const orderType = order;
  // const budget = data.budget; 
  // const user = data.user[0]; 

  // console.log(reportData);
  // console.log(franchiseDetail);
  console.log(order);
  // console.log('reportData',  reportData);
  // console.log(order);

 

  var dd = {
    content: 
      [        
          { 
            columns: [                 
              { text: [
                 { text: '\n' + franchiseDetail.location + '\n', style: styles.Header1Center },
                 { text: '[PH] ', style: styles.Header1Center, bold: true },
                 { text: franchiseDetail.contact + '\n', style: styles.Header1Center },
                 { text: 'Email: ', style: styles.Header1Center, bold: true },
                 { text: franchiseDetail.email + '\n', style: styles.Header1Center } 
                ]
              },
               [ { image: logo,  fit: [150, 150], style: styles.Header2Center},
                 {text: '\nFINANCE REPORT', style: styles.Header2Center, bold: true }, 
               ],
               { text: '\n\n\nApplication#: ' + order.order_id , style: styles.Header3Center},
            ]
          },
          '\n',
          {
            table: {
              widths: ['*'],                    
              body: [
                [
                  { text: 'CUSTOMER DETAILS: ', style: styles.margins, bold: true, alignment: 'screenLeft', fontSize: 10 ,  fillColor: '#C5C7C0' }, 
                ],
                [                     
                  {style:styles.margins, text: [  
                    { text: order.first_name + ' ' + order.last_name + '\n', style: styles.fontSize9,  bold: true, fontSize: 10 }, 
                    { text: order.address + ', ' + order.city + ' - '+ order.postcode + '\n', style: styles.fontSize9,}, 
                    { text: 'PH: ', style: styles.fontSize9, bold: true }, 
                    { text: order.telephone + '\t\t', style: styles.fontSize9,}, 
                    { text: 'Mobile: ', style: styles.fontSize9, bold: true }, 
                    { text: order.mobile + '\n', style: styles.fontSize9,}, 
                    { text: 'Email: ', style: styles.fontSize9, bold: true }, 
                    { text: order.email + '\n', style: styles.fontSize9,}, 
                  ], lineHeight: 1.2,}
                ],
              ]
            },
          },
          '\n',
          // {
          //   border: [true, false, true, true],
          //   table: {
          //     widths: ['*','*','*'],                
          //     body:buildTableBody(products, ['Product', 'Description', 'Payment Type'], ['name', 'description', 'paymentType'], orderType),  
          //   },
          // },
          '\n',   
          // {
          //   table: {
          //     widths: ['50%','50%'],
          //     body: [
          //       [
          //         { fillColor: '#C5C7C0', colSpan: 2,
          //           columns: [
          //             { text: 'ORDER DETAILS: ', bold: true, fontSize:10,  },
          //             // { text: 'From: ' + getDateInDDMMYYYY(fromDate) + '\t\t-\t\tTo: ' + getDateInDDMMYYYY(toDate) , style: styles.Header3Center},
          //           ]
          //         },{}
          //       ],
          //       [
          //         { text: 'Order Date: ' + getDateInDDMMYYYY(order.order_date) , bold: true, fontSize: 9 },
          //         { text: 'Delivery Date ' + getDateInDDMMYYYY(order.delivery_date), bold: true,  fontSize: 9 },
          //       ],
          //       [
          //         { text: 'Rentral Type: ' + (order.order_type === 1 ? "Fix" : 'Flex'),  bold: true, fontSize: 9 },
          //         { text: 'Status: ' + order.order_status_name,  bold: true, fontSize: 9,},                  
          //       ],                
          //     ]
          //   },
          // },
          // '\n',
          // {
          //   border: [true, false, true, true],
          //   table: {
          //     widths: ['15%','*','*','*','*'],                
          //     body: buildFinancialReportTable(reportData, ['#', 'Payment Date', 'Settlement Date', 'Status', 'Payment Amt ($)'], ['installment_no', 'payment_date', 'settlement_date', 'status_name', 'payment_amt'], fromDate, toDate),
          //   },
          // },
      ],  
      pageSize: 'A4',
      pageOrientation: 'portrait',
  }
  return dd ;
}