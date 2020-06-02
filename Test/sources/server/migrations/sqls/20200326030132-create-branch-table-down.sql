/* Replace with your SQL commands */

DROP TABLE branch;

ALTER TABLE `importcard` DROP COLUMN `branchId`;

ALTER TABLE `exportcard` DROP COLUMN `branchId`;

ALTER TABLE `customer` DROP COLUMN `branchId`;

ALTER TABLE `movestockcard` DROP COLUMN `branchId`;

ALTER TABLE `incomeexpensecard` DROP COLUMN `branchId`;

ALTER TABLE `depositcard` DROP COLUMN `branchId`;

ALTER TABLE `manufacturingcard` DROP COLUMN `branchId`;

ALTER TABLE `invoice` DROP COLUMN `branchId`;