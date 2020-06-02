module.exports = {

  friendlyName: 'Get Image Products',

  description: 'Get list image of products',

  inputs: {
    ids: {
      type: 'json',
    },
  },

  fn: async function (inputs) {
    let { ids } = inputs;

    if (!ids || !Array.isArray(ids) || !ids.length) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }

    let foundImageProduct = await FileStorage.find(this.req, { where: { productId: { in: ids }, deletedAt: 0 }})

    if ( !foundImageProduct ) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Không có hình ảnh')
      });
      return;
    }
    
    if (foundImageProduct.length )
      await Promise.all(_.forEach(foundImageProduct, item => {
        let image = unit8ArrayToBase64(new Buffer.from(item.file, 'base64'));

        item.file = image
      }))
    
    this.res.json({
      status: true,
      data: foundImageProduct,
    });
  }
};

function unit8ArrayToBase64(unit8Array) {
  let binary = '';

  for (let i = 0; i < unit8Array.byteLength; i++) {
      binary += String.fromCharCode(unit8Array[i])
  }

  return binary;
};