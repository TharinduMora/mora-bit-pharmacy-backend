ALTER TABLE shop
ADD COLUMN createdDate datetime NOT NULL;

UPDATE shop set createdDate = NOW();

ALTER TABLE admin
ADD COLUMN createdDate datetime NOT NULL;

UPDATE admin set createdDate = NOW();

ALTER TABLE product
ADD COLUMN createdDate datetime NOT NULL;

UPDATE product set createdDate = NOW();

ALTER TABLE `pharmacy-db`.`product` 
ADD COLUMN `unit` VARCHAR(45) NOT NULL DEFAULT 'Tablet' AFTER `name`;