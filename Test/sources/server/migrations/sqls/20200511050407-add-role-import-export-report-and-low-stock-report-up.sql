/* Replace with your SQL commands */
INSERT INTO `permission` (`createdAt`,`updatedAt`, `name`, `deletedAt`, `description`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    'report_import_export',
    '0',
    ''
  );
INSERT INTO `permission` (`createdAt`,`updatedAt`, `name`, `deletedAt`, `description`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    'report_low_stock',
    '0',
    ''
  );

INSERT INTO `permission` (`createdAt`,`updatedAt`, `name`, `deletedAt`, `description`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    'setup_branch',
    '0',
    ''
  );
INSERT INTO `permission` (`createdAt`,`updatedAt`, `name`, `deletedAt`, `description`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    'setup_stock',
    '0',
    ''
  );

INSERT INTO `rolepermission` (`createdAt`,`updatedAt`, `type`, `roleId`, `permissionId`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    '2', 
    (SELECT `id` FROM `role` where `name` = 'admin'), 
    (SELECT `id` FROM `permission` where `name` = 'report_import_export')
  );
  
INSERT INTO `rolepermission` (`createdAt`,`updatedAt`, `type`, `roleId`, `permissionId`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    '2', 
    (SELECT `id` FROM `role` where `name` = 'admin'), 
    (SELECT `id` FROM `permission` where `name` = 'report_low_stock')
  );

INSERT INTO `rolepermission` (`createdAt`,`updatedAt`, `type`, `roleId`, `permissionId`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    '2', 
    (SELECT `id` FROM `role` where `name` = 'admin'), 
    (SELECT `id` FROM `permission` where `name` = 'setup_branch')
  );
  
INSERT INTO `rolepermission` (`createdAt`,`updatedAt`, `type`, `roleId`, `permissionId`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    '2', 
    (SELECT `id` FROM `role` where `name` = 'admin'), 
    (SELECT `id` FROM `permission` where `name` = 'setup_stock')
  );