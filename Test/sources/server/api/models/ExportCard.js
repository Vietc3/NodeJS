/**
 * ExportCard.js
 *
 * @description :: A model definition represents an import return.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: { // Mã phiếu xu
      type: 'string',
      maxLength: 50,
      unique: true,
    },
    exportedAt: { // Ngày xuất hàng
      type: 'number',
      example: 1502844074211,
      required: true
    },
    finalAmount: { // Tổng giá trị nhà cung cấp hay khách hàng cần trả
      type: 'number'
    },
    discountAmount: { // Giảm giá
      type: 'number'
    },
    taxAmount: {
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
    reason: { // Lí do tạo phiếu: { 0: Bán hàng, 1: Sản xuất, 2: Trả hàng NCC } 
      type: 'number',
      required: true,
    },
    recipientId: { // Người nhận (nếu reason = 1 là user, 0 và 2 là khách hàng)
      type: 'number',
      required: true,
    },
    paidAmount: { //Tổng tiền đã trả
      type: 'number'
    },
    debtAmount: { // Tổng tiền còn nợ
      type: 'number'
    },
    reference: { // Tham chiếu
      type: 'string',
      maxLength: 150,
    },
    deletedAt: { // Ngày xóa
      type: 'number',
      example: 1502844074211
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
    exportCardProducts: {
      collection: 'ExportCardProduct',
      via: 'exportCardId'
    }
  },
  multitenant: true,

  createExportCard: async function (
    code,
    exportedAt,
    totalAmount,
    discountAmount,
    taxAmount,
    finalAmount,
    notes,
    status,
    recipientId,
    products,
    createdBy,    
    reason,
    reference,
    error
  ) {
    var result = {
      newExportCardRecord: await ExportCard.create({
        code,
        exportedAt,
        totalAmount,
        discountAmount,
        taxAmount,
        finalAmount,
        notes,
        status,
        recipientId,
        reason,
        createdBy: createdBy,
        updatedBy: createdBy,
        reference
      }).intercept('E_UNIQUE', () => {
        return error('Mã phiếu xuất đã tồn tại');
      }).intercept({ name: 'UsageError' }, () => {
        return error('Thông tin phiếu xuất bị thiếu hoặc không hợp lệ');
      }).fetch()
    }
    
    if (!code)
      await ExportCard.update(result.newExportCardRecord.id).set({
        code: sails.config.cardcode.exportCardFirstCode + result.newExportCardRecord.id
      }).fetch()

    for (let index in products) {
      var newExportCardProduct = await ExportCardProduct.create({
        productCode: products[index].productCode,
        productName: products[index].productName,
        quantity: products[index].quantity,
        unitPrice: products[index].unitPrice,
        discount: products[index].discount,
        taxAmount: products[index].taxAmount,
        finalAmount: products[index].finalAmount,
        notes: products[index].notes,
        exportCardId: result.newExportCardRecord.id,
        productId: products[index].productId,
        createdBy: createdBy,
        updatedBy: createdBy
      }).intercept({ name: 'UsageError' }, () => {
        return error('Thông tin sản phẩm trong phiếu xuất bị thiếu hoặc không hợp lệ');
      }).fetch();
      await ExportCard.addToCollection(result.newExportCardRecord.id, 'exportCardProducts').members([
        newExportCardProduct.id
      ]);

      if (status == sails.config.constant.EXPORT_CARD_STATUS.FINISHED) {
        let foundProduct = await Product.updateQuantity(
          products[index].productId, 
          - products[index].quantity,//số lượng tồn kho
          reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE ? Number(products[index].quantity) : 0,// số lượng sản xuất
          errorCreate => {return error(errorCreate)},
        );
      }
    }
    result.exportCardProductArray = await ExportCardProduct.find({ exportCardId: result.newExportCardRecord.id });
    return result;
  },

  deleteExportCards: async function (ids, deletedBy, error) {

    if (!ids || !Array.isArray(ids) || !ids.length) {
      return error('Thông tin yêu cầu không hợp lệ');
    }

    let deletedExportCards = await ExportCard.update({ id: { in: ids }, status: 1 }).set({
      deletedAt: new Date().getTime(),
      updatedBy: deletedBy
    }).intercept({ name: 'UsageError' }, () => {
      return error('Thông tin yêu cầu không hợp lệ');
    });

    for (let id of ids) {
      let exportCardProductArray = await ExportCardProduct.find({ exportCardId: id });
      let idArray = [];

      for (let index in exportCardProductArray) {
        let exportCard = await ExportCard.find({ id: id, status: 1 });

        if (exportCard && exportCard.status == sails.config.constant.tempCard) {
          idArray.push(exportCardProductArray[index].id);
        }

        await ExportCardProduct.destroy({
          id: { in: idArray }
        });
      }
    }
    return deletedExportCards;
  },

  deleteExportCard: async function (id, deletedBy, error) {
    let foundExportCard = await ExportCard.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error('Thông tin phiếu xuất bị thiếu hoặc không hợp lệ');
    });

    if (!foundExportCard) {
      return error('Phiếu xuất không tồn tại trong hệ thống');
    }
    if ( foundExportCard.reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE ) {

      let updateExportCard = await ExportCard.updateOne({ id: id }).set({
        status: sails.config.constant.EXPORT_CARD_STATUS.CANCELED,
        updatedBy: deletedBy
      }).intercept({ name: 'UsageError' }, () => {
        return error('Thông tin phiếu xuất bị thiếu hoặc không hợp lệ');
      });

      let exportCardProductArray = await ExportCardProduct.find({ exportCardId: id });

      let idArray = [];

      for (let index in exportCardProductArray) {
        idArray.push(exportCardProductArray[index].id);
        if (foundExportCard.status == sails.config.constant.EXPORT_CARD_STATUS.FINISHED) {
          let foundProduct = await Product.findOne({
            where: {
              id: exportCardProductArray[index].productId,
              deletedAt: 0
            }
          }).intercept({ name: 'UsageError' }, () => {
            return error('Thông tin sản phẩm bị thiếu hoặc không hợp lệ');
          });

          if (!foundProduct) {
            return error('Sản phẩm không tồn tại trong hệ thống');
          }
          else {
            await Product.updateOne({ id: exportCardProductArray[index].productId }).set({
              stockQuantity: foundProduct.stockQuantity + exportCardProductArray[index].quantity,// SL tồn kho
              manufacturingQuantity: foundProduct.manufacturingQuantity - ( foundExportCard.reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE
                ? exportCardProductArray[index].quantity : 0 ),//SL sản xuất 
              updatedBy: deletedBy
            }).intercept({ name: 'UsageError' }, () => {
              return error('Thông tin yêu cầu không hợp lệ');
            });
          }
        }
      }
      
      return updateExportCard;
    }
  },

  getExportCard: async function (id, error) {
    let result = {
      foundExportCard: await ExportCard.findOne({
        where: { id: id }
      }).intercept({ name: 'UsageError' }, () => {
          return error('Thông tin phiếu xuất bị thiếu hoặc không hợp lệ');
        })
    }

    if (!result.foundExportCard) {
      return error('Phiếu xuất không tồn tại trong hệ thống');
    }

    let userCreatedBy = await User.findOne({
      where: { id: result.foundExportCard.createdBy },
      select: ["id", "fullName"]
    })

    if ( userCreatedBy ) result.foundExportCard.userName = userCreatedBy.fullName

    result.exportCardProductArray = await ExportCardProduct.find({ exportCardId: result.foundExportCard.id }).populate("productId");

    let productUnit = await ProductUnit.find({ deletedAt: 0 })

    if ( productUnit ) {
      _.forEach(result.exportCardProductArray, item => {
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

  getExportCards: async function (filter, sort, limit, skip, manualFilter, manualSort, error) {
    filter = _.extend(filter || {}, { deletedAt: 0 });

    let foundExportCards = await ExportCard.find({
      where: filter,
      sort: sort || 'exportedAt DESC',
    }).populate("exportCardProducts")
      .intercept({ name: 'UsageError' }, () => {
        return error('Thông tin yêu cầu không hợp lệ');
      });
    
    let getUser = await User.find({
      select: ["id", "fullName"]
    })
    
    await _.forEach(foundExportCards, item => {
      _.forEach(getUser, elem => {
        if ( item.createdBy === elem.id ) {          
          item.userName = elem.fullName;
          return;
        }
      })
    })

    foundExportCards = sails.helpers.manualSortFilter(foundExportCards, manualFilter, manualSort);

    return foundExportCards;
  },

  updateExportCard: async function (
    id,
    code,
    exportedAt,
    totalAmount,
    discountAmount,
    taxAmount,
    finalAmount,
    notes,
    status,
    customerId,
    products,
    updatedBy,
    reason,
    reference,
    deleteProducts,
    error
  ) {
    let foundExportCard = await ExportCard.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error(sails.__('Thông tin phiếu nhập bị thiếu hoặc không hợp lệ'));
    });

    if (!foundExportCard) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Phiếu nhập không tồn tại trong hệ thống')
      });
      return;
    }

    var updatedExportCard = await ExportCard.updateOne({ id: id }).set({
      code: code,
      exportedAt: exportedAt,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      finalAmount: finalAmount,
      notes: notes,
      status: status,
      customerId: customerId,
      products: products,
      updatedBy: updatedBy,
      reference
    }).intercept({ name: 'UsageError' }, () => {
      return error(sails.__('Thông tin yêu cầu không hợp lệ'));
    });

    if ( ( foundExportCard.status == sails.config.constant.EXPORT_CARD_STATUS.TEMP && status == sails.config.constant.EXPORT_CARD_STATUS.FINISHED ) 
    || reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE ) {
      //update product
      for (let index in products) {
        let manufacturingQuantity = 0;
        let stockQuantity = 0;

        if ( reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE ) {
          if ( products[index].id ) {
            let oldProduct = await ExportCardProduct.findOne({ id: products[index].id })

            manufacturingQuantity = products[index].quantity >  oldProduct.quantity ? Number(products[index].quantity) - oldProduct.quantity
              : - (oldProduct.quantity - Number(products[index].quantity))

            stockQuantity = products[index].quantity >  oldProduct.quantity ? - (Number(products[index].quantity) - oldProduct.quantity)
              : oldProduct.quantity - Number(products[index].quantity)
          }
          else {
            manufacturingQuantity = products[index].quantity;
            stockQuantity = - products[index].quantity;
          }
        }

        let foundProduct = await Product.updateQuantity(
          products[index].productId, 
          reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE ? stockQuantity : - products[index].quantity, // Số lượng tồn kho
          reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE ? manufacturingQuantity : 0, // Số lượng sản xuất
          errorCreate => {return error(errorCreate)},
        );
      }
    }
    if ( deleteProducts ) {
      let exportProducts = await ExportCardProduct.find({id: { in: deleteProducts } })
                                                  .intercept(({ name: 'UsageError' }, () => {
                                                    return error(sails.__('Thông tin sản phẩm bị thiếu'))
                                                  }))
      
      if ( exportProducts ) {
        for (let item of exportProducts) {
          let foundProduct = await Product.updateQuantity(
            item.productId, 
            item.quantity, // Số lượng tồn kho
            - item.quantity, // Số lượng sản xuất
            errorCreate => {return error(errorCreate)},
          );
        }
      }

    }

    var exportCardProductArray = await ExportCardProduct.find({ exportCardId: id });
    let idArray = [];
    for (let index in exportCardProductArray) {
      idArray.push(exportCardProductArray[index].id)
    }
    await ExportCardProduct.destroy({
      id: { in: idArray }
    });

    for (let index in products) {
      let newExportCardProduct = await ExportCardProduct.create({
        productCode: products[index].productCode,
        productName: products[index].productName,
        quantity: products[index].quantity,
        unitPrice: products[index].unitPrice,
        discount: products[index].discount,
        taxAmount: products[index].taxAmount,
        finalAmount: products[index].finalAmount,
        notes: products[index].notes,
        exportCardId: id,
        productId: products[index].productId,
        createdBy: updatedBy,
        updatedBy: updatedBy
      }).intercept({ name: 'UsageError' }, () => {
        return error(sails.__('Thông tin sản phẩm trong phiếu nhập bị thiếu hoặc không hợp lệ'));
      }).fetch();

      await ExportCard.addToCollection(id, 'exportCardProducts').members([
        newExportCardProduct.id
      ]);
    }
    return updatedExportCard;
  }
};

