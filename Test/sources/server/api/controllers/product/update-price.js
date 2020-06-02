function calculatePrice(isCalculatePercent, selectOptionPrice, value, dataProduct, isCostUnitPrice) {
  let resultPrice;

  switch (selectOptionPrice) {
    case 0: {// giá hiện tại
      resultPrice = calculateValuePrice(value, isCostUnitPrice ? dataProduct.costUnitPrice : dataProduct.saleUnitPrice, isCalculatePercent)
      break;
    }

    case 1: {// giá vốn
      resultPrice = calculateValuePrice(value, dataProduct.costUnitPrice, isCalculatePercent)
      break;
    }

    case 2: {// giá nhập cuối
      resultPrice = calculateValuePrice(value, dataProduct.lastImportPrice, isCalculatePercent)
      break;
    }
    
    case 3: {// giá bán
      resultPrice = calculateValuePrice(value, dataProduct.saleUnitPrice, isCalculatePercent)
      break;
    }

    default: break;
  }

  return resultPrice > 0 ? Number(resultPrice).toFixed(2) : 0;
}

function calculateValuePrice(value, typeCalculatePrice, isCalculatePercent) {
  let resultPrice;

  if (isCalculatePercent)
    resultPrice = typeCalculatePrice ? typeCalculatePrice + (typeCalculatePrice * parseFloat(value) / 100) : 0;

  else resultPrice = typeCalculatePrice ? typeCalculatePrice + parseFloat(value) : parseFloat(value);

  return resultPrice;
}

module.exports = {
  friendlyName: "Update Price",

  description: "Update Price.",

  inputs: {
    type: {
      type: "string"
    },

    id: {
      type: "number"
    },

    selectOptionPrice: {//0: giá hiện tại, 1: giá vốn, 2: giá nhập cuối, 3: giá chung
      type: "number"
    },

    value: {
      type: "number"
    },

    isCalculatePercent: {
      type: "boolean"
    },

    isCostUnitPrice: {
      type: "boolean"
    }
  },

  fn: async function (inputs) {

    let { type, id, selectOptionPrice, value, isCalculatePercent, isCostUnitPrice } = inputs;
    let foundProducts;
    let branchId = this.req.headers['branch-id'];
    let selectOption = {
      0: "Giá hiện tại",
      1: "Giá vốn",
      2: "Giá nhập cuối",
      3: "Giá bán"
    };
    switch (type) {
      case "one": {
        let foundProduct = await sails.helpers.product.get(this.req, { productId: id, branchId })
        let updatePriceProduct = await ProductPrice.update(this.req, { productId: id, branchId: branchId })
          .set(_.pickBy({ 
            saleUnitPrice: isCostUnitPrice ? null : value,
            costUnitPrice: isCostUnitPrice ? value : null,
            updatedBy: this.req.loggedInUser.id 
          }, value => value !== null))
          .intercept({ name: 'UsageError' }, () => {
            this.res.status(400).json({
              status: false,
              error: sails.__('Thông tin yêu cầu không hợp lệ')
            });
            return;
          }).fetch();
          let valueCal = isCostUnitPrice ? parseFloat(value) - foundProduct.data.costUnitPrice : parseFloat(value) - foundProduct.data.saleUnitPrice
        // tạo nhật kí
        let createActionLog = await sails.helpers.actionLog.create(this.req, {
          userId: this.req.loggedInUser.id,
          functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT_PRICE,
          action: sails.config.constant.ACTION.UPDATE,
          objectContentNew: `Bảng giá chung: Giá ${isCostUnitPrice ? "vốn" : "bán"} mới = ${selectOption[selectOptionPrice]} ${parseFloat(valueCal) > 0 ? "+" + valueCal : valueCal} đ cho 1 sản phẩm`,
          deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
          branchId
        })

        this.res.json({
          status: true,
          data: updatePriceProduct[0]
        });
        return;
      }

      case "all": {
        foundProducts = await sails.helpers.product.list(this.req, { branchId });
        break;
      }

      case "group": {
        foundProducts = await sails.helpers.product.list(this.req, { filter: { ["productTypeId.id"]: id }, branchId });
        break;
      }
    }

    if (foundProducts.status) {
      await Promise.all(_.map(foundProducts.data, item => {
        let updatePriceProduct = ProductPrice.update(this.req, { productId: item.id, branchId: branchId }).set({
          saleUnitPrice: isCostUnitPrice ? item.saleUnitPrice : calculatePrice(isCalculatePercent, selectOptionPrice, value, item, isCostUnitPrice),
          costUnitPrice: isCostUnitPrice ? calculatePrice(isCalculatePercent, selectOptionPrice, value, item, isCostUnitPrice) : item.costUnitPrice,
          updatedBy: this.req.loggedInUser.id
        }).fetch();
  
        return updatePriceProduct;
      }))
      // tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(this.req, {
        userId: this.req.loggedInUser.id,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT_PRICE,
        action: sails.config.constant.ACTION.UPDATE,        
        objectContentNew: `Bảng giá chung: Giá ${isCostUnitPrice ? "vốn" : "bán"} mới = ${selectOption[selectOptionPrice]} ${parseFloat(value) > 0 ? "+ " + value : value} ${isCalculatePercent ? "%" : "đ"} cho ${foundProducts.data.length} sản phẩm`,
        deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
        branchId
      })

      this.res.json({
        status: true
      });
    }
    else  return this.res.json({
            status: false,
            error: "Cập nhập giá thất bại."
          });

  }
}