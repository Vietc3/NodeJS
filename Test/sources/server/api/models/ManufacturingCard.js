/**
 * ManufacturingCard.js
 *
 * @description :: A model definition represents an manufacturing card.
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
    createdAt: {
      type: 'number',
      example: 1502844074211,
      required: true
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    status: {   //0 - Đang thực hiện;  1 - Hoàn thành;  2 - Tạm dừng;  3 - Hủy
      type: 'number',
      required: true,
    },
    deletedAt: {
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
    finishedProducts: {
      collection: 'ManufacturingCardFinishedProduct',
      via: 'manufacturingCardId'
    },
    materials: {
      collection: 'ManufacturingCardMaterial',
      via: 'manufacturingCardId'
    }
  },
  multitenant: true,

  getManufacturingCard: async function (req, branchId, id, error) {
    let result = {
      manufacturingCard: await ManufacturingCard.findOne(req, {
        where: { id: id, branchId }
      }).intercept({ name: 'UsageError' }, () => {
          return error("Thông tin không hợp lệ");
        })
    }
    if(!result.manufacturingCard) {
          return error("Không tìm thấy phiếu sản xuất")
        }
    let createdBy = await User.findOne(req, {
      where: { id: result.manufacturingCard.createdBy },
      select: ["id", "fullName"]
    })
    if (createdBy)
      result.manufacturingCard.createdBy = createdBy;

    if (!result.manufacturingCard) {
      return error("Không tìm thấy phiếu nhập");
    }
    result.finishedProducts = await ManufacturingCardFinishedProduct.find(req, { manufacturingCardId: result.manufacturingCard.id })
      .populate("productId");
    result.materials = await ManufacturingCardMaterial.find(req, { manufacturingCardId: result.manufacturingCard.id })
      .populate("productId");
    
    result.materials = await Promise.all(_.map(result.materials, async item => {
      let productStock = await ProductStock.findOne(req, {productId: item.productId.id, branchId});
      if (productStock) {
        item.productId = {...item.productId, manufacturingQuantity: productStock.manufacturingQuantity}
      }
      else item.productId = {...item.productId, stockQuantity: 0, manufacturingQuantity: 0}    
      
      return item;
    }))
    
    return result;
  },

  getManufacturingCards: async function (req, filter, sort, limit, skip, manualFilter, manualSort, error) {
    filter = _.extend(filter || {}, { deletedAt: 0 });

    let foundManufacturingCards = await ManufacturingCard.find(req, {
      where: filter,
      sort: sort || 'createdAt DESC',
    }).populate("finishedProducts")
      .populate("materials")
      .intercept({ name: 'UsageError' }, () => {
        return error("Thông tin không hợp lệ");
      });

      foundManufacturingCards = sails.helpers.manualSortFilter(foundManufacturingCards, manualFilter, manualSort);
    return foundManufacturingCards;
  },
};

