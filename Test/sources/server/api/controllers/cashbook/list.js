module.exports = {

    friendlyName: 'Get Cash Books',
  
    description: 'Get cash books',
  
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
      let { filter, sort, limit, skip } = inputs;
      
      filter = _.extend(filter || {}, { deletedAt: 0 });
  
      let count = await CashBook.count({
        where: filter
      }).intercept({ name: 'UsageError' }, () => {
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      let foundCashBooks;
      
      foundCashBooks = await CashBook.find({
        where: filter,
        sort: sort || 'createdAt DESC',
        limit: limit,
        skip: skip > count ? 0 : skip,
      }).intercept({ name: 'UsageError' }, () => {
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      this.res.json({
        status: true,
        data: foundCashBooks,
        count: count
      });
    }
  };
  