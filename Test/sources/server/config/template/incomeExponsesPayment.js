module.exports.incomeExponsesPayment = {
    A4: `<div style="margin:50px;font-family:Arial,sans-serif;font-size: 13px;">
    <div style="width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;">
    <div style="width: 50%;float:left;text-align: left;">
    <div style="padding-bottom: 5px;font-weight: 600;">{store_name}</div>
    
    <div style="font-weight: 600;padding-bottom: 5px;">{store_address}</div>
    
    <div style="font-weight: 600;padding-bottom: 5px;">{store_phone_number}</div>
    
    <div style="font-weight: 600;padding-bottom: 5px;">{store_email}</div>
    </div>
    
    <div style="width: 50%;float:right;text-align: right;">
    <div style="padding-bottom: 5px;">Số: <span style="font-weight: 600;">{payment_voucher_code}</span></div>
    
    <div style="padding-bottom: 5px;">Ngày ghi nhận: <span style="font-weight: 600;">{issued_on}</span></div>
    </div>
    </div>
    
    <div style="width: 100%;float: left;margin-bottom: 10px;">
    <h2 style="font-weight: 600;text-align: center;">PHIẾU CHI</h2>
    </div>
    
    <table cellpadding="0" cellspacing="0" style="width:100%">
        <tbody>
            <tr>
                <td style="padding:5px;width:30%">Họ tên người nhận</td>
                <td style="padding:5px;width:70%;font-weight: 600">: {object_name}</td>
            </tr>
            <tr>
                <td style="padding:5px;width:30%">Địa chỉ</td>
                <td style="padding:5px;width:70%;font-weight: 600">: {object_address}</td>
            </tr>
            <tr>
                <td style="padding:5px;width:30%">Số tiền</td>
                <td style="padding:5px;width:70%;font-weight: 600">: {amount}</td>
            </tr>
            <tr>
                <td style="padding:5px;width:30%">Bằng chữ</td>
                <td style="padding:5px;width:70%;font-weight: 600">: {total_text}</td>
            </tr>
            <tr>
            <td style="padding:5px;width:30%">Lý do</td>
            <td style="padding:5px;width:70%;font-weight: 600">: {reason}</td>
        </tr>
            <tr>
                <td style="padding:5px;width:30%">Kèm theo</td>
                <td style="padding:5px;width:70%;font-weight: 600">:...............................Chứng từ gốc</td>
            </tr>
        </tbody>
    </table>
    
    <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người nộp tiền </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ quỹ </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Cửa hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    </div>
    </div>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
    `,
    A5: `<div style="margin:50px;font-family:Arial,sans-serif;font-size: 11px;">
    <div style="width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;">
    <div style="width: 50%;float:left;text-align: left;">
    <div style="padding-bottom: 5px;font-weight: 600;">{store_name}</div>
    
    <div style="font-weight: 600;padding-bottom: 5px;">{store_address}</div>
    
    <div style="font-weight: 600;padding-bottom: 5px;">{store_phone_number}</div>
    
    <div style="font-weight: 600;padding-bottom: 5px;">{store_email}</div>
    </div>
    
    <div style="width: 50%;float:right;text-align: right;">
    <div style="padding-bottom: 5px;">Số: <span style="font-weight: 600;">{payment_voucher_code}</span></div>
    
    <div style="padding-bottom: 5px;">Ngày ghi nhận: <span style="font-weight: 600;">{issued_on}</span></div>
    </div>
    </div>
    
    <div style="width: 100%;float: left;margin-bottom: 10px;">
    <h2 style="font-weight: 600;text-align: center;">PHIẾU CHI</h2>
    </div>
    
    <table cellpadding="0" cellspacing="0" style="width:100%">
        <tbody>
            <tr>
                <td style="padding:5px;width:30%">Họ tên người nhận</td>
                <td style="padding:5px;width:70%;font-weight: 600">: {object_name}</td>
            </tr>
            <tr>
                <td style="padding:5px;width:30%">Địa chỉ</td>
                <td style="padding:5px;width:70%;font-weight: 600">: {object_address}</td>
            </tr>
            <tr>
                <td style="padding:5px;width:30%">Số tiền</td>
                <td style="padding:5px;width:70%;font-weight: 600">: {amount}</td>
            </tr>
            <tr>
                <td style="padding:5px;width:30%">Bằng chữ</td>
                <td style="padding:5px;width:70%;font-weight: 600">: {total_text}</td>
            </tr>
            <tr>
            <td style="padding:5px;width:30%">Lý do</td>
            <td style="padding:5px;width:70%;font-weight: 600">: {reason}</td>
        </tr>
            <tr>
                <td style="padding:5px;width:30%">Kèm theo</td>
                <td style="padding:5px;width:70%;font-weight: 600">:...............................Chứng từ gốc</td>
            </tr>
        </tbody>
    </table>
    
    <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người nộp tiền </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ quỹ </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Cửa hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    </div>
    </div>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
    `,
    K57: null,
    K80: null,
    default:`A4`
}