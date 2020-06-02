/* Replace with your SQL commands */

-- tạo stock_list trong storeconfig
INSERT INTO `storeconfig` (`createdAt`,`updatedAt`,`type`,`value`) VALUES (
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  'stocks_list',
  (
    select concat('{', GROUP_CONCAT(CONCAT('"', id, '":{"0":{"name":"Kho mặc định","address":"","notes":""}}') SEPARATOR ','), '}') 
    from branch
    group by 'all'
  )
);

-- xóa table stock
drop table `stock`;

-- xóa dữ liệu stockId trong các table đang có
-- Phiếu kiểm kho
update `stockcheckcard` set `stockId` = 0;

-- Đơn hàng
update `invoiceproduct` set `stockId` = 0;

-- Trả hàng, nhập hàng
update `importcardproduct` set `stockId` = 0;

-- Trả hàng nhập
update `exportcardproduct` set `stockId` = 0;

-- Phiếu chuyển kho
update `movestockcardproduct` set `stockId` = 0;