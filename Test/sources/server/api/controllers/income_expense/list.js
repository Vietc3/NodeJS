module.exports = {
  friendlyName: "Get Income Expense",

  description: "Get data Income Expense Cards.",

  inputs: {
    filter: {
      type: "json"
    },
    sort: {
      type: "ref"
    },
    limit: {
      type: "number"
    },
    skip: {
      type: "number"
    },
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip } = inputs;
    let req = this.req;
    // kiểm tra quyền được list danh sách income expense
    let check = await sails.helpers.checkPermission(sails.config.constant.ROLE_INCOME_EXPENSE, sails.config.constant.PERMISSION_TYPE.TYPE_VIEW_ONLY, this.req);

    let checkReport = await sails.helpers.checkPermission(sails.config.constant.ROLE_REPORT_INCOME_EXPENSE, sails.config.constant.PERMISSION_TYPE.TYPE_VIEW_ONLY, this.req);
   
    if (!check && !checkReport) {
      this.res.json({
        status: false,
        error: sails.__('Không có quyền thực hiện thao tác này')
      });
      return;
    }
    
    filter = _.extend(filter || {}, { deletedAt: 0, branchId: req.headers['branch-id'] });
    let options = {
      select: ['*', 'incomeExpenseCardTypeId.name', 'createdBy.fullName', 'c.code as customerCode', 'incomeExpenseAt'],
      customSelect: 'CASE WHEN (u.fullName IS NOT NULL) THEN u.fullName else (CASE WHEN (c.name IS NOT NULL) THEN c.name else m.customerName end) end as customerName',
      model: IncomeExpenseCard, 
      filter: filter, 
      populates: ['incomeExpenseCardTypeId', 'createdBy'],
      customPopulates: `left join customer c on c.id = m.customerId and `+
                      `(m.customerType = ${sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER} or m.customerType = ${sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER}) `+
                      `left join user u on u.id = m.customerId and m.customerType = ${sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.STAFF}`,
      limit,
      skip,
      sort: sort && Array.isArray(sort) ? sort : [{updatedAt: 'DESC'}],
      customFilterField: {'customerName': ['u.fullName', 'c.name', 'm.customerName'], 'customerCode': ['c.code']},
      count: true
    };
    
    let {foundData, count} = await sails.helpers.customSendNativeQuery(req, options);
    foundIncomeExpenseCards = foundData;

    this.res.json({
      status: true,
      data: foundIncomeExpenseCards,
      count
    });
  }
};
