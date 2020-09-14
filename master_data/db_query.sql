CREATE TABLE customers
(
    id     int          NOT NULL AUTO_INCREMENT,
    email  varchar(255) NOT NULL,
    name   varchar(255) DEFAULT NULL,
    active tinyint      DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE shops
(
    id        int          NOT NULL AUTO_INCREMENT,
    email     varchar(255) NOT NULL,
    name      varchar(255) DEFAULT NULL,
    telephone varchar(255) DEFAULT NULL,
    address   varchar(255) DEFAULT NULL,
    city      varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE admin
(
    id        int          NOT NULL AUTO_INCREMENT,
    userName  varchar(255) NOT NULL,
    password  varchar(255) NOT NULL,
    fullName  varchar(255) DEFAULT NULL,
    email     varchar(255) NOT NULL,
    telephone varchar(255) DEFAULT NULL,
    address   varchar(255) DEFAULT NULL,
    city      varchar(255) DEFAULT NULL,
    roleId    int          NOT NULL,
    adminType int          DEFAULT 2,
    status    int          DEFAULT 0,
    PRIMARY KEY (id)
);

