/* Replace with your SQL commands */

update `permission` set `name` = 'deposit' where `name` = 'cashbook'; 

INSERT INTO `permission` (`createdAt`,`updatedAt`, `name`, `deletedAt`, `description`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    'income_expense_type',
    '0',
    ''
  );
  
INSERT INTO `rolepermission` (`createdAt`,`updatedAt`, `type`, `roleId`, `permissionId`, createdBy, updatedBy) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    '2', 
    (SELECT `id` FROM `role` where `name` = 'admin'), 
    (SELECT `id` FROM `permission` where `name` = 'income_expense_type'),
    1,
    1
  );