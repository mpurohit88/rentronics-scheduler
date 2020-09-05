const Franchise = require("../models/franchise.js");
const Ezidebit = require("../models/ezidebit.js");


const { getCurrentDateDBFormat, getNext5YearDate, getPrev5YearDate } = require('../common/datetime.js');

const getPayments = async function () {

    const franchise = new Franchise();

    await franchise.getEzidebitAccountDetails().then((result) => {
        try {
            const payParams = {};
            payParams.PaymentType = 'ALL';
            payParams.PaymentMethod = 'ALL';
            payParams.PaymentSource = 'ALL';
            payParams.DateField = 'SETTLEMENT';
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
                            // if (resultData.Payment) {
                            console.log(resultData);
                            ezidebit.scheduleData = resultData;
                            await ezidebit.updateScheduleTable();
                            // }
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
