/* Replace with your SQL commands */

update `permission` set `name` = 'receipt' where `id` = 14;

insert into `permission` (`createdAt`, `updatedAt`, `id`, `name`, `description`, `deletedAt`) values (1582179133790, 1582179133790, 15, 'payment', '', 0);

insert into `rolepermission` 
(`createdAt`, `updatedAt`, `type`, `roleId`, `permissionId`, `createdBy`, `updatedBy`) values 
(1582267787964, 1582267787964, 2, 1, 15, 1, 1),
(1582267787964, 1582267787964, 2, 2, 15, 1, 1),
(1582267787964, 1582267787964, 2, 3, 15, 1, 1),
(1582267787964, 1582267787964, 2, 4, 15, 1, 1);