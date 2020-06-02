module.exports.manufacturingStock = {
    A4:`<div style="margin:20px">
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
                <td><span style="font-weight: 600;padding-bottom: 10px;">{store_phone_number}</span></td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size:13px;">
                <td><span style="font-weight: 600;padding-bottom: 10px;">{store_email}</span></td>
            </tr>
        </tbody>
    </table>

    <div style="width: 100%">
    <h1 style="font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">PHIẾU SẢN XUẤT</h1>
    </div>

    <table>
    <tr style="font-family:Arial,sans-serif;font-size:13px;">
    <td style="text-align: right;padding-bottom: 10px;">Mã phiếu: <span style="font-weight: 600">{order_code}</span></td>
    <td style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></td>
    </tr>
    </table>

    <div style="width: 100%">
    <span style="font-weight: 600;text-align: left;padding-top: 10px;">1. Thành phẩm </span>
    </div>

    <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
        <tbody>
            <tr style="font-family:Arial,sans-serif;font-size: 12px;font-weight: 600">
                <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span> STT </span></td>
                <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Mã thành phẩm </span></td>
                <td style="padding: 1%; width: 50%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Tên thành phẩm </span></td>
                <td style="padding: 1%; width: 20%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Số lượng </span></td>
            </tr>
            <!--<finishedProducts>-->
            <tr style="font-family:Arial,sans-serif;font-size: 12px">
                <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span>{line_stt} </span></td>
                <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_code} </span></td>
                <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_name} </span></td>
                <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity} </span></td>
            </tr>
            <!--</finishedProducts>-->
        </tbody>
    </table>

    <div style="width: 100%">
    <span style="font-weight: 600;text-align: left;padding-top: 10px;">2. Định mức nguyên vật liệu </span>
    </div>
    <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
    <tbody>
        <tr style="font-family:Arial,sans-serif;font-size: 12px;font-weight: 600">
            <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span> STT </span></td>
            <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Mã nguyên vật liệu </span></td>
            <td style="padding: 1%; width: 50%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Tên nguyên vật liệu </span></td>
            <td style="padding: 1%; width: 20%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Số lượng </span></td>
        </tr>
        <!--<materials>-->
        <tr style="font-family:Arial,sans-serif;font-size: 12px">
            <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span>{line_stt_material} </span></td>
            <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_code_material} </span></td>
            <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_name_material} </span></td>
            <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity_material} </span></td>
        </tr>
        <!--</materials>-->
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
                <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;font-weight: 600;">Tổng số lượng<span style="float: right;">{total_quantity}</span></td>
            </tr>
        </tbody>
    </table>
    <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Bộ phận yêu cầu </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Bộ phận sản xuất </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Trưởng phòng kế hoạch </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
   
    </div>
    
    <footer style="page-break-after: always">.</footer>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>`,
    A5:`<div style="margin:20px">

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
        </tbody>
    </table>

    <div style="width: 100%">
    <h1 style="font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;">PHIẾU SẢN XUẤT</h1>
    </div>

    <table>
    <tr style="font-family:Arial,sans-serif;font-size:13px;">
    <td style="text-align: right;padding-bottom: 10px;">Mã phiếu: <span style="font-weight: 600">{order_code}</span></td>
    <td style="text-align: right;padding-bottom: 10px;">Ngày tạo: <span style="font-weight: 600">{created_on}</span></td>
    </tr>
    </table>

    <div style="width: 100%">
    <span style="font-weight: 600;text-align: left;padding-top: 10px;">1. Thành phẩm </span>
    </div>

    <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
        <tbody>
            <tr style="font-family:Arial,sans-serif;font-size: 12px;font-weight: 600">
                <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span> STT </span></td>
                <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Mã thành phẩm </span></td>
                <td style="padding: 1%; width: 50%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Tên thành phẩm </span></td>
                <td style="padding: 1%; width: 20%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Số lượng </span></td>
            </tr>
            <!--<finishedProducts>-->
            <tr style="font-family:Arial,sans-serif;font-size: 12px">
                <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span>{line_stt} </span></td>
                <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_code} </span></td>
                <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_name} </span></td>
                <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity} </span></td>
            </tr>
            <!--</finishedProducts>-->
        </tbody>
    </table>

    <div style="width: 100%">
    <span style="font-weight: 600;text-align: left;padding-top: 10px;">2. Định mức nguyên vật liệu </span>
    </div>
    <table cellpadding="0" cellspacing="0" style="width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676">
    <tbody>
        <tr style="font-family:Arial,sans-serif;font-size: 12px;font-weight: 600">
            <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span> STT </span></td>
            <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Mã nguyên vật liệu </span></td>
            <td style="padding: 1%; width: 50%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Tên nguyên vật liệu </span></td>
            <td style="padding: 1%; width: 20%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span> Số lượng </span></td>
        </tr>
        <!--<materials>-->
        <tr style="font-family:Arial,sans-serif;font-size: 12px">
            <td style="padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;"><span>{line_stt_material} </span></td>
            <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_code_material} </span></td>
            <td style="padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_variant_name_material} </span></td>
            <td style="padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;"><span>{line_quantity_material} </span></td>
        </tr>
        <!--</materials>-->
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
                <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;font-weight: 600;">Tổng số lượng thành phẩm: <span style="float: right;">{total_quantity}</span></td>
            </tr>
            <tr style="font-family:Arial,sans-serif;font-size: 13px;">
                <td style="width: 50%;padding:1%">&nbsp;</td>
                <td style="border-bottom: 1px solid #7a7676; width:50%;padding: 5px;font-weight: 600;">Tổng số lượng nguyên vật liệu:<span style="float: right;">{total_quantity_material}</span></td>
            </tr>
        </tbody>
    </table>
    <div style="text-align: right;width: 100%;padding-top: 40px;">Ngày... Tháng... Năm...</div>
    
    <div style="width: 100%;float: left;padding-top: 20px;">
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Bộ phận yêu cầu </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Bộ phận sản xuất </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Trưởng phòng kế hoạch </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
    
    <div style="width: 25%;float: left;text-align: center;"><span style="font-weight: 600;padding-bottom: 5px;">Giám đốc </span> <span style="display: block;"> (ký,ghi rõ họ tên) </span></div>
   
    </div>
    </div>
    </div>
    
    <footer style="page-break-after: always">.</footer>
    
    <div id="eJOY__extension_root" style="all: unset;">&nbsp;</div>`,
    K57: null,
    K80: null,
    default:`A4`
}