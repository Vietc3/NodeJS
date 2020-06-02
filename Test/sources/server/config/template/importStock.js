module.exports.importStock = {
    A4:`<div style="margin:20px">
            <div style="width: 100%">
            <table cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #ffff; width:100%">
        <tbody style="width:100%">
            <tr>
                <td style="width: 30%;">&nbsp;</td>
                <td style="width: 30%;">&nbsp;</td>
                <td>&nbsp;</td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size:13px;">
                <td style="padding-bottom: 10px;font-weight: 600;">{store_name}</td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size:13px;">
                <td><span style="font-weight: 600;padding-bottom: 10px;">{store_address}</span></td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size:13px;">
                <td style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size:13px;">
                <td><span style="font-weight: 600;padding-bottom: 10px;">{store_email}</span></td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>
        </tbody>
    </table>
            <h1 style="font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">PHIẾU NHẬP KHO</h1>
            <div style="font-family:Arial,sans-serif;text-align: center;font-size:13px;font-weight:bold">{created_on}</div>
            <div style="font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px">Mã phiếu nhập: {order_code}</div>
            </div>
            <table style="width:100%">
            <tbody>
            <tr>
                <td><strong>Người nhập kho: {recipient_name}</strong></td>
               
            </tr>
            <tr>
            <td><strong>Ngày nhập kho: {received_on}</strong></td>
        </tr>
            <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>
        </tbody>
    </table>
    
    <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
        <tbody>
            <tr>
                <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span style="font-size:12px;"><strong><span style="font-family: arial, helvetica, sans-serif;">STT</span></strong></span></td>
                <td style="padding: 1%; width: 20%; text-align: center; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><font face="arial, helvetica, sans-serif"><span style="font-size: 12px; line-height: 19.2px;"><b>Mã sản phẩm</b></span></font></td>
                <td style="padding: 1%; width: 50%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><font face="arial, helvetica, sans-serif"><span style="font-size: 12px; line-height: 19.2px;"><b>Tên sản phẩm</b></span></font></td>
                <td style="padding: 1%; text-align: center; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><font face="arial, helvetica, sans-serif"><span style="font-size: 12px; line-height: 19.2px;"><b>Số lượng</b></span></font></td>
            </tr>
            <!--<products>-->
            <tr>
                <td style="padding:1%;text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span style=" font-size: 1em;"><span style=" font-size: 1em;">{line_stt}</span></span></td>
                <td style="padding:1%;text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span style=" font-size: 1em;"><span style=" font-size: 1em;">{line_variant_code}</span></span></td>
                <td style="padding:1%;text-align: left;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span style=" font-size: 1em;"><span style=" font-size: 1em;">{line_variant_name}</span></span></td>
                <td style="padding:1%;text-align:center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span style=" font-size: 1em;"><span style=" font-size: 1em;">{line_quantity}</span></span></td>
            </tr>
            <!--</products>-->
        </tbody>
    </table>
    
    <table style="width:100%">
        <tbody>
            <tr>
                <td style="width: 50%;">&nbsp;</td>
                <td style="width: 25%;">&nbsp;</td>
                <td style="text-align: right;">&nbsp;</td>
            </tr>
            <tr style="font-family:Arial,sans-serif">
                <td style="width: 50%;padding:1%">&nbsp;</td>
                <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;font-weight: 600;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
            </tr>
        </tbody>
    </table>
    <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người lập phiếu </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người giao hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán trưởng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
   
    </div>
    </div>
    
    <footer style="page-break-after: always">.</footer>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
    `,
    A5: `<div style="margin:20px">
    <div style="width: 100%">
    <table cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #ffff; width:100%">
<tbody style="width:100%">
    <tr>
        <td style="width: 30%;">&nbsp;</td>
        <td style="width: 30%;">&nbsp;</td>
        <td>&nbsp;</td>
    </tr>
    <tr style="font-family:Arial,sans-serif;font-size:13px;">
        <td style="padding-bottom: 10px;font-weight: 600;">{store_name}</td>
    </tr>
    <tr style="font-family:Arial,sans-serif;font-size:13px;">
        <td><span style="font-weight: 600;padding-bottom: 10px;">{store_address}</span></td>
    </tr>
    <tr style="font-family:Arial,sans-serif;font-size:13px;">
        <td style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</td>
    </tr>
    <tr style="font-family:Arial,sans-serif;font-size:13px;">
        <td><span style="font-weight: 600;padding-bottom: 10px;">{store_email}</span></td>
    </tr>
    <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
    </tr>
</tbody>
</table>
    <h1 style="font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">PHIẾU NHẬP KHO</h1>
    <div style="font-family:Arial,sans-serif;text-align: center;font-size:13px;font-weight:bold">{created_on}</div>
    <div style="font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px">Mã phiếu nhập: {order_code}</div>
    </div>
    <table style="width:100%">
    <tbody>
    <tr>
        <td><strong>Người nhập kho: {recipient_name}</strong></td>
       
    </tr>
    <tr>
    <td><strong>Ngày nhập kho: {received_on}</strong></td>
</tr>
    <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
    </tr>
</tbody>
</table>

<table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
<tbody>
    <tr>
        <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span style="font-size:12px;"><strong><span style="font-family: arial, helvetica, sans-serif;">STT</span></strong></span></td>
        <td style="padding: 1%; width: 20%; text-align: center; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><font face="arial, helvetica, sans-serif"><span style="font-size: 12px; line-height: 19.2px;"><b>Mã sản phẩm</b></span></font></td>
        <td style="padding: 1%; width: 50%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><font face="arial, helvetica, sans-serif"><span style="font-size: 12px; line-height: 19.2px;"><b>Tên sản phẩm</b></span></font></td>
        <td style="padding: 1%; text-align: center; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><font face="arial, helvetica, sans-serif"><span style="font-size: 12px; line-height: 19.2px;"><b>Số lượng</b></span></font></td>
    </tr>
    <!--<products>-->
    <tr>
        <td style="padding:1%;text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span style=" font-size: 1em;"><span style=" font-size: 1em;">{line_stt}</span></span></td>
        <td style="padding:1%;text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span style=" font-size: 1em;"><span style=" font-size: 1em;">{line_variant_code}</span></span></td>
        <td style="padding:1%;text-align: left;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span style=" font-size: 1em;"><span style=" font-size: 1em;">{line_variant_name}</span></span></td>
        <td style="padding:1%;text-align:center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span style=" font-size: 1em;"><span style=" font-size: 1em;">{line_quantity}</span></span></td>
    </tr>
    <!--</products>-->
</tbody>
</table>

<table style="width:100%">
<tbody>
    <tr>
        <td style="width: 50%;">&nbsp;</td>
        <td style="width: 25%;">&nbsp;</td>
        <td style="text-align: right;">&nbsp;</td>
    </tr>
    <tr style="font-family:Arial,sans-serif">
        <td style="width: 50%;padding:1%">&nbsp;</td>
        <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;font-weight: 600;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
    </tr>
</tbody>
</table>
<div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>

<div style="width: 100%;float: left;padding-top: 20px;">
<div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người lập phiếu </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>

<div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người giao hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>

<div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>

<div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán trưởng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>

</div>
</div>

<footer style="page-break-after: always">.</footer>

<div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>`,
    K57: null,
    K80: null,
    default:`A4`
}