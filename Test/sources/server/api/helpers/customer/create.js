module.exports = {
  description: 'create customer',

  inputs: {
    req: {
      type: "ref",
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let {
      name,
      code,
      address,
      tel,
      mobile,
      email,
      gender,
      type,
      birthday,
      notes,
      maxDeptAmount,
      maxDeptDays,
      taxCode,
      province,
      district,
      commune,
      branchId,
      createdBy,
      updatedBy, 
      isActionLog
    } = inputs.data;
    let { req } = inputs;
    //kiểm tra mã khách có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode((type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER) ? sails.config.cardcode.customerFirstCode : sails.config.cardcode.providerFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    let newCustomerRecord = await Customer.create(req, {
      name: name.trim(),
      code: code || new Date().getTime() ,
      type: type,
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
      branchId: branchId,
      createdBy: createdBy,
      updatedBy: updatedBy
    }).intercept('E_UNIQUE', () => {
      return exits.success({ status: false, message: sails.__('Mã khách hàng đã tồn tại') });
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__('Thông tin khách hàng bị thiếu hoặc không hợp lệ') });
    }).fetch();

    if (!code) {
      newCustomerRecord = await Customer.update(req, { id: newCustomerRecord.id }).set({
        code: (type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER) ? sails.config.cardcode.customerFirstCode + newCustomerRecord.id : sails.config.cardcode.providerFirstCode + newCustomerRecord.id
      })
        .intercept({ name: 'UsageError' }, () => {
          return exits.success({ status: false, message: sails.__('Thông tin yêu cầu không hợp lệ') });
        }).fetch();
        
      newCustomerRecord = newCustomerRecord[0];
    }

    if (isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? sails.config.constant.ACTION_LOG_TYPE.CUSTOMER : sails.config.constant.ACTION_LOG_TYPE.SUPPLIER,
        action: sails.config.constant.ACTION.CREATE,
        objectId: newCustomerRecord.id,
        objectContentNew: newCustomerRecord,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({ status: true, data: newCustomerRecord })
  }

}