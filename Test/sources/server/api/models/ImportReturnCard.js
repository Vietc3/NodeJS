/**
 * ImportReturnCard.js
 *
 * @description :: A model definition represents an import return.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const _ = require("lodash");
module.exports = {

  attributes: {
    code: { // Mã trả hàng nhập
      type: 'string',
      maxLength: 50,
      unique: true,
    },
    importReturnedAt: { // Ngày trả hàng hàng nhập
      type: 'number',
      example: 1502844074211,
      required: true
    },
    finalAmount: { // Tổng giá trị nhà cung cấp hay khách hàng cần trả
      type: 'number'
    },
    totalAmount: { // Tổng giá trị tiền hàng
      type: 'number'
    },
    notes: { // Ghi chú
      type: 'string',
      maxLength: 250,
    },
    status: { // Tình trạng phiếu tạm hoặc hoàn thành
      type: 'number',
      required: true,
    },
    customerId: { // Nhà cung cấp
      model: 'Customer'
    },
    paidAmount: { //Tổng tiền khách đã trả
      type: 'number'
    },
    debtAmount: { // Tổng tiền khách còn nợ
      type: 'number'
    },
    deletedAt: { // Ngày xóa
      type: 'number',
      example: 1502844074211
    },
    
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },
    importReturnCardProducts: {
      collection: 'ImportReturnCardProduct',
      via: 'importReturnCardId'
    }
  },
  multitenant: true,

  createImportReturnCard: async function (
    code,
    importReturnedAt,
    totalAmount,
    finalAmount,
    notes,
    status,
    customerId,
    products,
    createdBy,
    error
  ) {

    //tạo thông tin phiếu trả hàng nhập
    var result = {
      newImportReturnCardRecord: await ImportReturnCard.create({
        code,
        importReturnedAt,
        totalAmount,
        finalAmount,
        notes,
        status,
        customerId,
        createdBy: createdBy,
        updatedBy: createdBy
      }).intercept('E_UNIQUE', () => {
        return error("Phiếu trả hàng nhập đã tồn tại");
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch()
    }

    //cập nhật mã phiếu tự động
    let updateCode;
    if (!code)
      updateCode = await ImportReturnCard.updateOne(result.newImportReturnCardRecord.id).set({
        code: sails.config.cardcode.importReturnFirstCode + result.newImportReturnCardRecord.id
      })

    //tạo sản phẩm trong bảng ImportReturnCardProduct
    for (let index in products) {
      var newImportReturnCardProductRecord = await ImportReturnCardProduct.create({
        productCode: products[index].productCode,
        productName: products[index].productName,
        quantity: products[index].quantity,
        returnUnitPrice: products[index].returnUnitPrice,
        discount: products[index].discount,
        taxAmount: products[index].taxAmount,
        finalAmount: products[index].finalAmount,
        notes: products[index].notes,
        importReturnCardId: result.newImportReturnCardRecord.id,
        productId: products[index].productId,
        createdBy: createdBy,
        updatedBy: createdBy
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch();
      await ImportReturnCard.addToCollection(result.newImportReturnCardRecord.id, 'importReturnCardProducts').members([
        newImportReturnCardProductRecord.id
      ]);

      //trong trường hợp phiếu hoàn thành, cập nhật giá vốn và tồn kho của sản phẩm
      if (status == sails.config.constant.finish) {
        let foundProduct = await Product.updateStockUnitPrice(
          products[index].productId, 
          products[index].quantity, 
          products[index].finalAmount, 
          errorCreate => {return error(errorCreate)}
        );
      }
    }

    //trong trường hợp phiếu hoàn thành
    if (status == sails.config.constant.finish) {
      //tạo phiếu xuất kho
      var newExportCardRecord = await ExportCard.createExportCard(
        '',
        result.newImportReturnCardRecord.createdAt,
        totalAmount,
        0,
        0,
        finalAmount,
        sails.config.constant.autoExportCreateImportReturn + (code ? code : updateCode.code),
        sails.config.constant.finish,
        customerId,
        products,
        createdBy,
        sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER,
        '',
        errorCreate => {return error(errorCreate)}
      );

      //tạo công nợ cho nhà cung cấp, phiếu thu, sổ quỹ
      let codeCard = code ? code : updateCode.code;
      let idCard = result.newImportReturnCardRecord.id;
      await sails.helpers.createDebtCashbookIncomeExpense(codeCard, idCard, finalAmount, customerId, createdBy, sails.config.constant.importReturn)
        .catch(errorCreate => { 
          return error(errorCreate.raw) 
        });
    }
    result.importReturnCardProductArray = await ImportReturnCardProduct.find({ importReturnCardId: result.newImportReturnCardRecord.id });
    return result;
  },

  deleteImportReturnCard : async function (id, deletedBy, error) {
    let foundImportReturnCard = await ImportReturnCard.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error('Thông tin phiếu xuất bị thiếu hoặc không hợp lệ');
    });

    if (!foundImportReturnCard) {
      return error('Phiếu xuất không tồn tại trong hệ thống');
    }

    var updateImportReturnCard = await ImportReturnCard.updateOne({ id: id }).set({
      deletedAt: new Date().getTime(),
      updatedBy: deletedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error('Thông tin phiếu xuất bị thiếu hoặc không hợp lệ');
    });

    var importReturnCardProductArray = await ImportReturnCardProduct.find({ importReturnCardId: id });
    let idArray = [];
    for (let index in importReturnCardProductArray) {
      idArray.push(importReturnCardProductArray[index].id);
      if (foundImportReturnCard.status == sails.config.constant.finish) {
        let foundProduct = await Product.updateQuantity(
          importReturnCardProductArray[index].productId, 
          importReturnCardProductArray[index].quantity, 
          0, // SL sản xuất
          errorCreate => {return error(errorCreate)},
        );
      }
    }

    await ImportReturnCardProduct.destroy({
      id: { in: idArray }
    });
    return updateImportReturnCard;
  },

  deleteImportReturnCards: async function (ids, deletedBy, error) {
    if (!ids || !Array.isArray(ids) || !ids.length) {
      return error("Thông tin không hợp lệ");
    }
    
    //xóa thông tin phiếu trả hàng nhập
    let deletedImportReturnCards = await ImportReturnCard.update({ id: { in: ids } }).set({
      deletedAt: new Date().getTime(),
      updatedBy: deletedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    }).fetch();

    //xóa sản phẩm liên quan tới phiếu trong bảng ImportReturnCardProduct
    for (let id of ids) {
      let importReturnCardProductArray = await ImportReturnCardProduct.find({ importReturnCardId: id });
      let idArray = [];
      let importReturnCard = await ImportReturnCard.findOne({ id: id });

      for (let index in importReturnCardProductArray) {

        if (importReturnCard ) {
          idArray.push(importReturnCardProductArray[index].id);

          if (importReturnCard.status == sails.config.constant.finish) {
            let foundProduct = await Product.updateQuantity(
              importReturnCardProductArray[index].productId, 
              importReturnCardProductArray[index].quantity, 
              0, // SL sản xuất
              errorCreate => {return error(errorCreate)},
            );
          }
        }

        await ImportReturnCardProduct.destroy({
          id: { in: idArray }
        });
      }
    }
    return deletedImportReturnCards;
  },

  getImportReturnCard: async function (createdBy, error) {
    let result = {
      foundImportReturnCard: await ImportReturnCard.findOne({
        where: { id: createdBy }
      }).populate("customerId")
        .intercept({ name: 'UsageError' }, () => {
          return error("Thông tin không hợp lệ");
        })
    }

    if (!result.foundImportReturnCard) {
      return error("Không tìm thấy phiếu trả hàng nhập");
    }
    result.importReturnCardProductArray = await ImportReturnCardProduct.find({ importReturnCardId: result.foundImportReturnCard.id })
      .populate("productId");
    return result;
  },

  getImportReturnCards: async function (filter, sort, limit, skip, manualFilter, manualSort, error) {
    filter = _.extend(filter || {}, { deletedAt: 0 });

    let foundImportReturnCards = await ImportReturnCard.find({
      where: filter,
      sort: sort || 'importReturnedAt DESC',
    }).populate("importReturnCardProducts")
      .populate("customerId")
      .intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      });

    foundImportReturnCards = sails.helpers.manualSortFilter(foundImportReturnCards, manualFilter, manualSort);
    return foundImportReturnCards;
  },

  updateImportReturnCard: async function (
    id,
    code,
    importReturnedAt,
    totalAmount,
    finalAmount,
    notes,
    status,
    customerId,
    products,
    updatedBy,
    error
  ) {
    let foundImportReturnCard = await ImportReturnCard.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    });

    if (!foundImportReturnCard) {
      return error("Không tìm thấy phiếu trả hàng nhập");
    }

    //cập nhật thông tin phiếu trả hàng nhập
    var updatedImportReturnCard = await ImportReturnCard.updateOne({ id: id }).set({
      code: code,
      importReturnedAt: importReturnedAt,
      totalAmount: totalAmount,
      finalAmount: finalAmount,
      notes: notes,
      status: status,
      customerId: customerId,
      products: products,
      updatedBy: updatedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    });

    //trong trường hợp cập nhật từ phiếu tạm sang hoàn thành
    if (foundImportReturnCard.status == sails.config.constant.tempCard && status == sails.config.constant.finish) {
      // tạo phiếu xuất kho
      var newExportCardRecord = await ExportCard.createExportCard(
        '',
        updatedImportReturnCard.createdAt,
        totalAmount,
        0,
        0,
        finalAmount,
        sails.config.constant.autoExportUpdateImportReturn + code,
        sails.config.constant.finish,
        customerId,
        products,
        updatedBy,
        sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER,
        '',
        errorCreate => {return error(errorCreate)}
      );

      //cập nhật giá vốn và tồn kho của sản phẩm
      for (let index in products) {
        let foundProduct = await Product.updateStockUnitPrice(
          products[index].productId, 
          products[index].quantity, 
          products[index].finalAmount, 
          errorCreate => {return error(errorCreate)}
        );
      }

      //tạo công nợ cho nhà cung cấp, phiếu thu, sổ quỹ
      await sails.helpers.createDebtCashbookIncomeExpense(code, id, finalAmount, customerId, updatedBy, sails.config.constant.importReturn)
        .catch(errorCreate => { 
          return error(errorCreate.raw) 
        });
    }

    //xóa các sản phẩm liên quan đến phiếu cũ trong bảng ImportReturnCardProduct
    var importReturnCardProductArray = await ImportReturnCardProduct.find({ importReturnCardId: id });
    let idArray = [];
    for (let index in importReturnCardProductArray) {
      idArray.push(importReturnCardProductArray[index].id)
    }
    await ImportReturnCardProduct.destroy({
      id: { in: idArray }
    });

    //tạo sản phẩm trong bảng ImportReturnCardProduct
    for (let index in products) {
      let newImportReturnCardProduct = await ImportReturnCardProduct.create({
        productCode: products[index].productCode,
        productName: products[index].productName,
        quantity: products[index].quantity,
        returnUnitPrice: products[index].returnUnitPrice,
        discount: products[index].discount,
        taxAmount: products[index].taxAmount,
        finalAmount: products[index].finalAmount,
        notes: products[index].notes,
        importReturnCardId: id,
        productId: products[index].productId,
        createdBy: updatedBy,
        updatedBy: updatedBy
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch();

      await ImportReturnCard.addToCollection(id, 'importReturnCardProducts').members([
        newImportReturnCardProduct.id
      ]);
    }

    return updatedImportReturnCard;
  }

};

