/**
 * Product.js
 *
 * @description :: A model definition represents a product.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    code: {
      type: 'string',
      maxLength: 50,
			unique: true
    },
    description: {
      type: 'ref',
      columnType: 'longtext',
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    category: {
      type: 'number'
    },
    barCode: { // Mã vạch cho sản phẩm
      type: 'string',
      allowNull: true
    },
    stoppedAt: {
      type: 'number',
      example: 1502844074211
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    maxDiscount: {
      type: 'number'
    },
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },
    unitId: { // Đơn vị tính
      model: 'ProductUnit'
    },
    productTypeId: { // Nhóm sản phẩm
      model: 'ProductType'
    },
    customerId: { // Nhà cung cấp
      model: 'Customer'
    },
    type: {
      type: 'number',
    },
    productprices: {
      collection: 'ProductPrice',
      via: 'productId'
    },
    productstocks: {
      collection: 'ProductStock',
      via: 'productId'
    },
    fileStorage: {
      collection: 'FileStorage',
      via: 'productId'
    },
    importCardProducts: {
      collection: 'ImportCardProduct',
      via: 'productId'
    },
    exportCardProducts: {
      collection: 'ExportCardProduct',
      via: 'productId'
    },
    invoiceProducts: {
      collection: 'InvoiceProduct',
      via: 'productId'
    },
    stockCheckCardProducts: {
      collection: 'StockCheckCardProduct',
      via: 'productId'
    },
    moveStockCardProducts: {
      collection: 'MoveStockCardProduct',
      via: 'productId'
    }
  },
  multitenant: true,

  updateStockUnitPrice: async function (id, quantity, price, error, type){
    let foundProduct = await Product.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    });

    if (!foundProduct) {
      return error("Không tìm thấy sản phẩm");
    }
    else {
      let unitPrice, stockQuantity;
      if(type == sails.config.constant.import){
        if(foundProduct.stockQuantity < 0){
          unitPrice = products[index].finalAmount;
        }
        unitPrice = Number((foundProduct.costUnitPrice * foundProduct.stockQuantity
          + price * quantity)
          / (foundProduct.stockQuantity + quantity)).toFixed(0);
        stockQuantity = foundProduct.stockQuantity + quantity;
      }
      else{
        unitPrice = Number((foundProduct.costUnitPrice * foundProduct.stockQuantity
          - price * quantity)
          / (foundProduct.stockQuantity - quantity)).toFixed(0);
        stockQuantity = foundProduct.stockQuantity - quantity;
      }

      await Product.updateOne({ id: id }).set({
        stockQuantity: stockQuantity,
        costUnitPrice: unitPrice,
        lastImportPrice: type == sails.config.constant.import ? price: foundProduct.lastImportPrice
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      });
    }
  },

  updateQuantity: async function (id, stockQuantity, manufacturingQuantity, error) {
    let foundProduct = await Product.findOne({
      where: {
        id: id,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    });

    if (!foundProduct) {
      return error("Không tìm thấy sản phẩm");
    }
    else {
      //cập nhật tồn kho cho sản phẩm
      await Product.update({ id: id }).set({
        stockQuantity: Number(foundProduct.stockQuantity + stockQuantity).toFixed(2), // SL tồn kho
        manufacturingQuantity: Number(foundProduct.manufacturingQuantity + manufacturingQuantity).toFixed(2) // SL sản xuất
      }).intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      }).fetch();
    }
  },
};

