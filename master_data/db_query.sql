CREATE TABLE customers
(
    id     int          NOT NULL AUTO_INCREMENT,
    email  varchar(255) NOT NULL,
    name   varchar(255) DEFAULT NULL,
    active tinyint      DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE customers
(
    id        int          NOT NULL AUTO_INCREMENT,
    email     varchar(255) NOT NULL,
    name      varchar(255) DEFAULT NULL,
    telephone varchar(255) DEFAULT NULL,
    address   varchar(255) DEFAULT NULL,
    city      varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
);

