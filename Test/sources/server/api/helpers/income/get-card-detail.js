module.exports = {
  description: 'get card detail',

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
    let { cardId, incomeExpenseCardTypeCode } = inputs.data;
    let req = inputs.req;
    
    let foundIncomeExpenseCardType = await IncomeExpenseCardType.findOne(req, {code: incomeExpenseCardTypeCode});
    let incomeExpenseCardTypeId = foundIncomeExpenseCardType.id;
    
    // Tìm những thông tin đơn hàng được thanh toán bằng phiếu cần tìm
    let incomeExpenseCardDetail = await IncomeExpenseCardDetail.find(req, {
      where: { paidCardId: cardId, incomeExpenseCardTypeId, deletedAt: 0 }
    }).populate("incomeExpenseCardId")
    .intercept({ name: "UsageError" }, () => {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });

    incomeExpenseCardDetail = incomeExpenseCardDetail.map(item => {
      return ({
        ...item,
        incomeExpenseCardId: {
          id: item.incomeExpenseCardId.id,
          code: item.incomeExpenseCardId.code,
          status: item.incomeExpenseCardId.status,
          incomeExpenseAt: item.incomeExpenseCardId.incomeExpenseAt,
        }
      });
    })

    return exits.success({status: true, data: {incomeExpenseCardDetail}});
  }

}