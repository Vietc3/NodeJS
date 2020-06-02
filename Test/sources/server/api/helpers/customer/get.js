module.exports = {
  description: 'Get customer info',

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
    let { id, type, branchId } = inputs.data;
    let { req } = inputs;

    let foundCustomer = await Customer.findOne(req, {
      where: {id, type}
    }).intercept({ name: 'UsageError' }, ()=>{
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    
    if (!foundCustomer) {
      return exits.success({status: false, message: sails.__('Khách hàng không tồn tại trong hệ thống')});
    }

    let checkBanch = await sails.helpers.checkBranch(foundCustomer.branchId, req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }


    //lấy danh sách mua hàng, nhập hàng
    let invoiceImportCards;
    if(type === sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER){
      invoiceImportCards = await sails.helpers.invoice.list(req, {
        filter: {
          customerId: id          
        },
        branchId
      })
    }

    else {
      invoiceImportCards = await sails.helpers.import.list(req, {
        filter: {
          recipientId: id,
          reason: sails.config.constant.EXPORT_CARD_REASON.IMPORT_PROVIDER
        },
        branchId
      })
    }

    if(!invoiceImportCards.status)
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});

    invoiceImportCards.data.map(item => {
      item.type = type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? 
        sails.config.constant.TRANSACTION_CARD_TYPE.INVOICE
        : sails.config.constant.TRANSACTION_CARD_TYPE.IMPORT
    })

    //lấy danh sách phiếu trả hàng, trả hàng nhập
    let returnCards;
    if(type === sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER){
      returnCards = await sails.helpers.invoiceReturn.list(req, {
        filter: {
          recipientId: id          
        },
        branchId
      })
    }

    else {
      returnCards = await sails.helpers.importReturnCard.list(req, {
        filter: {
          recipientId: id,
          reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER          
        },
        branchId
      })
    }

    if(!returnCards.status)
      return exits.success({status: false, message: sails.config.constant.INTERCEPT.UsageError});

    returnCards.data.map(item => {
      item.type = type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? 
        sails.config.constant.TRANSACTION_CARD_TYPE.INVOICE_RETURN
        : sails.config.constant.TRANSACTION_CARD_TYPE.IMPORT_RETURN
    })

    let cards = invoiceImportCards.data.concat(returnCards.data);
    cards.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    return exits.success({ status: true, data: {...foundCustomer, cards } });
  }

}