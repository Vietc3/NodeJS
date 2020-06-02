module.exports = {
  description: 'a action log',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let { id } = inputs.data;

    let { req } = inputs;

    let foundActionLog = await ActionLog.findOne(req, {id}).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });

    if (!foundActionLog) {
      exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_ACTION_LOG)})
    }

    if (foundActionLog.userId) {
      let foundUser = await User.findOne(req, {id: foundActionLog.userId});

      foundActionLog.userName = foundUser.fullName || ""
    }

    if (foundActionLog.deviceInfo && _.isJson(foundActionLog.deviceInfo)) {
      let deviceInfo = JSON.parse(foundActionLog.deviceInfo)

      foundActionLog.ip = deviceInfo.ip;
      foundActionLog.userAgent = deviceInfo.userAgent;
    }

    if (foundActionLog.objectContentNew && _.isJson(foundActionLog.objectContentNew)) {
      let objectContentNew = JSON.parse(foundActionLog.objectContentNew);

      if (!objectContentNew.length) {
        if (objectContentNew.code) {
          foundActionLog.code = objectContentNew.code;
          foundActionLog.codeId = objectContentNew.id;
        }
      }

      let objNew = await getData(req, objectContentNew);

      foundActionLog.objectContentNew = objNew;
    }

    if (foundActionLog.objectContentOld && _.isJson(foundActionLog.objectContentOld)) {
      let objectContentOld = JSON.parse(foundActionLog.objectContentOld);

      let objOld = await getData(req, objectContentOld);

      foundActionLog.objectContentOld = objOld;

    }

    if (foundActionLog.function === sails.config.constant.ACTION_LOG_TYPE.SETUP) {
      if (foundActionLog.objectContentNew.length && foundActionLog.objectContentOld.length) {
        let oldValue = foundActionLog.objectContentOld[0];
        let newValue = foundActionLog.objectContentNew[0];

        if (oldValue.type.includes("print_template_") && newValue.type.includes("print_template_")) {
          let valueKeysNew = Object.keys(newValue.value);
          valueKeysNew= valueKeysNew.slice(0, -1);
          let checkSample;
          for(let item of valueKeysNew) {
            if (oldValue.value[item] !== newValue.value[item]) {
              foundActionLog.objectContentNew[0].checkSample = item;
              foundActionLog.objectContentOld[0].checkSample = item;
              checkSample = item;
              break;
            }
          }
          if(!checkSample) {
            foundActionLog.objectContentNew[0].checkSampleDefault = foundActionLog.objectContentNew[0].value["default"];
            foundActionLog.objectContentOld[0].checkSampleDefault = foundActionLog.objectContentOld[0].value["default"];
          }
          else {
            foundActionLog.objectContentNew[0].checkSampleDefault = foundActionLog.objectContentNew[0].value["default"] === checkSample ? "Có": "Không";
            foundActionLog.objectContentOld[0].checkSampleDefault = foundActionLog.objectContentOld[0].value["default"] === checkSample ? "Có": "Không";
          }
        }
      } 
    }

    return exits.success({ status: true, data: foundActionLog });
  }

}

