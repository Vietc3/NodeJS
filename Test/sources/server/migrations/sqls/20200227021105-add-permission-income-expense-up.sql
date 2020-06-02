/* Replace with your SQL commands */

update `permission` set `name` = 'income_expense' where `id` = 14;

delete from `permission` where `id` = 15;

delete from `rolepermission` where `permissionId` = 15;