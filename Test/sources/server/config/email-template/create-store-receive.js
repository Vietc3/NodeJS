

module.exports.createStoreMailContentReceive = function (data) {
  let {
    fullName,
    mobile,
    email,
    storeName,
    address,
    isCreatedDataTemplate,
    field,
  } = data;
  
  let html = '<p>Có khách hàng mới đăng ký dùng thử phần mềm Ohstore. Thông tin chi tiết:</p>' +
    '<p>Tên khách hàng:<b> &nbsp;' + fullName + '<b></p>' +
    '<p>Số điện thoại:<b> &nbsp;' + mobile + '<b></p>' +
    '<p>Email:<b> &nbsp;' + email + '<b></p>' +
    '<p>Tên cửa hàng:<b> &nbsp;' + storeName + '<b></p>' +
    '<p>Địa chỉ truy cập:<b> &nbsp;' + address + '<b></p>' +
    '<p>Dùng dữ liệu mẫu:<b> &nbsp;' + ( isCreatedDataTemplate ? 'Có' : 'Không' ) + '<b></p>' +
    '<p>Ngành nghề kinh doanh:<b> &nbsp;' + sails.config.constant.DATABASE_FIELD[field] + '<b></p>' ;
  return { subject: 'Ohstore - Khách hàng mới đăng ký', html: html };
}
