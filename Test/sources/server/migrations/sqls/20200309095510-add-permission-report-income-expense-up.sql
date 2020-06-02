/* Replace with your SQL commands */

INSERT INTO `permission` (`name`, `deletedAt`, `description`) 
  VALUES ('report_income_expense', '0', '');

INSERT INTO `rolepermission` ( `type`, `roleId`, `permissionId`) 
  VALUES (
    '2', 
    (SELECT `id` FROM `role` where `name` = 'admin'), 
    (SELECT `id` FROM `permission` where `name` = 'report_income_expense')
  );