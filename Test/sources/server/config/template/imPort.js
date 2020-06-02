module.exports.imPort = {
    A4: `<table cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #7a7676; width:100%">
    <tbody style="width:100%">
        <tr>
            <td style="width: 30%;">&nbsp;</td>
            <td style="width: 30%;">&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="padding-bottom: 10px;font-weight: 600;">{store_name}</td>
            <td>&nbsp;</td>
            <td style="text-align: right;padding-bottom: 10px;">Mã đơn nhập: <span style="font-weight: 600">{purchase_order_code}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="padding-bottom: 10px;"><span style="font-weight: 600">{store_address}</span></td>
            <td>&nbsp;</td>
            <td style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td><span style="font-weight: 600;padding-bottom: 10px;">{store_phone_number}</span></td>
            
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td><span style="font-weight: 600;padding-bottom: 10px;">{store_email}</span></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    </tbody>
</table>

<div style="width: 100%">
<h1 style="font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">ĐƠN NHẬP HÀNG</h1>
</div>

<div style="width: 100%;font-family:Arial,sans-serif;font-size: 11px;float: left;margin: 10px 0 20px;">
<div style="width: 35%;float: left;text-align: left;">
<div style="font-weight: 600;padding-bottom: 10px;">Nhà cung cấp:</div>

<div style="padding-bottom: 10px;">{supplier_name}</div>

<div style="padding-right: 20px;line-height: 20px;">{supplier_address}</div>
</div>

<div style="width: 35%;float: left;text-align: left;">
<div style="font-weight: 600;padding-bottom: 10px;">Hóa đơn đến</div>

<div style="padding-bottom: 10px;">{location_name}</div>

<div style="padding-right: 20px;">{location_address}</div>
</div>

<div style="width: 30%;float: left;text-align: left;">
<div style="font-weight: 600;padding-bottom: 10px;">Giao hàng đến:</div>

<div style="padding-bottom: 10px;">{location_name}</div>

<div>{location_address}</div>
</div>
</div>

<table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
    <tbody>
        <tr style="font-family:Arial,sans-serif;font-size: 10px;font-weight: 600">
            <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>STT </span></td>
            <td style="padding: 1%; width: 25%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Tên sản phẩm </span></td>
            <td style="padding: 1%; width: 10%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Đơn vị</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Số lượng </span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Đơn giá </span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Giảm giá </span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thành tiền </span></td>
        </tr>
        <!--<products>-->
        <tr style="font-family:Arial,sans-serif;font-size: 10px;">
            <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>{line_stt}</span></td>
            <td style="padding: 1%; width: 25%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_name}</span></td>
            <td style="padding: 1%; width: 10%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_unit}</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity}</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_price}</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_tax_rate}</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_amount}</span></td>
        </tr>
        <!--</products>-->
    </tbody>
</table>

<table style="width:100%">
    <tbody>
        <tr>
            <td style="width: 50%;">&nbsp;</td>
            <td style="width: 50%;">&nbsp;</td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="width: 50%;padding:1%">&nbsp;</td>
            <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="width: 50%;padding:1%">&nbsp;</td>
            <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;">Tổng tiền hàng<span style="float: right;">{total}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="width: 50%;padding:1%">&nbsp;</td>
            <td style="border-bottom: 1px solid #222222; width:50%;padding: 5px;">Plus VAT<span style="float: right;">{total_tax}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="width: 50%;padding:1%">&nbsp;</td>
            <td style="width:50%;padding: 5px;font-weight: 600;">Tổng tiền (VNĐ)<span style="float: right;">{total_price}</span></td>
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

<footer style="page-break-after: always">.</footer>

<div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
`,
    A5: `<table cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #7a7676; width:100%">
    <tbody style="width:100%">
        <tr>
            <td style="width: 30%;">&nbsp;</td>
            <td style="width: 30%;">&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="padding-bottom: 10px;font-weight: 600;">{store_name}</td>
            <td>&nbsp;</td>
            <td style="text-align: right;padding-bottom: 10px;">Mã đơn nhập: <span style="font-weight: 600">{purchase_order_code}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="padding-bottom: 10px;"><span style="font-weight: 600">{store_address}</span></td>
            <td>&nbsp;</td>
            <td style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td><span style="font-weight: 600;padding-bottom: 10px;">{store_phone_number}</span></td>
            
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td><span style="font-weight: 600;padding-bottom: 10px;">{store_email}</span></td>
            
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    </tbody>
</table>

<div style="width: 100%">
<h1 style="font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">Đơn nhập hàng</h1>
</div>

<div style="width: 100%;font-family:Arial,sans-serif;font-size: 11px;float: left;margin: 10px 0 20px;">
<div style="width: 35%;float: left;text-align: left;">
<div style="font-weight: 600;padding-bottom: 10px;">Nhà cung cấp:</div>

<div style="padding-bottom: 10px;">{supplier_name}</div>

<div style="padding-right: 20px;line-height: 20px;">{supplier_address}</div>
</div>

<div style="width: 35%;float: left;text-align: left;">
<div style="font-weight: 600;padding-bottom: 10px;">Hóa đơn đến</div>

<div style="padding-bottom: 10px;">{location_name}</div>

<div style="padding-right: 20px;">{location_address}</div>
</div>

<div style="width: 30%;float: left;text-align: left;">
<div style="font-weight: 600;padding-bottom: 10px;">Giao hàng đến:</div>

<div style="padding-bottom: 10px;">{location_name}</div>

<div>{location_address}</div>
</div>
</div>

<table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
    <tbody>
        <tr style="font-family:Arial,sans-serif;font-size: 10px;font-weight: 600">
            <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>STT </span></td>
            <td style="padding: 1%; width: 25%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Tên sản phẩm </span></td>
            <td style="padding: 1%; width: 10%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Đơn vị</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Số lượng </span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Đơn giá </span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Giảm giá </span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thành tiền </span></td>
        </tr>
        <!--<products>-->
        <tr style="font-family:Arial,sans-serif;font-size: 10px;">
            <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>{line_stt}</span></td>
            <td style="padding: 1%; width: 25%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_name}</span></td>
            <td style="padding: 1%; width: 10%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_unit}</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity}</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_price}</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span >{line_tax_rate}</span></td>
            <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_amount}</span></td>
        </tr>
        <!--</products>-->
    </tbody>
</table>

<table style="width:100%">
    <tbody>
        <tr>
            <td style="width: 50%;">&nbsp;</td>
            <td style="width: 50%;">&nbsp;</td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="width: 50%;padding:1%">&nbsp;</td>
            <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="width: 50%;padding:1%">&nbsp;</td>
            <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;">Tổng tiền hàng<span style="float: right;">{total}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="width: 50%;padding:1%">&nbsp;</td>
            <td style="border-bottom: 1px solid #222222; width:50%;padding: 5px;">Plus VAT<span style="float: right;">{total_tax}</span></td>
        </tr>
        <tr style="font-family:Arial,sans-serif;font-size: 11px;">
            <td style="width: 50%;padding:1%">&nbsp;</td>
            <td style="width:50%;padding: 5px;font-weight: 600;">Tổng tiền (VNĐ)<span style="float: right;">{total_price}</span></td>
        </tr>
    </tbody>
</table>

<footer style="page-break-after: always">.</footer>

<div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
`,
    K57: `<div style="padding:5% 5% 5% 1%; font-size:0.75em;font-family:tahoma;">
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em;">
        <tbody>
            <tr>
                <td style="width:50%; float:left;padding-left:2%">
                <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em">
                    <tbody>
                        <tr>
                            <td><span style="font-family:tahoma,geneva,sans-serif;">{store_name}</span></td>
                        </tr>
                        <tr>
                            <td>{store_address}</td>
                        </tr>
                        <tr>
                            <td>{store_phone_number}</td>
                        </tr>
                    </tbody>
                </table>
                </td>
            </tr>
        </tbody>
    </table>
    
    <div style="width: 100%; text-align: center;padding:10px 0 0  10px;font-size:0.8em"><strong>ĐƠN NHẬP HÀNG</strong></div>
    
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em; border-bottom-width: 2px; border-bottom-style: dotted;">
        <tbody>
            <tr>
                <td style="width: 40%;">Mã đơn nhập: {purchase_order_code}</td>
                <td style="text-align: right;">Ngày: {created_on}</td>
            </tr>
            <tr>
                <td colspan="2">Nhà cung cấp: {supplier_name}</td>
            </tr>
            <tr>
                <td colspan="2">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em">
        <tbody>
            <tr>
                <td style="width: 25%; border-bottom:1px solid #7a7676; padding: 1% 0px;"><strong>Tên sản phẩm</strong></td>
                <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>SL</strong></td>
                <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: right;padding:1% 0"><strong>Giá nhập</strong></td>
                <td style="width: 25%;border-bottom:1px solid #7a7676; text-align: right;padding:1% 0"><strong>Thành tiền</strong></td>
            </tr>
            <!--<products>-->
            <tr>
                <td style="border-bottom:1px solid #7a7676;padding:1% 0">{line_variant_name}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_quantity}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: right;padding:1% 0">{line_price}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: right;padding:1% 0">{line_amount}</td>
            </tr>
            <!--</products>-->
        </tbody>
    </table>
    
    <div>&nbsp;</div>
    
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em ">
        <tbody>
            <tr>
                <td style="width: 50%;padding:1% 0">Tổng số lượng:</td>
                <td style="text-align: right;padding:1% 0">{total_quantity}</td>
            </tr>
            <tr>
                <td style="padding:1% 0">Tổng tiền hàng:</td>
                <td style="text-align: right;padding:1% 0">{total}</td>
            </tr>
            <tr>
                <td style="padding:1% 0"><strong>Tổng thuế:</strong></td>
                <td style="text-align: right;padding:1% 0">{total_tax}</td>
            </tr>
            <tr>
                <td style="padding:1% 0">Tổng tiền:</td>
                <td style="text-align: right;padding:1% 0">{total_price}</td>
            </tr>
        </tbody>
    </table>

    <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán trưởng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Trưởng ban kiểm kê </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
   
    </div>
    
 
    </div>
    
    <footer style="page-break-after: always">.</footer>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
    `,
    K80: `<div style="padding:5% 5% 5% 1%; font-size:0.8em;font-family:tahoma;">
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.8em;">
        <tbody>
            <tr>
                <td style="width:50%; float:left;padding-left:2%">
                <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.8em">
                    <tbody>
                        <tr>
                            <td><span style="font-family:tahoma,geneva,sans-serif;">{store_name}</span></td>
                        </tr>
                        <tr>
                            <td>{store_address}</td>
                        </tr>
                        <tr>
                            <td>{store_phone_number}</td>
                        </tr>
                    </tbody>
                </table>
                </td>
            </tr>
        </tbody>
    </table>
    
    <div style="width: 100%; text-align: center;padding:10px 0 0  10px;font-size:1em"><strong>ĐƠN NHẬP HÀNG</strong></div>
    
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.8em; border-bottom-width: 2px; border-bottom-style: dotted;">
        <tbody>
            <tr>
                <td style="width: 40%;">Mã đơn nhập: {purchase_order_code}</td>
                <td style="text-align: right;">Ngày: {created_on}</td>
            </tr>
            <tr>
                <td colspan="2">Nhà cung cấp: {supplier_name}</td>
            </tr>
            <tr>
                <td colspan="2">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.8em">
        <tbody>
            <tr>
                <td style="width: 25%; border-bottom:1px solid #7a7676; padding: 1% 0px;"><strong>Tên sản phẩm</strong></td>
                <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>SL</strong></td>
                <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: right;padding:1% 0"><strong>Giá nhập</strong></td>
                <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: right;padding:1% 0"><strong>Thành tiền</strong></td>
            </tr>
            <!--<products>-->
            <tr>
                <td style="border-bottom:1px solid #7a7676;padding:1% 0">{line_variant_name}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_quantity}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: right;padding:1% 0">{line_price}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: right;padding:1% 0">{line_amount}</td>
            </tr>
            <!--</products>-->
        </tbody>
    </table>
    
    <div>&nbsp;</div>
    
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.8em ">
        <tbody>
            <tr>
                <td style="width: 50%;padding:1% 0">Tổng số lượng:</td>
                <td style="text-align: right;padding:1% 0">{total_quantity}</td>
            </tr>
            <tr>
                <td style="padding:1% 0">Tổng tiền hàng:</td>
                <td style="text-align: right;padding:1% 0">{total}</td>
            </tr>
            <tr>
                <td style="padding:1% 0"><strong>Tổng thuế:</strong></td>
                <td style="text-align: right;padding:1% 0">{total_tax}</td>
            </tr>
            <tr>
                <td style="padding:1% 0">Tổng tiền:</td>
                <td style="text-align: right;padding:1% 0">{total_price}</td>
            </tr>
        </tbody>
    </table>
    
    <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán trưởng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Trưởng ban kiểm kê </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
   
    </div>
    
    </div>
    
    <footer style="page-break-after: always">.</footer>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
    `,
    default:`A4`
}