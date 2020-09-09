const Franchise = require("../models/franchise.js");
const Ezidebit = require("../models/ezidebit.js");
const Order = require("../models/order.js");
const jwt = require('jsonwebtoken');
const { getDateTime, getDate } = require('../common/datetime.js');
const OrderAPI = require('../api/order.js');

const { getCurrentDateDBFormat, getNext5YearDate, getPrev5YearDate } = require('../common/datetime.js');
const { isNullOrUndefined } = require("util");
const EzidebitPayments = require("../models/ezidebit.js");

const getPayments = async function () {

    const franchise = new Franchise();

    await franchise.getEzidebitAccountDetails().then((result) => {
        try {
            const payParams = {};
            payParams.PaymentType = 'ALL';
            payParams.PaymentMethod = 'ALL';
            payParams.PaymentSource = 'ALL';
            payParams.DateField = 'PAYMENT';
            payParams.DateFrom = getPrev5YearDate(); //getCurrentDateDBFormat();
            payParams.DateTo = getCurrentDateDBFormat(),

                result.map(async (eziAcc) => {
                    try {
                        payParams.DigitalKey = eziAcc.digital_key;
                        payParams.fdbName = eziAcc.fdbname;

                        const ezidebit = new Ezidebit(payParams);
                        console.log("before get payment call");
                        const result = await ezidebit.GetPayments();
                        console.log("after get payment call", result);
                        const resultData = result.Data;
                        if (resultData) {
                            console.log('inside if condition');                           
                            
                            ezidebit.scheduleData = resultData;
                            console.log('***before updating Schedule of ezidebit table');
                            await ezidebit.updateScheduleTable();
                            console.log('***after updating Schedule of ezidebit table');

                            
                            let ezidebitCustomerIds = [...new Set(resultData.map(dist => Number(dist.EzidebitCustomerID)))];
                            const orderModel = new Order({
                                fdbName: eziAcc.fdbname,
                                order_id: ezidebitCustomerIds.join(','),
                            });
                            
                            const orders = await orderModel.getOrdersDetails();
                            let token = '';
                            if(orders.length > 0){
                                const payload = { id: 1, user_id: orders[0].user_id };
                                const options = { expiresIn: '12h', issuer: 'https://sargatechnology.com' };
                                const secret = 'secret';
                                token = jwt.sign(payload, secret, options);
                            }

                            (orders.length > 0 ? orders : []).map(async (o, index) => {
                                console.log('***before getting ezi Schedule');
                                const eziSchedule = await ezidebit.getUpdatedSchedule({order_id: o.order_id});
                                console.log('***after getting ezi Schedule');
                                
                                const paySchedule = await orderModel.getPaymentSchedule(o.id);
                                console.log('***after getPaymentSchedule()');
                                let nextInst = paySchedule.nextInstallmentRow;
                                let lastInst = paySchedule.paySchedule;
                                console.log('***after nextInst() lastInst()');


                                (eziSchedule.length > 0 ? eziSchedule: []).map(async (ezi) => {
                                    let dDate = ""; 
                                    let found = eziSchedule.find((ezi) => { if(ezi.paymentStatus === 'S' ){ dDate = ezi.debitDate; }  return ezi.debitDate === nextInst.payment_date });
                                    if(found){
                                        if(found.paymentStatus === 'S'){
                                            const result = await OrderAPI.paymentSubmit({ // Submit payment
                                                order_id : o.id,
                                                customer_id: o.customer_id,
                                                installment_no : nextInst.installment_no,
                                                payment_date: nextInst.payment_date,
                                                settlement_date : ezi.settlementDate,
                                                payment_amt : nextInst.payment_amt,
                                                deposit_amt : Number(ezi.paymentAmount - ezi.transactionFeeCustomer),
                                                total_paid : isNullOrUndefined(lastInst) ? 0 : lastInst.total_paid,
                                                remark : 'Ezidebit',
                                                order_type : o.order_type,
                                                order_type_id : o.order_type_id,
                                            }, token);
                                                
                                            lastInst = result.lastInst[0];
                                            if(result.nextInstallmentRow[0] != null && result.nextInstallmentRow[0] != ''){
                                                nextInst = result.nextInstallmentRow[0];
                                            }
                                            await ezidebit.setScheduleUpdateForCustomer({id: found.id});
                                        }else if(ezi.paymentStatus === 'F' || ezi.paymentStatus === 'D'){
                                            const result = await OrderAPI.dishonourToPayment({
                                                order_id : o.id,
                                                customer_id: o.customer_id,
                                                installment_no : nextInst.installment_no,
                                                payment_amt : nextInst.payment_amt,
                                                payment_date: nextInst.payment_date,
                                                settlement_date : getDate(new Date()),
                                                remark : 'Dishonored',
                                                order_type : o.order_type,
                                                order_type_id : o.order_type_id,
                                            }, token);
                                            lastInst = result.lastInst[0];
                                            if(result.nextInstallmentRow[0] != null && result.nextInstallmentRow[0] != ''){
                                                nextInst = result.nextInstallmentRow[0];
                                            }
                                            await ezidebit.setScheduleUpdateForCustomer({id: found.id});
                                        }
                                    } else {
                                        if(dDate > nextInst.payment_date){  // Dishonored
                                            const result = await OrderAPI.dishonourToPayment({
                                                order_id : o.id,
                                                customer_id: o.customer_id,
                                                installment_no : nextInst.installment_no,
                                                payment_amt : nextInst.payment_amt,
                                                payment_date: nextInst.payment_date,
                                                settlement_date : getDate(new Date()),
                                                remark : 'Dishonored',
                                                order_type : o.order_type,
                                                order_type_id : o.order_type_id,
                                            }, token);
                                            lastInst = result.lastInst[0];
                                            if(result.nextInstallmentRow[0] != null && result.nextInstallmentRow[0] != ''){
                                                nextInst = result.nextInstallmentRow[0];
                                            }
                                        }else if(dDate < nextInst.payment_date){
                                            if(found.paymentStatus === 'S'){
                                                const result = await OrderAPI.paymentSubmit({ // Submit payment
                                                    order_id : o.id,
                                                    customer_id: o.customer_id,
                                                    installment_no : nextInst.installment_no,
                                                    payment_date: nextInst.payment_date,
                                                    settlement_date : ezi.settlementDate,
                                                    payment_amt : nextInst.payment_amt,
                                                    deposit_amt : Number(ezi.paymentAmount - ezi.transactionFeeCustomer),
                                                    total_paid : isNullOrUndefined(lastInst) ? 0 : lastInst.total_paid,
                                                    remark : 'Ezidebit',
                                                    order_type : o.order_type,
                                                    order_type_id : o.order_type_id,
                                                }, token);
                                                    
                                                lastInst = result.lastInst[0];
                                                if(result.nextInstallmentRow[0] != null && result.nextInstallmentRow[0] != ''){
                                                    nextInst = result.nextInstallmentRow[0];
                                                }
                                                await ezidebit.setScheduleUpdateForCustomer({id: found.id});
                                            }else if(ezi.paymentStatus === 'F' || ezi.paymentStatus === 'D'){
                                                const result = await OrderAPI.dishonourToPayment({
                                                    order_id : o.id,
                                                    customer_id: o.customer_id,
                                                    installment_no : nextInst.installment_no,
                                                    payment_amt : nextInst.payment_amt,
                                                    payment_date: nextInst.payment_date,
                                                    settlement_date : getDate(new Date()),
                                                    remark : 'Dishonored',
                                                    order_type : o.order_type,
                                                    order_type_id : o.order_type_id,
                                                }, token);
                                                lastInst = result.lastInst[0];
                                                if(result.nextInstallmentRow[0] != null && result.nextInstallmentRow[0] != ''){
                                                    nextInst = result.nextInstallmentRow[0];
                                                }
                                                await ezidebit.setScheduleUpdateForCustomer({id: found.id});
                                            }
                                        }
                                    }
                                });
                            });                           
                        }
                    } catch (ex) {
                        console.log("Payment Scheduler", ex);
                    }
                });
        } catch (ex) {
            // console.log("Payment Database", ex);
            throw ex;
        }
    });

}

module.exports = {
    getPayments: getPayments,
};
