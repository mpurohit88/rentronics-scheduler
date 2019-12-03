const PaymentSchedules = require('../../models/migration/paymentSchedules');
const PaymentSchedule = require('../../models/migration/paymentSchedule');
const  fs = require("fs");



// const Order = require('../../api/order');

const readSchedule = async function () {

  // const result = await Order.onLogin({
  //   username: "firo_auea_0042",
  //   password: "h4ct3duh",
  // });

  try {
    const paymentSchedules = new PaymentSchedules();
    const scheudules = await paymentSchedules.readSchedule();
    // console.log(scheudules);
    
    // let query = 'INSERT INTO payment_status(order_id, customer_id, installment_no, sub_installment_no, payment_date, payment_rec_date, payment_amt, total_paid, due_installment_amt, status, is_active, created_by, created_at) VALUES \n';

    // fs.writeFile("temp.js",query, (err) => {
    //   if(err){console.log(err)} 
    //   console.log('Query added successfully');
    // });

    // console.log('scheudules.length', scheudules.length);
    
    
    let totalPaid = 0;
    let orderNo = scheudules[0].order_id;    
    
    (scheudules.length > 0 ? scheudules : []).map((data, index) => {
      if(orderNo !== data.order_id){
        totalPaid = 0;
        orderNo = data.order_id;
      }
      if(data.status == 1 || (data.status == 0 && data.remark != '' && data.remark != null)){
        if(data.status === 1 ){totalPaid = totalPaid + data.payment_amount;}else{
          data.payment_amount = 0;
        }
        const paymentSchedule = new PaymentSchedule({
          order_id: data.order_id,
          customer_id: data.customer_id,
          installment_no: data.installment_no,
          payment_date: data.payment_date,
          payment_rec_date: data.payment_rec_date,
          payment_amt: data.payment_amount,
          total_paid: totalPaid,
          due_installment_amt: 0,
          sub_installment_no: 0,
          status: data.status,
          is_active : data.is_active,
          created_by : data.created_by,
          created_at : data.created_at,
        });
        
        paymentSchedule.insertRecord();
        

        // let rowData = ("(" + data.order_id + "," + data.customer_id + "," + data.installment_no + "," + "0," + data.payment_date + "," + data.payment_rec_date + "," + data.payment_amount + "," + totalPaid + ",0," + data.status + "," + data.is_active + "," + data.created_by + ",\'" +  data.created_at + "\'),\n");
        // fs.appendFile("temp.js", rowData, (err) => 
        //   { if (err) console.log(err);
        //     // console.log("Successfully Written to File."); 
        //   });
      }
    });

    
      // let i = 0;
      // let installment_no = 0;
      // let arrayOfInsta = [];
      // let is_active = 1;
      // is_active = 1;
      // const order_id = scheudules[i].order_id;

      // if (scheudules[i].status === 1 || (scheudules[i].status === 0 && scheudules[i].remark !== '')) {
      //   if (arrayOfInsta[order_id]) {
      //     installment_no = arrayOfInsta[order_id];
      //     installment_no = installment_no + 1;
      //     arrayOfInsta[order_id] = installment_no;
      //   } else {
      //     installment_no = installment_no + 1;
      //     arrayOfInsta[order_id] = installment_no;
      //   }
      // } else {
      //   installment_no = -1;
      //   is_active = 0;
      // }

      // const paymentSchedule = new PaymentSchedule({
      //   id: scheudules[i].id,
      //   order_id: scheudules[i].order_id,
      //   customer_id: scheudules[i].customer_id,
      //   installment_no: installment_no,
      //   payment_date: scheudules[i].payment_date,
      //   status: scheudules[i].status,
      //   is_active: scheudules[i].is_active,
      //   created_at: scheudules[i].created_at,
      //   created_by: scheudules[i].created_by
      // });

    console.log("Completed....");
  } catch (ex) {
    console.log("error...", ex);
  }
}

module.exports = { readSchedule: readSchedule }