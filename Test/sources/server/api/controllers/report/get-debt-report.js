module.exports = {

  friendlyName: 'Get Debt Data',

  description: 'Get debt data',

  inputs: {
    type: {
      type: 'number',
    },
    startDate: {
      type: "number"
    },
    endDate: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let { type, startDate, endDate } = inputs;
    let branchId = this.req.headers['branch-id'];

    let CUSTOMER_DEBT_SQL = 
      `SELECT d.id, d.remainingValue as sumDebt,  d.customerId, c.code, c.name, c.type
      FROM debt d 
      LEFT JOIN customer c ON d.customerId = c.id 
      WHERE d.id in (
        SELECT Max(d.id) as id
        FROM debt d
        WHERE d.customerId IN (
          SELECT id FROM customer 
          WHERE deletedAt = 0 AND branchId = ${branchId})
        AND d.createdAt BETWEEN $1 AND $2
        GROUP BY d.customerId)`;
      
    let debtRecords = await sails.sendNativeQuery(this.req ,CUSTOMER_DEBT_SQL, [startDate, endDate]);
       
    let totalDebt = 0, arrData = [];

    _.forEach(debtRecords.rows, item => {
      if (item.sumDebt > 0 && item.type == type) {
        arrData.push(item);
        totalDebt += item.sumDebt
      }

      if (item.sumDebt < 0 && item.type != type){
        item.sumDebt = -item.sumDebt;
        arrData.push(item);
        totalDebt += item.sumDebt
      }
    })

    this.res.json({
      status: true,
      debtRecords: arrData,
      totalDebt: totalDebt
    });
  }
};
