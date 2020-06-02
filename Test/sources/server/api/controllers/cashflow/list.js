module.exports = {

    friendlyName: 'Get Income/expense Card',
  
    description: 'Get list of income/expense Card',
  
    inputs: {
      filter: {
        type: 'json',
      },
      sort: {
        type: 'json',
      },
      limit: {
        type: 'number',
      },
      skip: {
        type: 'number',
      }
    },
  
    fn: async function (inputs) {
      let {filter, sort, limit, skip} = inputs;
      if (!filter) {
        filter = {};
      }
  
      filter = _.extend(filter, {deletedAt: {'<=': 0}});
  
      if (!sort) {
        sort = 'code ASC';
      }
  
      let count = await IncomeExpenseCard.count({
        where: filter
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      let foundIncomeExpenseCards = await IncomeExpenseCard.find({
        where: filter,
        sort: sort,
        limit: limit,
        skip: skip,
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      this.res.json({
        status: true,
        data: foundIncomeExpenseCards,
        count: count
      });
    }
  };
  