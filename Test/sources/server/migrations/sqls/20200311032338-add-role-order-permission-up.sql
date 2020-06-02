/* Replace with your SQL commands */

INSERT INTO `permission` (`createdAt`, `updatedAt`, `name`, `deletedAt`) VALUES (
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  'invoice_order_card',
  '0');

INSERT INTO `permission` (`createdAt`,`updatedAt`,`name`, `deletedAt`) VALUES (
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  'import_order_card',
  '0');

INSERT INTO `rolepermission` ( `createdAt`,`updatedAt`,`type`, `roleId`, `permissionId`) VALUES (
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  '2',
  (SELECT `id` FROM `role` where `name` = 'admin'),
  (SELECT `id` FROM `permission` where `name` = 'invoice_order_card'));

INSERT INTO `rolepermission` ( `createdAt`,`updatedAt`,`type`, `roleId`, `permissionId`) VALUES (
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
  '2',
  (SELECT `id` FROM `role` where `name` = 'admin'),
  (SELECT `id` FROM `permission` where `name` = 'import_order_card'));
    