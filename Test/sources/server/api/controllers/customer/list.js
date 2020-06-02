module.exports = {

  friendlyName: 'Get Customer',

  description: 'Get list of customers',

  inputs: {
    filter: {
      type: "json"
    },
    manualFilter: {
      type: "json"
    },
    manualSort: {
      type: "json"
    },
    sort: {
      type: 'string',
    },
    limit: {
      type: "number"
    },
    skip: {
      type: "number"
    },
    isBranch: {
      type: "ref"
    },
    select: {
      type: "json"
    }
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort, isBranch, select } = inputs;
    
    let type = parseInt(this.req.params.type);
    // let permissionName = ( type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ) ? sails.config.constant.ROLE_CUSTOMER : sails.config.constant.ROLE_SUPPLIER;
    // let check = await sails.helpers.checkPermission(permissionName, sails.config.constant.PERMISSION_TYPE.TYPE_ALL, this.req);

    // if(!check){
    //   this.res.json({
    //     status: false,
    //     error: sails.__('Không có quyền thực hiện thao tác này')
    //   });
    //   return;
    // }

    filter = _.extend(filter || {}, { deletedAt: 0, type: type, branchId: isBranch ? undefined : this.req.headers['branch-id'] });

    let customerCheckCard = await Customer.find(this.req, _.pickBy({
      where: filter,
      sort: sort || "totalOutstanding DESC",
      select: select

    },value => value !== undefined ))
      .intercept({ name: "UsageError" }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__("Thông tin yêu cầu không hợp lệ")
        });
        return;
      });
    
    
    customerCheckCard = sails.helpers.manualSortFilter(customerCheckCard, manualFilter, manualSort);
    this.res.json({
      status: true,
      count: customerCheckCard.length,
      data: limit ? customerCheckCard.slice(skip, limit + skip) : customerCheckCard,
      
    });
  }
};
