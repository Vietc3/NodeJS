/* Replace with your SQL commands */

-- tạo table stock
CREATE TABLE if not exists `stock` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `branchId` int(11) DEFAULT NULL,
  `stockColumnIndex` int(11) DEFAULT 1,
  `address` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `deletedAt` double DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- tạo kho mặc định cho mỗi chi nhánh
INSERT INTO `stock` (`createdAt`,`updatedAt`, `name`, `branchId`, `stockColumnIndex`, `deletedAt`, `createdBy`, `updatedBy`) 
select `createdAt`,`updatedAt`, "Kho mặc định", id as branchId, 1, 0, `createdBy`, `updatedBy`
from branch;

-- xóa stock_list trong storeconfig
delete from `storeconfig` where `type` = 'stocks_list';

-- xóa dữ liệu stockId trong các table đang có
-- Phiếu kiểm kho
update `stockcheckcard` set `stockId` = 1;

-- Đơn hàng
update `invoiceproduct` set `stockId` = 1;

-- Trả hàng, nhập hàng
update `importcardproduct` set `stockId` = 1;

-- Trả hàng nhập
update `exportcardproduct` set `stockId` = 1;

-- Phiếu chuyển kho
update `movestockcardproduct` set `stockId` = 1;

