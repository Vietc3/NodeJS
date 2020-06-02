module.exports.importReturn = {
    A4: `<div style="margin:20px">
    <div style="width: 100%">
    <h1 style="font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;font-weight: 600">PHIẾU HOÀN TRẢ NHÀ CUNG CẤP</h1>
    
    <div style="font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px">Mã phiếu: {refund_code}</div>
    
    <div style="font-family:Arial,sans-serif;text-align: center;font-size:13px">Ngày tạo: {created_on}</div>
    </div>
    
    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tbody>
            <tr>
                <td>Địa chỉ chi nhánh: {location_address}</td>
            </tr>
            <tr>
                <td>Người tạo: {account_name}</td>
            </tr>
            <tr>
                <td>Nhà cung cấp: {supplier_name}</td>
            </tr>
            <tr>
                <td>Số điện thoại: {supplier_phone_number}</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
        </tbody>
    </table>
    
    <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
        <tbody>
            <tr style="font-family:Arial,sans-serif;font-size: 12px;font-weight: 600">
                <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>STT </span></td>
                <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Mã SKU </span></td>
                <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Tên sản phẩm </span></td>
                <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Số lượng </span></td>
                <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Giá nhập </span></td>
                <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Chiết khấu</span></td>
                <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thành tiền </span></td>
            </tr>
            <!--<products>-->
            <tr style="font-family:Arial,sans-serif;font-size: 12px">
                <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>{line_stt}</span></td>
                <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_sku}</span></td>
                <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_name}</span></td>
                <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity}</span></td>
                <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_price}</span></td>
                <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_discount_amount}</span></td>
                <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_amount}</span></td>
            </tr>
            <!--</products>-->
        </tbody>
    </table>
    
    <table style="width:100%">
        <tbody>
            <tr>
                <td style="width: 50%;">&nbsp;</td>
                <td style="text-align: right;">&nbsp;</td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                <td style="width: 50%;padding:3px">&nbsp;</td>
                <td style="width:50%;padding: 3px;">Giá trị hàng trả<span style="float: right;font-weight: 400;">{total_amount}</span></td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                <td style="width: 50%;padding:3px">&nbsp;</td>
                <td style="width:50%;padding: 3px;">Tổng giá trị hàng trả<span style="float: right;font-weight: 400;">{total_price}</span></td>
            </tr>
            <!--<products>-->
            <tr>
                <td style="width: 50%;padding:3px">&nbsp;</td>
                <td style="width:50%;padding: 3px;">
                <div style="width:50%;float:left">{transaction_refund_method_name}</div>
    
                <div style="width:50%;float:left;text-align:right">{transaction_refund_method_amount}</div>
                </td>
            </tr>
            <!--</products>-->
        </tbody>
    </table>
    
    <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người trả </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Trưởng bộ phận </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
   
    </div>

    </div>
    
    <footer style="page-break-after: always">.</footer>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
    `,
    A5: null,
    K57: null,
    K80: null,
    default:`A4`
}