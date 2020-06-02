module.exports.invoice = {
    A4: `<div style="width: 100%;float: left;font-family:Helvetica,sans-serif;font-size:13px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex">

        
        <div style="width: 50%;float: left;padding-left:10px">
        <div style="padding-bottom: 10px;font-weight: 600;">{store_name}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_address}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_email}</div>
        </div>
        
        <div style="width: 50%;float: right;">
        <div style="text-align: right;padding-bottom: 10px;">Mã đơn hàng: <span style="font-weight: 600">{order_code}</span></div>
        
        <div style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></div>
        </div>
        </div>
        
        <div style="width: 100%">
        <h1 style="font-family:Helvetica,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">HÓA ĐƠN BÁN HÀNG</h1>
        </div>
        
        <table style="width:100%;margin: 0 0 20px;">
            <tbody style="font-family:Helvetica,sans-serif;font-size:13px;">
                <tr>
                    <td style="width: 35%;">&nbsp;</td>
                    <td style="width: 35%;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td style="padding-bottom: 10px;"><span style="font-weight: 600;">Hóa đơn đến:</span></td>
                    <td style="padding-bottom: 10px;"><span style="font-weight: 600;">Giao hàng đến:</span></td>
                    <td style="text-align: right;padding-bottom: 10px;">Điện thoại: <span style="font-weight: 600">{customer_phone_number}</span></td>
                </tr>
                <tr>
                    <td style="padding-bottom: 10px;">{customer_name}</td>
                    <td style="padding-bottom: 10px;">{customer_name}</td>
                    <td style="text-align: right;padding-bottom: 10px;">Email: <span style="font-weight: 600;">{customer_email}</span></td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;line-height: 20px;">{billing_address}</td>
                    <td style="padding-right: 20px;line-height: 20px;">{shipping_address}</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>
        
        <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
            <tbody>
                <tr style="font-family:Helvetica,sans-serif;font-size: 12px;font-weight: 600">
                    <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span>STT </span></td>
                    <td style="padding: 1%; width: 10%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Mã sản phẩm </span></td>
                    <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Tên sản phẩm </span></td>
                    <td style="padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118);"><span>Đơn vị</span></td>
                    <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Số lượng </span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Đơn giá </span></td>
                    <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Chiết khâu </span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thành tiền </span></td>
                </tr>
                <!--<products>-->
                <tr style="font-family:Helvetica,sans-serif;font-size: 12px">
                    <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span>{line_stt}</span></td>
                    <td style="padding: 1%; width: 10%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_code}</span></td>
                    <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant}</span></td>
                    <td style="padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118);"><span>{line_unit}</span></td>
                    <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_price}</span></td>
                    <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_discount_rate}</span></td>
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
                <tr style="font-family:Helvetica,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding: 1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Tổng Tiền<span style="float: right;">{total}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">VAT<span style="float: right;">{total_tax}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Chiết khấu<span style="float: right;">{order_discount_value}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 13px;border-bottom: 1px solid #7a7676">
                    <td style="width: 50%;padding:1%;border-bottom: 0;">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #222222;padding: 10px;">Phí giao hàng<span style="float: right;">{delivery_fee}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;font-weight: 600;padding: 10px;">Khách phải trả<span style="float: right;">{total_amount}</span></td>
                </tr>
            </tbody>
        </table>
        <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
        <div style="width: 100%;float: left;padding-top: 20px;">
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Khách hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người nhận hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Nhân viên kế toán </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
       
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        </div>
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>`,
        A5: `<div style="width: 100%;float: left;font-family:Helvetica,sans-serif;font-size:11px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex">
         
        <div style="width: 50%;float: left;padding-left:10px">
        <div style="padding-bottom: 10px;font-weight: 600;">{store_name}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_address}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_email}</div>
        </div>
        
        <div style="width: 50%;float: right;">
        <div style="text-align: right;padding-bottom: 10px;">Mã đơn hàng: <span style="font-weight: 600">{order_code}</span></div>
        
        <div style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></div>
        </div>
        </div>
        
        <div style="width: 100%">
        <h1 style="font-family:Helvetica,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">HÓA ĐƠN BÁN HÀNG</h1>
        </div>
        
        <table style="width:100%;margin: 0 0 20px;">
            <tbody style="font-family:Helvetica,sans-serif;font-size:11px;">
                <tr>
                    <td style="width: 35%;">&nbsp;</td>
                    <td style="width: 35%;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td style="padding-bottom: 10px;"><span style="font-weight: 600;">Hóa đơn đến:</span></td>
                    <td style="padding-bottom: 10px;"><span style="font-weight: 600;">Giao hàng đến:</span></td>
                    <td style="text-align: right;padding-bottom: 10px;">Điện thoại: <span style="font-weight: 600">{customer_phone_number}</span></td>
                </tr>
                <tr>
                    <td style="padding-bottom: 10px;">{customer_name}</td>
                    <td style="padding-bottom: 10px;">{customer_name}</td>
                    <td style="text-align: right;padding-bottom: 10px;">Email: <span style="font-weight: 600;">{customer_email}</span></td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;line-height: 20px;">{billing_address}</td>
                    <td style="padding-right: 20px;line-height: 20px;">{shipping_address}</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>
        
        <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
            <tbody>
                <tr style="font-family:Helvetica,sans-serif;font-size: 10px;font-weight: 600">
                    <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span>STT </span></td>
                    <td style="padding: 1%; width: 10%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Mã sản phẩm </span></td>
                    <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Tên sản phẩm </span></td>
                    <td style="padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118);"><span>Đơn vị</span></td>
                    <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Số lượng </span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Đơn giá </span></td>
                    <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Chiết khâu </span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thành tiền </span></td>
                </tr>
                <!--<products>-->
                <tr style="font-family:Helvetica,sans-serif;font-size: 10px">
                    <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span>{line_stt}</span></td>
                    <td style="padding: 1%; width: 10%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_code}</span></td>
                    <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant}</span></td>
                    <td style="padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118);"><span>{line_unit}</span></td>
                    <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity}</span></td>
                    <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_price}</span></td>
                    <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_discount_rate}</span></td>
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
                <tr style="font-family:Helvetica,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding: 1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Tổng Tiền<span style="float: right;">{total}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">VAT<span style="float: right;">{total_tax}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Chiết khấu<span style="float: right;">{order_discount_value}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 11px;border-bottom: 1px solid #7a7676">
                    <td style="width: 50%;padding:1%;border-bottom: 0;">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #222222;padding: 10px;">Phí giao hàng<span style="float: right;">{delivery_fee}</span></td>
                </tr>
                <tr style="font-family:Helvetica,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;font-weight: 600;padding: 10px;">Khách phải trả<span style="float: right;">{total_amount}</span></td>
                </tr>
            </tbody>
        </table>
        <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
        <div style="width: 100%;float: left;padding-top: 20px;">
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Khách hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người nhận hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Nhân viên kế toán </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
       
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        </div>
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        K57: `<div style="width: 100%; text-align: center;">
 
        
        <div style="font-family:Helvetica,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 700;">{store_name}</div>
        
        <div style="font-family:Helvetica,sans-serif;margin-bottom: 5px;">{store_address}</div>
        
        <div style="font-family:Helvetica,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;">{store_phone_number}</div>
        
        <div style="font-family:Helvetica,sans-serif;font-weight: 700;">HÓA ĐƠN BÁN HÀNG</div>
        
        <div style="width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;margin-top: 10px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: left;">Số: {order_code}</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: right;">Ngày: {created_on}</div>
        </div>
        
        <div style="text-align: left;font-family:Helvetica,sans-serif;width: 100%;float: left;padding-bottom: 5px;">Khách hàng: <span style="font-weight: 700">{customer_name}</span></div>
        
        <div style="text-align: left;font-family:Helvetica,sans-serif;width: 100%;float: left;padding-bottom: 5px;">Điện thoại: <span style="font-weight: 700">{customer_phone_number}</span></div>
        
        <div style="text-align: left;font-family:Helvetica,sans-serif;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px dashed #222222;width: 100%;float: left;">Địa chỉ: <span style="font-weight: 700;line-height: 16px;">{shipping_address}</span></div>
        
        <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em">
            <tbody>
                <tr>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: left;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;"><strong>Tên sản phẩm</strong></td>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: left;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;"><strong>SL</strong></td>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;"><strong>Đơn giá</strong></td>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: right;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;"><strong>Thành tiền</strong></td>
                </tr>
                <!--<products>-->
                <tr>
                     <td style="border-bottom:1px dashed #7a7676; text-align: left;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;">{line_variant}</td>
                    <td style="border-bottom:1px dashed #7a7676; text-align: left;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;">{line_quantity}</td>
                    <td style="border-bottom:1px dashed #7a7676; text-align: center;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;">{line_price}</td>
                    <td style="border-bottom:1px dashed #7a7676; text-align: right;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;">{line_amount}</td>
                </tr>
                <!--</products>-->
            </tbody>
        </table>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;font-size:9px;text-align: left;">Cộng tiền hàng</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;font-size: 9px;text-align: right;">{total}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;font-size: 9px;text-align: left;">Chiết khấu</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;font-size: 9px;text-align: right;">{order_discount_value}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: left;font-weight: bold;font-size: 9px;">Khách phải trả</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: right;font-weight: bold;font-size: 9px;">{total_amount}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: left;font-size: 9px;">Tiền khách đưa</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: right;font-size: 9px;">{payment_customer}</div>
        </div>
        <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
        <div style="width: 100%;float: left;padding-top: 20px;">
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Khách hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người nhận hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Nhân viên kế toán </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
       
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        </div>
        
        <div style="width: 100%;float: left;text-align: center;font-family:Helvetica,sans-serif;font-size: 9px;margin-top: 10px;font-style: italic;">Cám ơn quý khách. Hẹn gặp lại!</div>
        </div>
        `,
        K80: `<div style="font-family:Helvetica,sans-serif;font-size: 10px;width: 100%;float:left;margin: 0px !important;">
        <div style="width: 100%; text-align: center;float:left;padding-bottom: 100px">
        
        <div style="font-family:Helvetica,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 600;">{store_name}</div>
        
        <div style="font-family:Helvetica,sans-serif;margin-bottom: 5px;">{store_address}</div>
        
        <div style="font-family:Helvetica,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;">{store_phone_number}</div>
        
        <div style="font-family:Helvetica,sans-serif;font-weight: 600;">HÓA ĐƠN BÁN HÀNG</div>
        
        <div style="width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;margin-top: 10px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: left;">Số: {order_code}</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: right;">Ngày: {created_on}</div>
        </div>
        
        <div style="text-align: left;font-family:Helvetica,sans-serif;width: 100%;float: left;padding-bottom: 5px;">Khách hàng: <span style="font-weight: 600">{customer_name}</span></div>
        
        <div style="text-align: left;font-family:Helvetica,sans-serif;width: 100%;float: left;padding-bottom: 5px;">Điện thoại: <span style="font-weight: 600">{customer_phone_number}</span></div>
        
        <div style="text-align: left;font-family:Helvetica,sans-serif;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px dashed #222222;width: 100%;float: left;">Địa chỉ: <span style="font-weight: 600;line-height: 16px;">{shipping_address}</span></div>
        
        <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em">
            <tbody>
                <tr>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: left;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;"><strong>Tên sản phẩm</strong></td>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: left;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;"><strong>SL</strong></td>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;"><strong>Đơn giá</strong></td>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: right;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;"><strong>Thành tiền</strong></td>
                </tr>
                <!--<products>-->
                <tr>
                     <td style="border-bottom:1px dashed #7a7676; text-align: left;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;">{line_variant}</td>
                    <td style="border-bottom:1px dashed #7a7676; text-align: left;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;">{line_quantity}</td>
                    <td style="border-bottom:1px dashed #7a7676; text-align: center;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;">{line_price}</td>
                    <td style="border-bottom:1px dashed #7a7676; text-align: right;padding:1% 0;font-family:Helvetica,sans-serif;font-size: 9px;">{line_amount}</td>
                </tr>
                <!--</products>-->
            </tbody>
        </table>
        
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;font-size:10px;text-align: left;">Cộng tiền hàng</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;font-size: 10px;text-align: right;">{total}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;font-size: 10px;text-align: left;">Chiết khấu</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;font-size: 10px;text-align: right;">{order_discount_value}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: left;font-weight: bold;font-size: 10px;">Khách phải trả</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: right;font-weight: bold;font-size: 10px;">{total_amount}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: left;font-size: 10px;">Tiền khách đưa</div>
        
        <div style="width: 50%;float:left;font-family:Helvetica,sans-serif;text-align: right;font-size: 10px;">{payment_customer}</div>
        </div>
        
        <div style="width: 100%;float: left;text-align: center;font-family:Helvetica,sans-serif;font-size: 10px;margin-top: 10px;font-style: italic;">Cám ơn quý khách. Hẹn gặp lại!</div>
        </div>
        </div>
        <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
        <div style="width: 100%;float: left;padding-top: 20px;">
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Khách hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Người nhận hàng </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Thủ kho </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Nhân viên kế toán </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
       
        <div style="width: 20%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
        </div>
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        default:`A4`
}