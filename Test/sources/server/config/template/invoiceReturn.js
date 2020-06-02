
module.exports.invoiceReturn = {
    A4: `<div style="margin:20px">
        <div style="width: 100%;float: left;font-family:Arial,sans-serif;font-size:13px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex">

        <div style="width: 50%;float: left;padding-left:10px">
        <div style="padding-bottom: 10px;font-weight: 600;">{store_name}</div>

        <div style="padding-bottom: 10px;font-weight: 600;">{store_address}</div>

        <div style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</div>

        <div style="padding-bottom: 10px;font-weight: 600;">{store_email}</div>
        </div>

        <div style="width: 50%;float: right;">
        <div style="text-align: right;padding-bottom: 10px;">Mã phiếu trả hàng: <span style="font-weight: 600">{order_code}</span></div>

        <div style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></div>
        </div>
        </div>

        <div style="width: 100%">
        <h1 style="font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;">ĐƠN TRẢ HÀNG</h1>
        </div>

        <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
            <tbody>
                <tr style="font-family:Arial,sans-serif;font-size: 12px;font-weight: 600">
                    <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>STT </span></td>
                    <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Mã sản phẩm </span></td>
                    <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Tên sản phẩm </span></td>
                    <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Đơn vị</span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Số lượng </span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Giá hàng trả </span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thành tiền </span></td>
                </tr>
                <!--<products>-->
                <tr style="font-family:Arial,sans-serif;font-size: 12px">
                    <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>{line_stt}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_code}</span></td>
                    <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_unit}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_price}</span></td>
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
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="border-bottom: 1px solid #222222; width:50%;padding: 5px;font-weight: 600;">Tổng số lượng<span style="float: right;font-weight: 400;">{total_quantity}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width:50%;padding: 5px;font-weight: 600;">Tổng tiền trả khách<span style="float: right;font-weight: 400;">{total_amount}</span></td>
                </tr>
            </tbody>
        </table>
        <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 35%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người trả </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    <div style="width: 30%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán trưởng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    <div style="width: 35%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>

   
    </div>
        </div>

        <footer style="page-break-after: always">.</footer>

        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
    A5: `<div style="margin:20px">
        <div style="width: 100%;float: left;font-family:Arial,sans-serif;font-size:11px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex">
        

        <div style="width: 50%;float: left;padding-left:10px">
        <div style="padding-bottom: 10px;font-weight: 600;">{store_name}</div>

        <div style="padding-bottom: 10px;font-weight: 600;">{store_address}</div>

        <div style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</div>

        <div style="padding-bottom: 10px;font-weight: 600;">{store_email}</div>
        </div>

        <div style="width: 50%;float: right;">
        <div style="text-align: right;padding-bottom: 10px;">Mã phiếu trả hàng: <span style="font-weight: 600">{order_code}</span></div>

        <div style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></div>
        </div>
        </div>

        <div style="width: 100%">
        <h1 style="font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;">ĐƠN TRẢ HÀNG</h1>
        </div>

        <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
            <tbody>
                <tr style="font-family:Arial,sans-serif;font-size: 10px;font-weight: 600">
                    <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>STT </span></td>
                    <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Mã sản phẩm </span></td>
                    <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Tên sản phẩm </span></td>
                    <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Đơn vị</span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Số lượng </span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Giá hàng trả </span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thành tiền </span></td>
                </tr>
                <!--<products>-->
                <tr style="font-family:Arial,sans-serif;font-size: 10px">
                    <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;"><span>{line_stt}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_code}</span></td>
                    <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_unit}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_price}</span></td>
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
                <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="border-bottom: 1px solid #222222; width:50%;padding: 5px;font-weight: 600;">Tổng số lượng<span style="float: right;font-weight: 400;">{total_quantity}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width:50%;padding: 5px;font-weight: 600;">Tổng tiền trả khách<span style="float: right;font-weight: 400;">{total_amount}</span></td>
                </tr>
            </tbody>
        </table>
        <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 35%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người trả </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    <div style="width: 30%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán trưởng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    <div style="width: 35%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>

   
    </div>
        </div>

        <footer style="page-break-after: always">.</footer>

        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
    K57: `<div style="font-family:Arial,sans-serif;font-size: 9px;margin:0 !important;">
        <div style="width: 100%; text-align: center;">

        <div style="font-family:Arial,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 700;">{store_name}</div>

        <div style="font-family:Arial,sans-serif;margin-bottom: 5px;">{store_address}</div>

        <div style="font-family:Arial,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;">{store_phone_number}</div>

        <div style="font-family:Arial,sans-serif;font-weight: 700;">ĐƠN TRẢ HÀNG</div>

        <div style="width: 100%;float: left;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px solid #222222;margin-top: 10px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;">Mã phiếu trả hàng: {order_code}</div>

        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;">Ngày: {created_on}</div>
        </div>


        <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em">
        <tbody>
            <tr>
                <td style="width: 20%; border-bottom:1px solid #7a7676; padding: 1% 0px;"><strong>Tên sản phẩm</strong></td>
                <td style="width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>SL</strong></td>
                <td style="width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Mã</strong></td>
                <td style="width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Giá nhập</strong></td>
                <td style="width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Thành tiền</strong></td>
            </tr>
            <!--<products>-->
            <tr>
                <td style="border-bottom:1px solid #7a7676;padding:1% 0">{line_variant}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_quantity}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_variant_code}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_price}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_amount}</td>
            </tr>
            <!--</products>-->
        </tbody>
    </table>

        <div style="width: 100%;float: left;margin-top: 10px;">
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size:9px;text-align: left;font-weight: 700;">Tổng số lượng</div>

        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 9px;text-align: right;">{total_quantity}</div>
        </div>

        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-weight: bold;font-size: 9px;">Khách phải trả</div>

        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-weight: bold;font-size: 9px;">{total_amount}</div>
        </div>
        </div>
        </div>
        <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 35%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người trả </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    <div style="width: 30%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán trưởng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    <div style="width: 35%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>

   
    </div>
        <footer style="page-break-after: always">.</footer>

        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
    K80: `<div style="font-family:Arial,sans-serif;font-size: 10px;margin:0 !important;">
        <div style="width: 100%; text-align: center;">

        <div style="font-family:Arial,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 700;">{store_name}</div>

        <div style="font-family:Arial,sans-serif;margin-bottom: 5px;">{store_address}</div>

        <div style="font-family:Arial,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;">{store_phone_number}</div>

        <div style="font-family:Arial,sans-serif;font-weight: 700;">ĐƠN TRẢ HÀNG</div>

        <div style="width: 100%;float: left;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px solid #222222;margin-top: 10px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;">Mã phiếu trả hàng: {order_code}</div>

        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;">Ngày: {created_on}</div>
        </div>

        <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em">
        <tbody>
            <tr>
                <td style="width: 20%; border-bottom:1px solid #7a7676; padding: 1% 0px;"><strong>Tên sản phẩm</strong></td>
                <td style="width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>SL</strong></td>
                <td style="width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Mã</strong></td>
                <td style="width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Giá nhập</strong></td>
                <td style="width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Thành tiền</strong></td>
            </tr>
            <!--<products>-->
            <tr>
                <td style="border-bottom:1px solid #7a7676;padding:1% 0">{line_variant}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_quantity}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_variant_code}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_price}</td>
                <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0">{line_amount}</td>
            </tr>
            <!--</products>-->
        </tbody>
    </table>
        

        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: left;font-weight: 700;">Tổng số lượng</div>

        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: right;">{total_quantity}</div>
        </div>

        <div style="width: 100%;float: left;margin-top: 5px;padding-bottom: 30px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-weight: bold;font-size: 10px;">Khách phải trả</div>

        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-weight: bold;font-size: 10px;">{total_amount}</div>
        </div>
        </div>
        </div>
        <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 35%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người trả </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    <div style="width: 30%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Kế toán trưởng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    <div style="width: 35%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>

   
    </div>
        <footer style="page-break-after: always">.</footer>

        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
    default: `A4`
}