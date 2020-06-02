

module.exports.changePasswordMailContent= function(fullName, email, url){
	let html = '<p>Xin chào '+fullName+',&nbsp;</p>'+
			'<p>Hệ thống vừa nhận được yêu cầu thay đổi mật khẩu đăng nhập cho tài khoản email &nbsp;<a href="mailto:'+email+'" target="_blank">'+email+'</a></p>'+
			'<p>Bạn hãy  &nbsp;<a href= '+url+' target="_blank">BẤM VÀO ĐÂY</a> để thực hiện thiết lập mật khẩu mới cho tài khoản của mình. Nếu bạn không thực hiện yêu cầu thay đổi mật khẩu xin vui lòng bỏ qua email này.</p>'+
			'<p><br />Xin cảm ơn !</p>';
	return {subject:'Ohstore - Xác nhận thay đổi mật khẩu mới', html: html};
}
