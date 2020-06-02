module.exports = {
  description: 'get income card',
  
  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: 'ref',
      required: true,
    },
  },

  fn: async function (inputs, exits) {
    let {id, branchId} = inputs.data;
    let req = inputs.req;
    

    let foundIncomeExpenseCard = await IncomeExpenseCard.findOne(req, {
      where: { id, type: sails.config.constant.INCOME_EXPENSE_TYPES.INCOME }
    }).populate("incomeExpenseCardTypeId")      
      .intercept({ name: "UsageError" }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });

    if (!foundIncomeExpenseCard) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_INCOME), isBranchId: true});
    }

    if (branchId) {
      if (+branchId !== foundIncomeExpenseCard.branchId)
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_INCOME)});
    }
    else {
      let checkBanch = await sails.helpers.checkBranch(foundIncomeExpenseCard.branchId, req);

      if(!checkBanch){
        return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
      }
    }

    let createdBy = await User.findOne(req, {
      where: { id: foundIncomeExpenseCard.createdBy },
      select: ["id", "fullName"]
    })

    if (createdBy) foundIncomeExpenseCard.createdBy = createdBy;
    
    // Tìm những thông tin đơn hàng được thanh toán bằng phiếu thu này
    let foundIncomeExpenseCardDetail = await IncomeExpenseCardDetail.find(req, {
      where: { incomeExpenseCardId: id, deletedAt: 0 }
    }).intercept({ name: "UsageError" }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
    
    // Tìm thông tin đơn hàng liên quan
    if(foundIncomeExpenseCardDetail && foundIncomeExpenseCardDetail.length) {
      let getModelByIncomeType = await sails.helpers.income.getModelByIncomeType(req, {incomeCardTypeId: foundIncomeExpenseCard.incomeExpenseCardTypeId.id});
      let {paymentModel, modelHelper} = getModelByIncomeType.data;
      
      if(paymentModel) {
        let promises = [];
        for(let item of foundIncomeExpenseCardDetail) {
          let {paidCardId} = item;
          promises.push(paymentModel.findOne(req, {
            id: paidCardId
          }));
        }
        
        let foundRelatedCards = await Promise.all(promises);
        foundIncomeExpenseCardDetail = foundIncomeExpenseCardDetail.map((item, index) => ({...item, paidCardId: foundRelatedCards[index]}))
      }
    }
    
    return exits.success({status: true, data: {foundIncomeExpenseCard, foundIncomeExpenseCardDetail}});
  }

}