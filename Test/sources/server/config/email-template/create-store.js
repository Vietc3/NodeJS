

module.exports.createStoreMailContent = function (fullName, email, url) {
	let html = '<p>Xin chào ' + fullName + ',&nbsp;</p>' +
    '<p>Cảm ơn bạn đã tin tưởng sử dụng Phần mềm quản lý kho bán hàng Ohstore. Dưới đây là thông tin đăng nhập của cửa hàng bạn:</p>' + 
    '<p><b>Địa chỉ đăng nhập:<b> &nbsp;<a href= ' + url + ' target="_blank">' + url + '</a></p>' +
    '<p><b>Email:<b> &nbsp;<a href="mailto:' + email + '" target="_blank">' + email + '</a></p>' +
    '<p>Nếu gặp khó khăn, hãy email tới <b>support@ohstore.vn</b> hoặc gọi tổng đài số <b>1900 888698</b> để được hỗ trợ.</p>'+
    '<p>Xin cảm ơn !</p>';
	return { subject: 'Ohstore - Thông tin đăng nhập cửa hàng', html: html };
}
