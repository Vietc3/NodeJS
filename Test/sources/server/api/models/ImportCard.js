/**
 * ImportCard.js
 *
 * @description :: A model definition represents an import card.
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
    status: {
      type: 'number',
      required: true,
    },
    importedAt : {
      type: 'number',
      example: 1502844074211
    },
    paidAmount: { //Tổng tiền đã trả
      type: 'number'
    },
    debtAmount: { // Tổng tiền còn nợ
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
    reason: { 
      type: 'number',
      required: true,
    },
    recipientId: {
      model: 'Customer'
    },
    reference: {
      type: 'string',
      maxLength: 150,
    },
    branchId: { // Chi nhánh
      model: 'Branch'
    },
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },
    importCardProducts: {
      collection: 'ImportCardProduct',
      via: 'importCardId'
    }
  },
  multitenant: true,

  createImportCard: async function (
    code,
    importedAt,
    totalAmount,
    discountAmount,
    taxAmount,
    deliveryAmount,
    finalAmount,
    notes,
    deliveryAddress,
    status,
    recipientId,
    products,
    createdBy,
    reason,
    reference,
    error
  ) {
    //tạo thông tin phiếu nhập
    var result = {
      newImportCardRecord: await ImportCard.create({
        code,
        importedAt,
        totalAmount,
        discountAmount,
        taxAmount,
        deliveryAmount,
        finalAmount,
        notes,
        deliveryAddress,
        status,
        reason,
        recipientId,
        createdBy: createdBy,
        updatedBy: createdBy,
        reference
      }).intercept('E_UNIQUE', () => {
        return error('Phiếu nhập đã tồn tại');
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch()
    }
    
    //cập nhật mã phiếu nhập tự động
    let updateCodeImport;
    if (!code)
      updateCodeImport = await ImportCard.updateOne(result.newImportCardRecord.id).set({
        code: sails.config.cardcode.importCardFirstCode + result.newImportCardRecord.id
      })

    //tạo sản phẩm trong bảng ImportCardProduct
    for (let index in products) {
      var newImportCardProduct = await ImportCardProduct.create({
        productCode: products[index].productCode,
        productName: products[index].productName,
        quantity: products[index].quantity,
        unitPrice: products[index].unitPrice,
        discount: products[index].discount,
        taxAmount: products[index].taxAmount,
        finalAmount: products[index].finalAmount,
        notes: products[index].notes,
        importCardId: result.newImportCardRecord.id,
        productId: products[index].productId,
        createdBy: createdBy,
        updatedBy: createdBy
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch();
      await ImportCard.addToCollection(result.newImportCardRecord.id, 'importCardProducts').members([
        newImportCardProduct.id
      ]);

      //trong trường hợp phiếu hoàn thành, cập nhật giá vốn và tồn kho của sản phẩm
      if (status == sails.config.constant.finish && reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ) {
        let foundProduct = await Product.updateQuantity(
          products[index].productId, 
          products[index].quantity,//số lượng tồn kho
          reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ? -Number(products[index].quantity) : 0,// số lượng sản xuất
          errorCreate => {return error(errorCreate)},
        );
      } else if ( status == sails.config.constant.finish ){
        let foundProduct = await Product.updateStockUnitPrice(
          products[index].productId, 
          products[index].quantity, 
          products[index].finalAmount, 
          errorCreate => {return error(errorCreate)},
          sails.config.constant.import
        );
      }
    }

    //trong trường hợp phiếu hoàn thành, tạo công nợ cho khách hàng, phiếu chi, sổ quỹ
    if (status == sails.config.constant.finish) {
      let codeCard = code ? code : updateCodeImport.code;
      let idCard = result.newImportCardRecord.id;
      await sails.helpers.createDebtCashbookIncomeExpense(codeCard, idCard, -finalAmount, recipientId, createdBy, sails.config.constant.import)
        .catch(errorCreate => { 
          return error(errorCreate.raw) 
        });
    }

    result.importCardProductArray = await ImportCardProduct.find({ importCardId: result.newImportCardRecord.id });

    return result;
  },

  deleteImportCard : async function (id, deletedBy, error) {
    let foundImportCard = await ImportCard.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
        return error('Thông tin phiếu nhập bị thiếu hoặc không hợp lệ');
    });

    if (!foundImportCard) {
        return error('Phiếu nhập không tồn tại trong hệ thống');
    }
    if ( foundImportCard.reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ) {

    var updateImportCard = await ImportCard.updateOne({ id: id }).set({
      status: sails.config.constant.IMPORT_CARD_STATUS.CANCELED,
      updatedBy: deletedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error('Thông tin phiếu nhập bị thiếu hoặc không hợp lệ');
    });

    var importCardProductArray = await ImportCardProduct.find({ importCardId: id });

    let idArray = [];
    
    for (let index in importCardProductArray) {
      idArray.push(importCardProductArray[index].id);
      if (foundImportCard.status == sails.config.constant.IMPORT_CARD_STATUS.FINISHED) {
        let foundProduct = await Product.findOne({
          where: {
            id: importCardProductArray[index].productId,
            deletedAt: 0
          }
        }).intercept({ name: 'UsageError' }, () => {
          return error('Thông tin sản phẩm bị thiếu hoặc không hợp lệ');
        });

        if (!foundProduct) {
          return error('Sản phẩm không tồn tại trong hệ thống');
        }
        else {
          await Product.updateOne({ id: importCardProductArray[index].productId }).set({
            stockQuantity: foundProduct.stockQuantity - importCardProductArray[index].quantity,// SL tồn kho
            manufacturingQuantity: foundProduct.manufacturingQuantity + ( foundImportCard.reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT
              ? importCardProductArray[index].quantity : 0 ),//SL sản xuất 
            updatedBy: deletedBy
          }).intercept({ name: 'UsageError' }, () => {
            return error('Thông tin yêu cầu không hợp lệ');
          });
        }
      }
    }
    return updateImportCard;
    }
  },

  deleteImportCards: async function (ids, deletedBy, error) {
    if (!ids || !Array.isArray(ids) || !ids.length) {
      return error("Thông tin không hợp lệ");
    }

    //xóa phiếu nhập
    let deletedImportCards = await ImportCard.update({ id: { in: ids }}).set({
      deletedAt: new Date().getTime(),
      updatedBy: deletedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    }).fetch();

    //xóa sản phẩm liên quan đến phiếu nhập trong bảng ImportCardProduct
    for (let id of ids) {
      let importCardProductArray = await ImportCardProduct.find({ importCardId: id });
      let importCard = await ImportCard.findOne({ id: id });
      for (let index in importCardProductArray) {
        await ImportCardProduct.destroy({
          id: importCardProductArray[index].id
        });

        if (importCard.status == sails.config.constant.finish) {
          let foundProduct = await Product.updateQuantity(
            importCardProductArray[index].productId, 
            - importCardProductArray[index].quantity, 
            0,//SL sản xuất
            errorCreate => {return error(errorCreate)},
          );
        }
      }
    }
    return deletedImportCards;
  },

  getImportCard: async function (id, error) {
    let result = {
      foundImportCard: await ImportCard.findOne({
        where: { id: id }
      }).intercept({ name: 'UsageError' }, () => {
          return error("Thông tin không hợp lệ");
        })
    }

    if (!result.foundImportCard) {
      return error("Không tìm thấy phiếu nhập");
    }

    let customer = await Customer.findOne({ where: {id: result.foundImportCard.recipientId }})

    result.foundImportCard.customerId = customer;

    let userCreatedBy = await User.findOne({
      where: { id: result.foundImportCard.createdBy },
      select: ["id", "fullName"]
    })

    if ( userCreatedBy ) result.foundImportCard.userName = userCreatedBy.fullName

    result.importCardProductArray = await ImportCardProduct.find({ importCardId: result.foundImportCard.id })
      .populate("productId");

      let productUnit = await ProductUnit.find({ deletedAt: 0 })

    if ( productUnit ) {
      _.forEach(result.importCardProductArray, item => {
        _.forEach(productUnit, elem => {
          if ( item.productId.unitId && item.productId.unitId == elem.id ) {
            item.unit = elem.name;
            return;
          }
        })
      })
    }
    return result;
  },

  getImportCards: async function (filter, sort, limit, skip, manualFilter, manualSort, error) {
    filter = _.extend(filter || {}, { deletedAt: 0 });

    let foundImportCards = await ImportCard.find({
      where: filter,
      sort: sort || 'importedAt DESC',
    }).populate("importCardProducts")
      .intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      });
    
    let customers = await Customer.find({ where: { type: sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER }})

    _.forEach(foundImportCards, item => {
      _.forEach(customers, elem => {
        if ( item.recipientId == elem.id ) {
          item.customerId = elem;
          return;
        }
      })
    })

    foundImportCards = sails.helpers.manualSortFilter(foundImportCards, manualFilter, manualSort);

    let getUser = await User.find({
      select: ["id", "fullName"]
    })

    await _.forEach(foundImportCards, item => {
      _.forEach(getUser, elem => {
        if ( item.createdBy === elem.id ) {          
          item.userName = elem.fullName;
          return;
        }
      })
    })
    return foundImportCards;
  },

  updateImportCard: async function (
    id,
    code,
    importedAt,
    totalAmount,
    discountAmount,
    taxAmount,
    deliveryAmount,
    finalAmount,
    notes,
    deliveryAddress,
    status,
    recipientId,
    products,
    updatedBy,
    reason,
    reference,
    error
  ) {
    let foundImportCard = await ImportCard.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    });

    if (!foundImportCard) {
      return error("Không tìm thấy phiếu nhập");
    }

    //cập nhật thông tin phiếu nhập
    var updatedImportCard = await ImportCard.updateOne({ id: id }).set({
      code: code,
      importedAt: importedAt,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      deliveryAmount: deliveryAmount,
      finalAmount: finalAmount,
      notes: notes,
      deliveryAddress: deliveryAddress,
      status: status,
      reason,
      recipientId,
      reference,
      products: products,
      updatedBy: updatedBy,
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    });

    //trong trường hợp cập nhật từ phiếu tạm sang phiếu hoàn thành, cập nhật giá vốn và tồn kho cảu sản phẩm
    if ((foundImportCard.status == sails.config.constant.tempCard && status == sails.config.constant.finish)
    || reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ) {
      //update product
      for (let index in products) {
        let manufacturingQuantity = 0;
        let stockQuantity = 0;

        if ( reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ) {
          let oldProduct = await ImportCardProduct.findOne({ id: products[index].id })
          
          manufacturingQuantity = products[index].quantity >  oldProduct.quantity ? -(Number(products[index].quantity) - oldProduct.quantity)
            :  (oldProduct.quantity - Number(products[index].quantity))

          stockQuantity = products[index].quantity >  oldProduct.quantity ?  (Number(products[index].quantity) - oldProduct.quantity)
            : -(oldProduct.quantity - Number(products[index].quantity))
        }

        let foundProduct = await Product.updateQuantity(
          products[index].productId, 
          reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ? stockQuantity : products[index].quantity, // Số lượng tồn kho
          reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ? manufacturingQuantity : 0, // Số lượng sản xuất
          errorCreate => {return error(errorCreate)},
        );
      }
      if ( reason != sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT) {
        for (let index in products) {
          let foundProduct = await Product.updateStockUnitPrice(
            products[index].productId, 
            products[index].quantity, 
            products[index].finalAmount, 
            errorCreate => {return error(errorCreate)},
            sails.config.constant.import
          );
        }
        await sails.helpers.createDebtCashbookIncomeExpense(code, id, -finalAmount, recipientId, updatedBy, sails.config.constant.import)
          .catch(errorCreate => { 
            return error(errorCreate.raw) 
          });
      }
    }

    //xóa các sản phẩm liên quan đến phiếu nhập cũ trong bảng ImportCardProduct
    var importCardProductArray = await ImportCardProduct.find({ importCardId: id });
    let idArray = [];
    for (let index in importCardProductArray) {
      idArray.push(importCardProductArray[index].id)
    }
    await ImportCardProduct.destroy({
      id: { in: idArray }
    });

    //tạo các sản phẩm trong bảng ImportCardProduct
    for (let index in products) {
      let newImportCardProduct = await ImportCardProduct.create({
        productCode: products[index].productCode,
        productName: products[index].productName,
        quantity: products[index].quantity,
        unitPrice: products[index].unitPrice,
        discount: products[index].discount,
        taxAmount: products[index].taxAmount,
        finalAmount: products[index].finalAmount,
        notes: products[index].notes,
        importCardId: id,
        productId: products[index].productId,
        createdBy: updatedBy,
        updatedBy: updatedBy
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch();

      await ImportCard.addToCollection(id, 'importCardProducts').members([
        newImportCardProduct.id
      ]);
    }

    return updatedImportCard;
  }
};

