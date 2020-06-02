/* Replace with your SQL commands */

DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'report_income_expense');

DELETE FROM `permission` WHERE `name` = 'report_income_expense';