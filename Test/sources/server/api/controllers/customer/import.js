module.exports = {

  friendlyName: 'Import  products',

  description: 'Import products',

  inputs: {
    data: {
      type: "json"
    },
    stopOnCodeDuplicateError: {
      type: "number"
    },
  },

  fn: async function (inputs) {
    let {
      data,
      stopOnCodeDuplicateError,
    } = inputs;

    data = JSON.parse(data);
    let type = parseInt(this.req.params.type);
    let Customers = [];
    let failCodeCustomers = [];
    let arrCode = [];
    let error = [];
    let foundCustomers = [];
    let branchId = this.req.headers['branch-id'];
    if (!stopOnCodeDuplicateError) {

      data.map(item => {
        if(item.code) {
          arrCode.push(item.code) 
          let checkExistPrefix = sails.helpers.common.checkPrefixCode((type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER) ? sails.config.cardcode.customerFirstCode : sails.config.cardcode.providerFirstCode, item.code);
          if(!checkExistPrefix.status){
            error.push({
              code: item.code,
              name: item.name,
              reason: checkExistPrefix.message
            })
          }
        }
      });

      failCodeCustomers = await Customer.find(this.req, {
        where: {
          code: arrCode,
          deletedAt: 0
        }
      });

      if (failCodeCustomers.length > 0 || error.length > 0) {
        failCodeCustomers.map(item => {if(!error.some(ele => ele.code === item.code)) error.push({
          code: item.code,
          name: item.name,
          reason: item.branchId == branchId ? sails.__("Trùng mã") : sails.__('Mã khách hàng đã tồn tại ở chi nhánh khác')
        })})
        return ({
          status: false,
          error: error
        });
      }
      else {
        for (let i in data) {
          let customer;
          let foundCustomer = await Customer.findOne(this.req, { code: data[i].code });
          let gender =  data[i].gender ? data[i].gender.charAt(0).toUpperCase() + data[i].gender.slice(1) : "";
          
          if (foundCustomer){
            foundCustomers.push(foundCustomer)
            customer = await sails.helpers.customer.update(this.req, {
              id: foundCustomer.id,
              name: data[i].name,
              code: data[i].code,
              address: data[i].address,
              mobile: data[i].mobile,
              tel: data[i].mobile,
              email: data[i].email || "",
              gender: gender,
              type: type,
              birthday: new Date(data[i].birthday).getTime() || 0,
              notes: data[i].notes,
              maxDeptAmount: Number(data[i].maxDeptAmount) || 0,
              maxDeptDays: Number(data[i].maxDeptDays) || 0,
              taxCode: data[i].taxCode,
              updatedBy: this.req.loggedInUser.id,
              branchId
            })
          }
          else{
            customer = await sails.helpers.customer.create(this.req, {
              name: data[i].name,
              code: data[i].code,
              address: data[i].address,
              mobile: data[i].mobile,
              tel: data[i].mobile,
              email: data[i].email || "",
              gender: gender,
              type: type,
              birthday: new Date(data[i].birthday).getTime() || 0,
              notes: data[i].notes,
              maxDeptAmount: Number(data[i].maxDeptAmount) || 0,
              maxDeptDays: Number(data[i].maxDeptDays) || 0,
              taxCode: data[i].taxCode,
              branchId,
              createdBy: this.req.loggedInUser.id,
              updatedBy: this.req.loggedInUser.id
            })
          }
          if(!customer.status){
            error.push({
              code: data[i]['code'],
              name: data[i]['name'],
              reason: customer.message
            })
          }
          Customers.push(customer);
        }

      }
    } else {
      for (let i in data) {
        let updateCustomer;
        let foundCustomer = await Customer.findOne(this.req, { code: data[i]['code'], type: type})
        let gender =  data[i].gender ? data[i].gender.charAt(0).toUpperCase() + data[i].gender.slice(1) : "";
 
        if(foundCustomer){
          if(foundCustomer.branchId == branchId){
            foundCustomers.push(foundCustomer)
            updateCustomer = await sails.helpers.customer.update(this.req, {
              id: foundCustomer.id,
              name: data[i].name,
              code: data[i].code,
              address: data[i].address,
              mobile: data[i].mobile,
              tel: data[i].mobile,
              email: data[i].email || "",
              gender: gender,
              type: type,
              birthday: new Date(data[i].birthday).getTime() || 0,
              notes: data[i].notes,
              maxDeptAmount: Number(data[i].maxDeptAmount) || 0,
              maxDeptDays: Number(data[i].maxDeptDays) || 0,
              taxCode: data[i].taxCode,
              updatedBy: this.req.loggedInUser.id,
              branchId
            })
          } else {
              error.push({
              code: data[i]['code'],
              name: data[i]['name'],
              reason: sails.__('Mã khách hàng đã tồn tại ở chi nhánh khác')
            })
          }
        }
        else {
          updateCustomer = await sails.helpers.customer.create(this.req, {
            name: data[i].name,
            code: data[i].code,
            address: data[i].address,
            mobile: data[i].mobile,
            tel: data[i].mobile,
            email: data[i].email || "",
            gender: gender,
            type: type,
            birthday: new Date(data[i].birthday).getTime() || 0,
            notes: data.notes,
            maxDeptAmount: Number(data[i].maxDeptAmount) || 0,
            maxDeptDays: Number(data[i].maxDeptDays) || 0,
            taxCode: data[i].taxCode,
            branchId,
            createdBy: this.req.loggedInUser.id,
            updatedBy: this.req.loggedInUser.id
          })
          
          if(!updateCustomer.status){
            error.push({
              code: data[i]['code'],
              name: data[i]['name'],
              reason: updateCustomer.message
            })
          }
        }
         if (updateCustomer) Customers.push(updateCustomer);
      }
    }
    let arrCreateCustomers = [];

    if (Customers.length){
      _.forEach(Customers, item => {
        if (item.status) arrCreateCustomers.push(item.data)
      })
    }
    
    
    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? sails.config.constant.ACTION_LOG_TYPE.IMPORT_CUSTOMER : sails.config.constant.ACTION_LOG_TYPE.IMPORT_SUPPLIER,
      action: sails.config.constant.ACTION.IMPORT,
      objectContentOld: foundCustomers.length ? foundCustomers : undefined,
      objectContentNew: arrCreateCustomers,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId
    })

    if (!createActionLog.status) {
      return createActionLog
    }
    
    return ({
      status: true,
      data: Customers,
      error: error
    });
  }
};
