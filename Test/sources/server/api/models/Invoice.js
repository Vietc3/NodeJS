/**
 * Invoice.js
 *
 * @description :: A model definition represents an invoice card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const _ = require("lodash");
module.exports = {

  attributes: {
    code: {
      type: 'string',
      maxLength: 50,
      unique: true
    },
    totalAmount: {
      type: 'number'
    },
    discountAmount: {
      type: 'number'
    },
    taxAmount: {
      type: 'number'
    },
    finalAmount: {
      type: 'number'
    },
    deliveryAmount: {
      type: 'number'
    },
    deliveryAddress: {
      type: 'string',
    },
    deliveryType: {  // 1: nhận tại cửa hàng, 2: giao hàng tận nơi, 3: khác
      type: 'number',
    },
    status: {
      type: 'number',
      required: true,
    },
    customerId: {
      model: 'Customer'
    },
    paidAmount: { //Tổng tiền khách đã trả
      type: 'number'
    },
    debtAmount: { // Tổng tiền khách còn nợ
      type: 'number'
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    invoiceAt: {
      type: 'number',
      example: 1502844074211
    },

    
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },
    branchId: { // Chi nhánh
      model: 'Branch'
    },
    

    invoiceProducts: {
      collection: 'InvoiceProduct',
      via: 'invoiceId'
    }
  },
  multitenant: true,

  //method
  createInvoice: async function (
    code,
    totalAmount,
    discountAmount,
    taxAmount,
    deliveryAmount,
    finalAmount,
    notes,
    deliveryAddress,
    customerId,
    status,
    products,
    payType,
    deliveryType,
    paidAmount,
    debtAmount,
    createdBy,
    error,
  ) {
    
    //tạo thông tin đơn hàng
    var newInvoiceRecord = await Invoice.create({
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      deliveryAddress,
      customerId: customerId || undefined,
      status,
      payType,
      deliveryType,
      paidAmount,
      debtAmount,
      createdBy: createdBy,
      updatedBy: createdBy
    }).intercept('E_UNIQUE', () => {
      return error("Đơn hàng đã tồn tại");
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    }).fetch();

    //cập nhật mã đơn hàng tự động
    let updateCodeInvoice;
    if (!code) {
      updateCodeInvoice = await Invoice.updateOne({ id: newInvoiceRecord.id }).set({
        code: sails.config.cardcode.invoiceFirstCode + newInvoiceRecord.id
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      });
    }

    //trong trường hợp đơn hoàn thành
    if (status == sails.config.constant.finish) {
      //tạo phiếu xuất kho
      var newExportCardRecord = await ExportCard.createExportCard(
        '',
        newInvoiceRecord.createdAt,
        totalAmount,
        discountAmount,
        taxAmount,
        finalAmount,
        sails.config.constant.autoCheckStockCreateInvoice + (code ? code : updateCodeInvoice.code),
        sails.config.constant.finish,
        customerId,
        products,
        createdBy,
        sails.config.constant.EXPORT_CARD_REASON.SALE,
        '',
        errorCreate => { return error(errorCreate) }        
      );

      let foundCustomer = await Customer.findOne({
        where: { id: customerId }
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      });

      let codeCard = code ? code : updateCodeInvoice.code;
      let idCard = newInvoiceRecord.id;

      //tạo công nợ cho khách hàng, phiếu thu, sổ quỹ
      await sails.helpers.createDebtCashbookIncomeExpense(codeCard, idCard, finalAmount, customerId, createdBy, sails.config.constant.invoice, paidAmount, debtAmount)
        .catch(errorCreate => {
          return error(errorCreate.raw)
        });

    }

    //tạo sản phẩm trong bảng InvoiceProduct
    for (let index in products) {
      var newInvoiceProduct = await InvoiceProduct.create({
        productCode: products[index].productCode,
        productName: products[index].productName,
        quantity: products[index].quantity,
        discount: products[index].discount,
        discountType: products[index].discountType,
        unitPrice: products[index].unitPrice,
        taxAmount: products[index].taxAmount,
        finalAmount: products[index].finalAmount,
        notes: products[index].notes,
        invoiceId: newInvoiceRecord.id,
        productId: products[index].productId,
        createdBy: createdBy,
        updatedBy: createdBy
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch();
      await Invoice.addToCollection(newInvoiceRecord.id, 'invoiceProducts').members([
        newInvoiceProduct.id
      ]);
    }
    var invoiceProductArray = await InvoiceProduct.find({ invoiceId: newInvoiceRecord.id });
    newInvoiceRecord.products = invoiceProductArray;

    return newInvoiceRecord;
  },

  deleteInvoice: async function (id, deletedBy, error) {
    let foundInvoice = await Invoice.findOne({
      where: {
        id: id,
        status: sails.config.constant.tempCard,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error('Thông tin đơn hàng bị thiếu hoặc không hợp lệ')
    });

    if (!foundInvoice) {
      return error('Đơn hàng không tồn tại trong hệ thống')
    }

    var updateInvoice = await Invoice.updateOne({ id: id }).set({
      deletedAt: new Date().getTime(),
      updatedBy: deletedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error('Thông tin đơn hàng bị thiếu hoặc không hợp lệ')
    });

    var invoiceProductArray = await InvoiceProduct.find({ invoiceId: id });
    for (let index in invoiceProductArray) {
      await InvoiceProduct.destroy({
        id: invoiceProductArray[index].id
      });

      let foundProduct = await Product.updateQuantity(
        invoiceProductArray[index].productId,
        invoiceProductArray[index].quantity, 
        0, // SL sản xuất
        errorCreate => { return error(errorCreate) },
      );
    }
    return updateInvoice;
  },

  deleteInvoices: async function (ids, deletedBy, error) {
    if (!ids || !Array.isArray(ids) || !ids.length) {
      return error("Thông tin không hợp lệ");
    }
    //xóa thông tin đơn hàng
    let deletedInvoices = await Invoice.update({ id: { in: ids } }).set({
      deletedAt: new Date().getTime(),
      updatedBy: deletedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    }).fetch();

    //xóa sản phẩm liên quan đến đơn hàng trong bảng InvoiceProduct
    for (let id of ids) {
      let foundInvoice = await Invoice.findOne({ id: id });
      let invoiceProductArray = await InvoiceProduct.find({ invoiceId: id });

      for (let index in invoiceProductArray) {
        await InvoiceProduct.destroy({
          id: invoiceProductArray[index].id
        });

        if (foundInvoice.status == sails.config.constant.finish) {
          let foundProduct = await Product.updateQuantity(
            invoiceProductArray[index].productId,
            invoiceProductArray[index].quantity,
            0, // SL sản xuất
            errorCreate => { return error(errorCreate) },
          );
        }
      }
    }
    return deletedInvoices;
  },

  getInvoice: async function (id, error) {
    let result = {
      foundInvoice: await Invoice.findOne({
        where: { id: id }
      }).populate("customerId")
        .intercept({ name: 'UsageError' }, () => {
          return error("Thông tin không hợp lệ");
        })
    }
    let createdBy = await User.findOne({
      where: { id: result.foundInvoice.createdBy },
      select: ["id", "fullName"]
    })

    if (createdBy) result.foundInvoice.createdBy = createdBy;
    if (!result.foundInvoice) {
      return error("Không tìm thấy đơn hàng");
    }
    result.invoiceProductArray = await InvoiceProduct.find({ invoiceId: result.foundInvoice.id }).populate("productId");
    return result;
  },

  getInvoices: async function (filter, sort, limit, skip, manualFilter, manualSort, error) {
    filter = _.extend(filter || {}, { deletedAt: 0 });

    let foundInvoices = await Invoice.find({
      where: filter,
      sort: sort || 'createdAt DESC',
    }).populate("customerId")
      .intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      });

    foundInvoices = sails.helpers.manualSortFilter(foundInvoices, manualFilter, manualSort);
    return foundInvoices;
  },

  updateInvoice: async function (
    id,
    code,
    totalAmount,
    discountAmount,
    taxAmount,
    deliveryAmount,
    finalAmount,
    notes,
    deliveryAddress,
    customerId,
    status,
    products,
    payType,
    deliveryType,
    paidAmount,
    debtAmount,
    updatedBy,
    error) {
    let foundInvoice = await Invoice.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    });

    if (!foundInvoice) {
      return error("Không tìm thấy đơn hàng");
    }

    //cập nhật thông tin đơn hàng
    var updatedInvoice = await Invoice.updateOne({ id: id }).set({
      code: code,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      deliveryAmount: deliveryAmount,
      finalAmount: finalAmount,
      notes: notes,
      deliveryAddress: deliveryAddress,
      customerId: customerId,
      status: status,
      products: products,
      payType,
      deliveryType,
      paidAmount,
      debtAmount,
      updatedBy: updatedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    });

    //trong trường hợp cập nhật từ phiếu tạm sang hoàn thành
    if (foundInvoice.status == sails.config.constant.tempCard && status == sails.config.constant.finish) {
      //tạo phiếu xuất kho

      var newExportCardRecord = await ExportCard.createExportCard(
        '',
        updatedInvoice.createdAt,
        totalAmount,
        discountAmount,
        taxAmount,
        finalAmount,
        sails.config.constant.autoCheckStockCreateInvoice + code,
        sails.config.constant.finish,
        customerId,
        products,
        updatedBy,
        sails.config.constant.EXPORT_CARD_REASON.SALE,
        '',
        errorCreate => { return error(errorCreate) }
      )

      //tạo công nợ cho khách hàng, phiếu thu, sổ quỹ
      await sails.helpers.createDebtCashbookIncomeExpense(code, id, finalAmount, customerId, updatedBy, sails.config.constant.invoice, paidAmount, debtAmount)
        .catch(errorCreate => {
          return error(errorCreate.raw)
        });
    }

    //xóa các sản phẩm liên quan đến đơn hàng cũ trong bảng InvoiceProduct
    var invoiceProductArray = await InvoiceProduct.find({ invoiceId: id });
    let idArray = [];
    for (let index in invoiceProductArray) {
      idArray.push(invoiceProductArray[index].id)
    }
    await InvoiceProduct.destroy({
      id: { in: idArray }
    });

    //tạo các sản phẩm trong bảng InvoiceProduct
    for (let index in products) {
      let newInvoiceProduct = await InvoiceProduct.create({
        productCode: products[index].productCode,
        productName: products[index].productName,
        quantity: products[index].quantity,
        unitPrice: products[index].unitPrice,
        discount: products[index].discount,
        discountType: products[index].discountType,
        taxAmount: products[index].taxAmount,
        finalAmount: products[index].finalAmount,
        notes: products[index].notes,
        invoiceId: id,
        productId: products[index].productId,
        createdBy: updatedBy,
        updatedBy: updatedBy
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch();
      await Invoice.addToCollection(id, 'invoiceProducts').members([
        newInvoiceProduct.id
      ]);
    }
    return updatedInvoice;
  }
};

