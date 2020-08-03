const Franchise = require("../models/franchise.js");
const Ezidebit = require("../models/ezidebit.js");


const { getCurrentDateDBFormat, getNext5YearDate } = require('../common/datetime.js');

const getPayments = async function () {

    const franchise = new Franchise();

    await franchise.getEzidebitAccountDetails().then((result) => {
        try {
            const payParams = {};
            payParams.PaymentType = 'ALL';
            payParams.PaymentMethod = 'ALL';
            payParams.PaymentSource = 'ALL';
            payParams.DateField = 'PAYMENT';
            payParams.DateFrom = getCurrentDateDBFormat();
            payParams.DateTo = getNext5YearDate(),

                result.map(async (eziAcc) => {
                    try {
                        payParams.DigitalKey = eziAcc.digital_key;
                        payParams.fdbName = eziAcc.fdbname;

                        const ezidebit = new Ezidebit(payParams);
                        const result = await ezidebit.GetPayments();
                        const resultData = result.Data;
                        if (resultData) {
                            // console.log('resultData', resultData);
                            if (resultData.Payment) {
                                ezidebit.scheduleData = resultData.Payment;
                                await ezidebit.updateScheduleTable();
                            }
                        }
                    } catch (ex) {
                        console.log("Payment Scheduler", ex);
                    }
                });
        } catch (ex) {
            console.log("Payment Database", ex);
            throw ex;
        }
    });

}

module.exports = {
    getPayments: getPayments,
};