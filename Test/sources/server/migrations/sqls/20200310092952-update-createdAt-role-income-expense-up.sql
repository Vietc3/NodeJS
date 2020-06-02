/* Replace with your SQL commands */
UPDATE `permission` SET `createdAt` = (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)), 
`updatedAt`= (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)) WHERE `createdAt` is null OR `updatedAt` is null;

UPDATE `rolepermission` SET `createdAt` = (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)), 
`updatedAt`= (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)) WHERE `createdAt` is null OR `updatedAt` is null;