/* Replace with your SQL commands */

SET session group_concat_max_len=18446744073709551615;

-- tạo type "stocks_list" trong store config

INSERT INTO `storeconfig` (`createdAt`,`updatedAt`,`type`,`value`) VALUES (
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  'stocks_list',
  (select concat('{', GROUP_CONCAT(CONCAT('"', id, '":{"0":{"name":"Kho mặc định","address":"","notes":""}}') SEPARATOR ','), '}') from branch group by 'all')
);

-- tạo 5 cột kho stockQuantity có giá trị mặc định là 0 trong table productStock

ALTER TABLE `productstock` 
  ADD `stockQuantity2` double DEFAULT 0,
  ADD `stockQuantity3` double DEFAULT 0,
  ADD `stockQuantity4` double DEFAULT 0,
  ADD `stockQuantity5` double DEFAULT 0,
  ADD `stockQuantity6` double DEFAULT 0;
  
-- tạo column stockId cho các table cần thiết

-- Phiếu kiểm kho
ALTER TABLE `stockcheckcard` ADD `stockId` int(11) DEFAULT NULL;
update `stockcheckcard` set `stockId` = 0;

-- Đơn hàng
ALTER TABLE `invoiceproduct` ADD `stockId` int(11) DEFAULT NULL;
update `invoiceproduct` set `stockId` = 0;

-- Trả hàng, nhập hàng
ALTER TABLE `importcardproduct` ADD `stockId` int(11) DEFAULT NULL;
update `importcardproduct` set `stockId` = 0;

-- Trả hàng nhập
ALTER TABLE `exportcardproduct` ADD `stockId` int(11) DEFAULT NULL;
update `exportcardproduct` set `stockId` = 0;

-- Phiếu chuyển kho
ALTER TABLE `movestockcardproduct` ADD `stockId` int(11) DEFAULT NULL;
update `movestockcardproduct` set `stockId` = 0;
