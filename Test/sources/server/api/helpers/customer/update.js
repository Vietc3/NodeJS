module.exports = {
  description: 'update customer',

  inputs: {
    req: {
      type: "ref",
    },
    data: {
      type: "ref",
      required: true
    },
  },

  fn: async function (inputs, exits) {
    let {
      id,
      name,
      code,
      address,
      tel,
      mobile,
      email,
      gender,
      birthday,
      notes,
      maxDeptAmount,
      maxDeptDays,
      taxCode,
      province,
      district,
      commune,
      type,
      branchId,
      updatedBy,
      isActionLog
    } = inputs.data;
    let { req } = inputs;
    let foundCustomer = await Customer.findOne(req, {id: id, branchId});

    if (!foundCustomer) {
      return exits.success({ status: false, message: sails.__(type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? "Khách hàng không tồn tại" : "NCC không tồn tại") });
    }

    //kiểm tra mã khách có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      if(foundCustomer.code !== code ){
          let checkExistPrefix = sails.helpers.common.checkPrefixCode((type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER) ? sails.config.cardcode.customerFirstCode : sails.config.cardcode.providerFirstCode, code);
          if(!checkExistPrefix.status){
            return exits.success(checkExistPrefix);
        }
      }
    } 
    else {
      code = (type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER) ? sails.config.cardcode.customerFirstCode + id : sails.config.cardcode.providerFirstCode + id;
    }

    var updatedCustomer = await Customer.update(req, { id: foundCustomer.id }).set({
      name: name.trim(),
      code: code,
      address: address,
      tel: tel,
      mobile: mobile,
      email: email,
      gender: gender,
      birthday: birthday,
      notes: notes,
      maxDeptAmount: maxDeptAmount,
      maxDeptDays: maxDeptDays,
      taxCode: taxCode,
      province: province,
      district: district,
      commune: commune,
      updatedBy: updatedBy,
      branchId:  branchId,
      deletedAt: 0,
    }).intercept('E_UNIQUE', () => {
      return exits.success({ status: false, message: sails.__('Mã khách hàng đã tồn tại') });
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__('Thông tin yêu cầu không hợp lệ') });
    }).fetch();

    if (isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? sails.config.constant.ACTION_LOG_TYPE.CUSTOMER : sails.config.constant.ACTION_LOG_TYPE.SUPPLIER,
        action: sails.config.constant.ACTION.UPDATE,
        objectId: updatedCustomer[0].id,
        objectContentOld: foundCustomer,
        objectContentNew: updatedCustomer[0],
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({ status: true, data: updatedCustomer[0] })
  }

}