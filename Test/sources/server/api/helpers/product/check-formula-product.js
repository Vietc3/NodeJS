module.exports = {
    description: 'check formula product',
  
    inputs: {
      req: {
        type: "ref"
      },
      data: {
        type: "ref",
        required: true
      },
      productId: {
        type: "string",
      },
    },
  
    fn: async function (inputs, exits) {
      let { data, productCode } = inputs.data;
      let { req } = inputs;
      let errProducts = [];
  
      let foundProduct = await Product.findOne(req, {
        where: {
          code: productCode,
          deletedAt: 0
        }
      })
  
      if (!foundProduct) {
        errProducts.push({code: productCode, reason: sails.__("Không tìm thấy thành phẩm")});
      }
  
      //Kiểm tra nguyên vật liệu có tồn tại
  
      for (let i in data) {
        let foundMaterial = await Product.findOne(req, { code: i });
  
        if(!foundMaterial) {
          errProducts.push({code: i, reason: sails.__("Không tìm thấy nguyên vật liệu")});
        }
      };
  
      return exits.success({ status: true, errProducts: errProducts })
    }
  
  }