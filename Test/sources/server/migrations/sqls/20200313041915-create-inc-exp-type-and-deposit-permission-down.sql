/* Replace with your SQL commands */

update `permission` set `name` = 'cashbook' where `name` = 'deposit'; 


DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'income_expense_type');

delete from `permission` where `name` = 'income_expense_type';