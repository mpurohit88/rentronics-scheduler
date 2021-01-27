const Franchise = require("../models/franchise.js");
const Ezidebit = require("../models/ezidebit.js");
const Order = require("../models/order.js");
const jwt = require('jsonwebtoken');
const { getDateTime, getDate } = require('../common/datetime.js');
const OrderAPI = require('../api/order.js');
const EzidebitAPI = require('../api/ezidebit.js');

const { getCurrentDateDBFormat, getNext5YearDate, getPrev5YearDate, getPrev1YearDate } = require('../common/datetime.js');
const { isNullOrUndefined } = require("util");
const EzidebitPayments = require("../models/ezidebit.js");

const getPayments = async function () {

    const franchise = new Franchise();

    await franchise.getEzidebitAccountDetails().then((result) => {
console.log('ffff',result)
        try {
            const payParams = {};
            payParams.PaymentType = 'ALL';
            payParams.PaymentMethod = 'ALL';
            payParams.PaymentSource = 'ALL';
            payParams.DateField = 'PAYMENT';
            payParams.DateFrom = getPrev1YearDate(); //getCurrentDateDBFormat();
            payParams.DateTo = getCurrentDateDBFormat(),

                result.map(async (eziAcc) => {
                    try {
                        payParams.DigitalKey = eziAcc.digital_key;
                        payParams.fdbName = eziAcc.fdbname;

                        const ezidebit = new Ezidebit(payParams);
                        console.log("before get payment call");
                        const result = await ezidebit.GetPayments();
                        console.log("after get payment call");
                        const resultData = result.Data;
                        if (resultData) {
                            console.log('inside if condition');

                            ezidebit.scheduleData = resultData;

                            for (const data of resultData) {
                                await ezidebit.updateScheduleTable(data);
                            }

                            let ezidebitCustomerIds = [...new Set(resultData.map(dist => Number(dist.EzidebitCustomerID)))];
                            let token = '';
                            let dbPost = eziAcc.fdbname.split('_')[2];

                            const payload = { id: 1, user_id: `user_${dbPost}_0000` };
                            // const payload = { id: 1, user_id: `firs_auso_1111` };
                            const options = { expiresIn: '12h', issuer: 'https://sargatechnology.com' };
                            const secret = 'secret';
                            token = jwt.sign(payload, secret, options);

                            console.log('start updating payment table with customer ids',ezidebitCustomerIds);
                            await EzidebitAPI.updatePaymentSchedule({
                                ezidebitCustomerIds: ezidebitCustomerIds,
                            }, token);
                            console.log('end updating payment table');
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