async function getData(req, obj) {
  if (!obj.length) {
    if (obj.stockId) {
      let stock = await Stock.findOne(req, {id: obj.stockId});

      obj.stockName = stock.name;
    }

    if (obj.productTypeId) {
      let productType = await ProductType.findOne(req, {id: obj.productTypeId});

      obj.productTypeName = productType.name;
    }

    if (obj.unitId) {
      let productUnit = await ProductUnit.findOne(req, {id: obj.unitId});

      obj.productUnitName = productUnit.name;
    }

    if (obj.customerId || obj.recipientId) {
      if (obj.customerType && obj.customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.STAFF) {
        let user = await User.findOne(req, {id: obj.customerId})

        obj.customerName = user.fullName;
      } else {
        let customer = await Customer.findOne(req, { id: obj.customerId || obj.recipientId })

        obj.customerName = customer.name;
        obj.customerCode = customer.code;
        obj.customerTel = customer.tel;
        obj.deliveryAddress = obj.deliveryAddress || customer.address
      }          
    }

    if (obj.products && obj.products.length) {
      for (let item of obj.products) {
        let foundProduct = await Product.findOne(req, {
          where: { id: item.productId && item.productId.id || item.productId },
        }).populate("unitId")
        .intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, error: sails.__('Sản phẩm không tồn tại trong hệ thống')});
        })

        if ( foundProduct.unitId && foundProduct.unitId.name ) {
          item.unitName = foundProduct.unitId.name
        }

        if (item.stockId) {
          let foundStock = await Stock.findOne(req, {id: item.stockId});

          item.stockName = foundStock.name;
        }
      }
    }

    if (obj.finishedProducts && obj.finishedProducts.length) {
      for (let item of obj.finishedProducts) {
        let foundProduct = await Product.findOne(req, {
          where: { id: item.productId && item.productId.id || item.productId },
        }).populate("unitId")
        .intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, error: sails.__('Sản phẩm không tồn tại trong hệ thống')});
        })

        if ( foundProduct.unitId && foundProduct.unitId.name ) {
          item.unitName = foundProduct.unitId.name
        }

        if (item.stockId) {
          let foundStock = await Stock.findOne(req, {id: item.stockId});

          item.stockName = foundStock.name;
        }
      }
    }

    if (obj.materials && obj.materials.length) {
      for (let item of obj.materials) {
        let foundProduct = await Product.findOne(req, {
          where: { id: item.productId && item.productId.id || item.productId },
        }).populate("unitId")
        .intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, error: sails.__('Sản phẩm không tồn tại trong hệ thống')});
        })

        if ( foundProduct.unitId && foundProduct.unitId.name ) {
          item.unitName = foundProduct.unitId.name
        }

        if (item.stockId) {
          let foundStock = await Stock.findOne(req, {id: item.stockId});

          item.stockName = foundStock.name;
        }
      }        
    }

    if (obj.branchId) {
      if (typeof obj.branchId === "number") {
        let getBranch = await Branch.findOne(req, {id: obj.branchId})

        if (getBranch) {
          let data = getBranch.name;
          if (getBranch.deletedAt === 0){
            obj.branchName = data

          } else {
            obj.branchName = data.slice(0, -13)
          }

        }
      }
      if (_.isJson(obj.branchId)) {
        let branch = JSON.parse(obj.branchId)

        if (branch.length) {
          let foundBranch = await Branch.find(req, {where: {id: {in: branch}}, select: ["createdAt", "id", "name", "deletedAt"]})

          _.forEach(foundBranch, item =>{
            if (item.deletedAt > 0){
              let name = item.name.slice(0, -13);
              item.name = name;  
            }
          })
          
          obj.branch = foundBranch;
        }
      }
    }

    if (obj.permission && obj.permission.length) {
      for (let item of obj.permission) {
        let foundPermission = await Permission.findOne(req, {id: item.permissionId })

        item.permissionName = foundPermission.name
      }
    }

    if (obj.createdBy) {
      let getUser = await User.findOne(req, {id: obj.createdBy})

      if (getUser) {
        obj.userName = getUser.fullName
      }
    }

    if (obj.movedBy) {
      let getUser = await User.findOne(req, {id: obj.movedBy})

      if (getUser) {
        obj.movedName = getUser.fullName
      }
    }

    if (obj.roleId) {
      let getRole = await Role.findOne(req, {id: obj.roleId})

      if (getRole) {
        obj.roleName = getRole.name
      }
    }

    if (obj.paymentDetail && obj.paymentDetail.length) {
      if (obj.type === sails.config.constant.INCOME_EXPENSE_TYPES.INCOME) {
        for (let item of obj.paymentDetail) {
          if( item.paidCardId && item.paidCardId.id) {
            item.paymentCode = item.paidCardId.code;
            item.amountPaid = item.paidCardId.finalAmount - item.paidCardId.paidAmount;
          }else {
            let getModelByIncomeType = await sails.helpers.income.getModelByIncomeType(req, {incomeCardTypeId: item.incomeExpenseCardTypeId});
            let {paymentModel} = getModelByIncomeType.data;
            
            if (paymentModel) {
              let foundModel = await paymentModel.findOne(req, {id: item.paidCardId})

              if (foundModel) {
                item.paymentCode = foundModel.code;
                item.amountPaid = foundModel.finalAmount - foundModel.paidAmount;
              }
            }
          }
        }
      } else {
        for (let item of obj.paymentDetail) {
          if( item.paidCardId && item.paidCardId.id) {
            item.paymentCode = item.paidCardId.code;
            item.amountPaid = item.paidCardId.finalAmount - item.paidCardId.paidAmount;
          }else {
            let getModelByIncomeType = await sails.helpers.expense.getModelByExpenseType(req, {expenseCardTypeId: item.incomeExpenseCardTypeId});
            let {paymentModel, reason} = getModelByIncomeType.data;
            if (paymentModel) {
              let foundModel = await paymentModel.findOne(req, {id: item.paidCardId, reason})

              if (foundModel) {
                item.paymentCode = foundModel.code;
                item.amountPaid = foundModel.finalAmount - foundModel.paidAmount;
              }
            }
          }
        }
      }
    }
  }
  else {
    for (let item of obj) {
      if (item.productTypeId) {
        let productType = await ProductType.findOne(req, {id: item.productTypeId});

        item.productTypeName = productType.name;
      }

      if (item.productId) {
        let product = await Product.findOne(req, {id: item.productId && item.productId.id || item.productId});

        item.productName = product.name;
        item.productCode = product.code;
      }

      if (item.materialId) {
        let product = await Product.findOne(req, {id: item.materialId}).populate("unitId");

        item.materialName = product.name;
        item.materialCode = product.code;

        if (product.unitId && product.unitId.name) {
          item.unitName = product.unitId.name
        }
      }

      if (item.value && _.isJson(item.value)) {
        item.value = JSON.parse(item.value)
      }
    }
  }

  return obj;
}