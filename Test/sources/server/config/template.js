module.exports.template = {
    TEMPLATE_INVOICE: {
        A4: `<div style="width: 100%;float: left;font-family:Arial,sans-serif;font-size:13px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex">
        <div style="width: 30%;float: left;">{store_logo}</div>
        
        <div style="width: 35%;float: left;padding-left:10px">
        <div style="padding-bottom: 10px;font-weight: 600;">{store_name}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_address}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_email}</div>
        </div>
        
        <div style="width: 35%;float: right;">
        <div style="text-align: right;padding-bottom: 10px;">Mã đơn hàng: <span style="font-weight: 600">{order_code}</span></div>
        
        <div style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></div>
        </div>
        </div>
        
        <div style="width: 100%">
        <h1 style="font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">Đơn hàng</h1>
        </div>
        
        <table style="width:100%;margin: 0 0 20px;">
            <tbody style="font-family:Arial,sans-serif;font-size:13px;">
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
                <tr style="font-family:Arial,sans-serif;font-size: 12px;font-weight: 600">
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
                <tr style="font-family:Arial,sans-serif;font-size: 12px">
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
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding: 1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Tổng Tiền<span style="float: right;">{total}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">VAT<span style="float: right;">{total_tax}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Chiết khấu<span style="float: right;">{order_discount_value}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;border-bottom: 1px solid #7a7676">
                    <td style="width: 50%;padding:1%;border-bottom: 0;">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #222222;padding: 10px;">Phí giao hàng<span style="float: right;">{delivery_fee}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;font-weight: 600;padding: 10px;">Khách phải trả<span style="float: right;">{total_amount}</span></td>
                </tr>
            </tbody>
        </table>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>`,
        A5: `<div style="width: 100%;float: left;font-family:Arial,sans-serif;font-size:11px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex">
        <div style="width: 30%;float: left;">{store_logo}</div>
        
        <div style="width: 35%;float: left;padding-left:10px">
        <div style="padding-bottom: 10px;font-weight: 600;">{store_name}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_address}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_email}</div>
        </div>
        
        <div style="width: 35%;float: right;">
        <div style="text-align: right;padding-bottom: 10px;">Mã đơn hàng: <span style="font-weight: 600">{order_code}</span></div>
        
        <div style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></div>
        </div>
        </div>
        
        <div style="width: 100%">
        <h1 style="font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">Đơn hàng</h1>
        </div>
        
        <table style="width:100%;margin: 0 0 20px;">
            <tbody style="font-family:Arial,sans-serif;font-size:11px;">
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
                <tr style="font-family:Arial,sans-serif;font-size: 10px;font-weight: 600">
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
                <tr style="font-family:Arial,sans-serif;font-size: 10px">
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
                <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding: 1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Tổng Tiền<span style="float: right;">{total}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">VAT<span style="float: right;">{total_tax}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;">Chiết khấu<span style="float: right;">{order_discount_value}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 11px;border-bottom: 1px solid #7a7676">
                    <td style="width: 50%;padding:1%;border-bottom: 0;">&nbsp;</td>
                    <td style="width: 50%;border-bottom: 1px solid #222222;padding: 10px;">Phí giao hàng<span style="float: right;">{delivery_fee}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                    <td style="width: 50%;padding:1%">&nbsp;</td>
                    <td style="width: 50%;font-weight: 600;padding: 10px;">Khách phải trả<span style="float: right;">{total_amount}</span></td>
                </tr>
            </tbody>
        </table>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        K57: `<div style="width: 100%; text-align: center;">
        <div style="max-width:60px;margin-left: calc(50% - 30px);">{store_logo}</div>
        
        <div style="font-family:Arial,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 700;">{store_name}</div>
        
        <div style="font-family:Arial,sans-serif;margin-bottom: 5px;">{store_address}</div>
        
        <div style="font-family:Arial,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;">{store_phone_number}</div>
        
        <div style="font-family:Arial,sans-serif;font-weight: 700;">HÓA ĐƠN BÁN HÀNG</div>
        
        <div style="width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;margin-top: 10px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;">Số: {order_code}</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;">Ngày: {created_on}</div>
        </div>
        
        <div style="text-align: left;font-family:Arial,sans-serif;width: 100%;float: left;padding-bottom: 5px;">Khách hàng: <span style="font-weight: 700">{customer_name}</span></div>
        
        <div style="text-align: left;font-family:Arial,sans-serif;width: 100%;float: left;padding-bottom: 5px;">Điện thoại: <span style="font-weight: 700">{customer_phone_number}</span></div>
        
        <div style="text-align: left;font-family:Arial,sans-serif;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px dashed #222222;width: 100%;float: left;">Địa chỉ: <span style="font-weight: 700;line-height: 16px;">{shipping_address}</span></div>
        
        <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em">
            <tbody>
                <tr>
                    <td style="width: 30%; border-bottom:1px solid #7a7676; text-align: left;padding:1% 0;font-family:Arial,sans-serif;font-size: 9px;"><strong>SL</strong></td>
                    <td style="width: 35%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0;font-family:Arial,sans-serif;font-size: 9px;"><strong>Đơn giá</strong></td>
                    <td style="border-bottom:1px solid #7a7676; text-align: right;padding:1% 0;font-family:Arial,sans-serif;font-size: 9px;"><strong>Thành tiền</strong></td>
                </tr>
                <!--<products>-->
                <tr>
                    <td colspan="3" style="text-align: left;padding:1% 0;font-family:Arial,sans-serif;font-size: 9px;">{line_variant}&nbsp;{serials}</td>
                </tr>
                <tr>
                    <td style="border-bottom:1px dashed #7a7676; text-align: left;padding:1% 0;font-family:Arial,sans-serif;font-size: 9px;">{line_quantity}</td>
                    <td style="border-bottom:1px dashed #7a7676; text-align: center;padding:1% 0;font-family:Arial,sans-serif;font-size: 9px;">{line_price}</td>
                    <td style="border-bottom:1px dashed #7a7676; text-align: right;padding:1% 0;font-family:Arial,sans-serif;font-size: 9px;">{line_amount}</td>
                </tr>
                <!--</products>-->
            </tbody>
        </table>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size:9px;text-align: left;">Cộng tiền hàng</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 9px;text-align: right;">{total}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 9px;text-align: left;">Chiết khấu</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 9px;text-align: right;">{order_discount_value}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-weight: bold;font-size: 9px;">Khách phải trả</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-weight: bold;font-size: 9px;">{total_amount}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-size: 9px;">Tiền khách đưa</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-size: 9px;">{payment_customer}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-size: 9px;">Trả lại</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;">{money_return}</div>
        </div>
        
        <div style="width: 100%;float: left;text-align: center;font-family:Arial,sans-serif;font-size: 9px;margin-top: 10px;font-style: italic;">Cám ơn quý khách. Hẹn gặp lại!</div>
        </div>
        `,
        K80: `<div style="font-family:Arial,sans-serif;font-size: 10px;width: 100%;float:left;margin: 0px !important;">
        <div style="width: 100%; text-align: center;float:left;padding-bottom: 100px">
        <div style="max-width:80px;margin-left: calc(50% - 40px);">{store_logo}</div>
        
        <div style="font-family:Arial,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 600;">{store_name}</div>
        
        <div style="font-family:Arial,sans-serif;margin-bottom: 5px;">{store_address}</div>
        
        <div style="font-family:Arial,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;">{store_phone_number}</div>
        
        <div style="font-family:Arial,sans-serif;font-weight: 600;">HÓA ĐƠN BÁN HÀNG</div>
        
        <div style="width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;margin-top: 10px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;">Số: {order_code}</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;">Ngày: {created_on}</div>
        </div>
        
        <div style="text-align: left;font-family:Arial,sans-serif;width: 100%;float: left;padding-bottom: 5px;">Khách hàng: <span style="font-weight: 600">{customer_name}</span></div>
        
        <div style="text-align: left;font-family:Arial,sans-serif;width: 100%;float: left;padding-bottom: 5px;">Điện thoại: <span style="font-weight: 600">{customer_phone_number}</span></div>
        
        <div style="text-align: left;font-family:Arial,sans-serif;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px dashed #222222;width: 100%;float: left;">Địa chỉ: <span style="font-weight: 600;line-height: 16px;">{shipping_address}</span></div>
        
        <div style="width: 100%;padding-bottom: 5px;border-bottom: 1px solid #222222;font-family:Arial,sans-serif;font-size: 10px;float: left;font-weight: 600;">
        <div style="width:30%;text-align: left;float:left;">SL</div>
        
        <div style="width:35%;text-align: center;float:left;">Đơn giá</div>
        
        <div style="width:35%;text-align: right;float:left;">Thành tiền</div>
        </div>
        <!--<products>-->
        
        <div style="width: 100%;margin-top: 5px;font-family:Arial,sans-serif;font-size: 10px;float: left;text-align: left;line-height: 16px;">{line_variant}</div>
        
        <div style="width: 100%;margin-top: 5px;padding-bottom: 5px;border-bottom: 1px dashed #222222;font-family:Arial,sans-serif;font-size: 9px;float: left;">
        <div style="width:30%;text-align: left;float:left;">{line_quantity}</div>
        
        <div style="width:35%;text-align: center;float:left;">{line_price}</div>
        
        <div style="width:35%;text-align: right;float:left;">{line_amount}</div>
        </div>
        <!--</products>-->
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size:10px;text-align: left;">Cộng tiền hàng</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: right;">{total}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: left;">Chiết khấu</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: right;">{order_discount_value}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-weight: bold;font-size: 10px;">Khách phải trả</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-weight: bold;font-size: 10px;">{total_amount}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-size: 10px;">Tiền khách đưa</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-size: 10px;">{payment_customer}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-size: 10px;">Trả lại</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-size: 10px">{money_return}</div>
        </div>
        
        <div style="width: 100%;float: left;text-align: center;font-family:Arial,sans-serif;font-size: 10px;margin-top: 10px;font-style: italic;">Cám ơn quý khách. Hẹn gặp lại!</div>
        </div>
        </div>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        default:`A4`
    },
    TEMPLATE_INVOICE_RETURN: {
        A4: `<div style="margin:20px">
        <div style="width: 100%;float: left;font-family:Arial,sans-serif;font-size:13px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex">
        <div style="width: 30%;float: left;">{store_logo}</div>
        
        <div style="width: 35%;float: left;padding-left:10px">
        <div style="padding-bottom: 10px;font-weight: 600;">{store_name}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_address}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_email}</div>
        </div>
        
        <div style="width: 35%;float: right;">
        <div style="text-align: right;padding-bottom: 10px;">Mã đơn hàng: <span style="font-weight: 600">{order_code}</span></div>
        
        <div style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></div>
        </div>
        </div>
        
        <div style="width: 100%">
        <h1 style="font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;">Đơn trả hàng</h1>
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
        </div>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        A5: `<div style="margin:20px">
        <div style="width: 100%;float: left;font-family:Arial,sans-serif;font-size:11px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex">
        <div style="width: 30%;float: left;">{store_logo}</div>
        
        <div style="width: 35%;float: left;padding-left:10px">
        <div style="padding-bottom: 10px;font-weight: 600;">{store_name}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_address}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_phone_number}</div>
        
        <div style="padding-bottom: 10px;font-weight: 600;">{store_email}</div>
        </div>
        
        <div style="width: 35%;float: right;">
        <div style="text-align: right;padding-bottom: 10px;">Mã đơn hàng: <span style="font-weight: 600">{order_code}</span></div>
        
        <div style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></div>
        </div>
        </div>
        
        <div style="width: 100%">
        <h1 style="font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;">Đơn trả hàng</h1>
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
        </div>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        K57: `<div style="font-family:Arial,sans-serif;font-size: 9px;margin:0 !important;">
        <div style="width: 100%; text-align: center;">
        <div style="max-width:60px;margin-left: calc(50% - 30px);">{store_logo}</div>
        
        <div style="font-family:Arial,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 700;">{store_name}</div>
        
        <div style="font-family:Arial,sans-serif;margin-bottom: 5px;">{store_address}</div>
        
        <div style="font-family:Arial,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;">{store_phone_number}</div>
        
        <div style="font-family:Arial,sans-serif;font-weight: 700;">ĐƠN TRẢ HÀNG</div>
        
        <div style="width: 100%;float: left;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px solid #222222;margin-top: 10px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;">Số: {order_return_code}</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;">Ngày: {created_on}</div>
        </div>
        
        <div style="width: 100%;padding-bottom: 5px;border-bottom: 1px solid #222222;font-family:Arial,sans-serif;font-size: 9px;float: left;font-weight: 700;">
        <div style="width: 10%;float: left;text-align: left;">SL</div>
        
        <div style="width:30%;text-align: center;float:left;">Mã</div>
        
        <div style="width:30%;text-align: center;float:left;">Giá</div>
        
        <div style="width:30%;text-align: right;float:left;">Thành tiền</div>
        </div>
        <!--<products>-->
        
        <div style="width: 100%;margin-top: 5px;font-family:Arial,sans-serif;font-size: 9px;float: left;text-align: left;line-height: 12px;">{line_variant}</div>
        
        <div style="width: 100%;margin-top: 2px;padding-bottom: 5px;border-bottom: 1px dashed #222222;font-family:Arial,sans-serif;font-size: 9px;float: left;">
        <div style="width:10%;text-align: left;float:left;">{line_quantity}</div>
        
        <div style="width:30%;text-align: center;float:left;">{line_variant_code}</div>
        
        <div style="width:30%;text-align: center;float:left;">{line_price}</div>
        
        <div style="width:30%;text-align: right;float:left;">{line_amount}</div>
        </div>
        <!--</products>-->
        
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
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        K80: `<div style="font-family:Arial,sans-serif;font-size: 10px;margin:0 !important;">
        <div style="width: 100%; text-align: center;">
        <div style="max-width:80px;margin-left: calc(50% - 40px);">{store_logo}</div>
        
        <div style="font-family:Arial,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 700;">{store_name}</div>
        
        <div style="font-family:Arial,sans-serif;margin-bottom: 5px;">{store_address}</div>
        
        <div style="font-family:Arial,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;">{store_phone_number}</div>
        
        <div style="font-family:Arial,sans-serif;font-weight: 700;">ĐƠN TRẢ HÀNG</div>
        
        <div style="width: 100%;float: left;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px solid #222222;margin-top: 10px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;">Số: {order_return_code}</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;">Ngày: {created_on}</div>
        </div>
        
        <div style="width: 100%;padding-bottom: 5px;border-bottom: 1px solid #222222;font-family:Arial,sans-serif;font-size: 10px;float: left;font-weight: 700;">
        <div style="width: 10%;float: left;text-align: left;">SL</div>
        
        <div style="width:30%;text-align: center;float:left;">Mã</div>
        
        <div style="width:30%;text-align: center;float:left;">Giá</div>
        
        <div style="width:30%;text-align: right;float:left;">Thành tiền</div>
        </div>
        <!--<products>-->
        
        <div style="width: 100%;margin-top: 5px;font-family:Arial,sans-serif;font-size: 10px;float: left;text-align: left;line-height: 16px;">{line_variant}</div>
        
        <div style="width: 100%;margin-top: 5px;padding-bottom: 5px;border-bottom: 1px dashed #222222;font-family:Arial,sans-serif;font-size: 10px;float: left;">
        <div style="width:10%;text-align: left;float:left;">{line_quantity}</div>
        
        <div style="width:30%;text-align: center;float:left;">{line_variant_code}</div>
        
        <div style="width:30%;text-align: center;float:left;">{line_price}</div>
        
        <div style="width:30%;text-align: right;float:left;">{line_amount}</div>
        </div>
        <!--</products>-->
        
        <div style="width: 100%;float: left;margin-top: 5px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: left;font-weight: 700;">Tổng số lượng</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: right;">{total_quantity}</div>
        </div>
        
        <div style="width: 100%;float: left;margin-top: 5px;padding-bottom: 30px;">
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-weight: bold;font-size: 10px;">Khách phải trả</div>
        
        <div style="width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-weight: bold;font-size: 10px;">{total_amount}</div>
        </div>
        
        <div style="width: 100%;float: left;font-size:1px;margin-top: 200px;display: block;background: #fff;">.</div>
        </div>
        </div>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        default:`A4`
    },
    TEMPLATE_IMPORT: {
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
                <td>&nbsp;</td>
                <td style="text-align: right;padding-bottom: 10px;">Tham chiếu: <span style="font-weight: 600">{reference}</span></td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                <td><span style="font-weight: 600;padding-bottom: 10px;">{store_email}</span></td>
                <td>&nbsp;</td>
                <td style="text-align: right;padding-bottom: 10px;">Ngày nhận hàng: <span style="font-weight: 600">{received_on}</span></td>
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
                <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thuế </span></td>
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
                <td>&nbsp;</td>
                <td style="text-align: right;padding-bottom: 10px;">Tham chiếu: <span style="font-weight: 600">{reference}</span></td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size: 11px;">
                <td><span style="font-weight: 600;padding-bottom: 10px;">{store_email}</span></td>
                <td>&nbsp;</td>
                <td style="text-align: right;padding-bottom: 10px;">Ngày nhận hàng: <span style="font-weight: 600">{received_on}</span></td>
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
                <td style="padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>Thuế </span></td>
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
    
    <footer style="page-break-after: always">.</footer>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
    `,
        K57: `<div style="padding:5% 5% 5% 1%; font-size:0.75em;font-family:tahoma;">
        <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.75em;">
            <tbody>
                <tr>
                    <td style="width:20%; float:left">{store_logo}</td>
                    <td style="width:77%; float:left;padding-left:2%">
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
                    <td style="width: 40%; border-bottom:1px solid #7a7676; padding: 1% 0px;"><strong>Tên sản phẩm</strong></td>
                    <td style="width: 10%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>SL</strong></td>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Giá nhập</strong></td>
                    <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Thành tiền</strong></td>
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
        
        <div style="width: 100%;font-size:0.75em; text-align: center;padding:10px 0 0  10px;"><em>Cám ơn quý khách. Hẹn gặp lại!</em></div>
        </div>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        K80: `<div style="padding:5% 5% 5% 1%; font-size:0.8em;font-family:tahoma;">
        <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.8em;">
            <tbody>
                <tr>
                    <td style="width:20%; float:left">{store_logo}</td>
                    <td style="width:77%; float:left;padding-left:2%">
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
                    <td style="width: 40%; border-bottom:1px solid #7a7676; padding: 1% 0px;"><strong>Tên sản phẩm</strong></td>
                    <td style="width: 10%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>SL</strong></td>
                    <td style="width: 25%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Giá nhập</strong></td>
                    <td style="border-bottom:1px solid #7a7676; text-align: center;padding:1% 0"><strong>Thành tiền</strong></td>
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
        
        <div style="width: 100%;font-size:0.8em; text-align: center;padding:10px 0 0  10px;"><em>Cám ơn quý khách. Hẹn gặp lại!</em></div>
        </div>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        default:`A4`
    },
    TEMPLATE_INCOMEEXPONSE_RECEIPT: {
        A4: `<div style="margin:50px;font-family:Arial,sans-serif;font-size: 13px;">
        <div style="width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;">
        <div style="width: 50%;float:left;text-align: left;">
        <div style="padding-bottom: 5px;font-weight: 600;">{store_name}</div>
        
        <div style="font-weight: 600;padding-bottom: 5px;">{store_address}</div>
        
        <div style="font-weight: 600;padding-bottom: 5px;">{store_phone_number}</div>
        
        <div style="font-weight: 600;padding-bottom: 5px;">{store_email}</div>
        </div>
        
        <div style="width: 50%;float:right;text-align: right;">
        <div style="padding-bottom: 5px;">Số: <span style="font-weight: 600;">{receipt_voucher_code}</span></div>
        
        <div style="padding-bottom: 5px;">Ngày ghi nhận: <span style="font-weight: 600;">{issued_on}</span></div>
        </div>
        </div>
        
        <div style="width: 100%;float: left;margin-bottom: 10px;">
        <h2 style="font-weight: 600;">Phiếu thu</h2>
        </div>
        &nbsp;
        
        <table cellpadding="0" cellspacing="0" style="width:100%">
            <tbody>
                <tr>
                    <td style="padding:5px;width:30%">Họ tên người nộp</td>
                    <td style="padding:5px;width:70%;font-weight: 600">: {object_name}</td>
                </tr>
                <tr>
                    <td style="padding:5px;width:30%">Địa chỉ</td>
                    <td style="padding:5px;width:70%;font-weight: 600">: {object_address}</td>
                </tr>
                <tr>
                    <td style="padding:5px;width:30%">Số điện thoại</td>
                    <td style="padding:5px;width:70%;font-weight: 600">: {object_phone_number}</td>
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
        <div style="padding-bottom: 5px;">Số: <span style="font-weight: 600;">{receipt_voucher_code}</span></div>
        
        <div style="padding-bottom: 5px;">Ngày ghi nhận: <span style="font-weight: 600;">{issued_on}</span></div>
        </div>
        </div>
        
        <div style="width: 100%;float: left;margin-bottom: 10px;">
        <h2 style="font-weight: 600;">Phiếu thu</h2>
        </div>
        &nbsp;
        
        <table cellpadding="0" cellspacing="0" style="width:100%">
            <tbody>
                <tr>
                    <td style="padding:5px;width:30%">Họ tên người nộp</td>
                    <td style="padding:5px;width:70%;font-weight: 600">: {object_name}</td>
                </tr>
                <tr>
                    <td style="padding:5px;width:30%">Địa chỉ</td>
                    <td style="padding:5px;width:70%;font-weight: 600">: {object_address}</td>
                </tr>
                <tr>
                    <td style="padding:5px;width:30%">Số điện thoại</td>
                    <td style="padding:5px;width:70%;font-weight: 600">: {object_phone_number}</td>
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
    },
    TEMPLATE_INCOMEEXPONSE_PAYMENT: {
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
        <h2 style="font-weight: 600;">Phiếu chi</h2>
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
                    <td style="padding:5px;width:30%">Số điện thoại</td>
                    <td style="padding:5px;width:70%;font-weight: 600">: {object_phone_number}</td>
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
        <h2 style="font-weight: 600;">Phiếu chi</h2>
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
                    <td style="padding:5px;width:30%">Số điện thoại</td>
                    <td style="padding:5px;width:70%;font-weight: 600">: {object_phone_number}</td>
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
    },
    TEMPLATE_IMPORT_RETURN: {
        A4: `<div style="margin:20px">
        <div style="width: 100%">
        <h1 style="font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;font-weight: 600">Phiếu hoàn trả nhà cung cấp</h1>
        
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
                    <td style="width:50%;padding: 3px;">Tổng số lượng<span style="float: right;font-weight: 400;">{total_quantity}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:3px">&nbsp;</td>
                    <td style="width:50%;padding: 3px;">Giá trị hàng trả<span style="float: right;font-weight: 400;">{total_amount}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:3px">&nbsp;</td>
                    <td style="width:50%;padding: 3px;">Chi phí hoàn trả<span style="float: right;font-weight: 400;">{total_landed_costs}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:3px">&nbsp;</td>
                    <td style="width:50%;padding: 3px;">Thuế<span style="float: right;font-weight: 400;">{total_tax}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:3px">&nbsp;</td>
                    <td style="width:50%;padding: 3px;">Chiết khấu<span style="float: right;font-weight: 400;">{total_discounts}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:3px">&nbsp;</td>
                    <td style="width:50%;padding: 3px;">Tổng giá trị hàng trả<span style="float: right;font-weight: 400;">{total_price}</span></td>
                </tr>
                <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                    <td style="width: 50%;padding:3px">&nbsp;</td>
                    <td style="width:50%;padding: 3px;">Tiền NCC hoàn lại<span style="float: right;font-weight: 400;">{transaction_refund_amount}</span></td>
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
        
        <table style="width:100%">
            <tbody>
                <tr>
                    <td style="width: 50%;">&nbsp;</td>
                    <td style="width: 50%;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="width: 50%;padding:1%;text-align:center"><strong>Nhà cung cấp</strong></td>
                    <td style="width: 50%;padding:1%;text-align:center"><strong>Người lập</strong></td>
                </tr>
            </tbody>
        </table>
        </div>
        
        <footer style="page-break-after: always">.</footer>
        
        <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>
        `,
        A5: null,
        K57: null,
        K80: null,
        default:`A4`
    }
};