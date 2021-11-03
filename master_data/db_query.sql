CREATE TABLE shop
(
    id          int          NOT NULL AUTO_INCREMENT,
    status      int          DEFAULT 0,
    email       varchar(255) NOT NULL,
    name        varchar(255) DEFAULT NULL,
    description varchar(400) DEFAULT NULL,
    image       varchar(255) DEFAULT NULL,
    telephone   varchar(255) DEFAULT NULL,
    address     varchar(255) DEFAULT NULL,
    city        varchar(255) DEFAULT NULL,
    longitude   float(10,8)  NOT NULL,
    latitude    float(10,8)  NOT NULL,
    createdDate datetime NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO shop
VALUES (0, 2, 'supershop@smartpharmacy.lk',
        'Super Shop', 'This is the shop for system users', null,
        null, null, null,
        0.0, 0.0,'2020-01-01 00:00:00');

CREATE TABLE admin
(
    id          int          NOT NULL AUTO_INCREMENT,
    shopId      int          DEFAULT 0,
    roleId      int          DEFAULT 0,
    status      int          DEFAULT 0,
    systemAdmin tinyint(1)   DEFAULT 0,
    userName    varchar(255) NOT NULL UNIQUE,
    password    varchar(255) NOT NULL,
    fullName    varchar(255) DEFAULT NULL,
    image       varchar(255) DEFAULT NULL,
    email       varchar(255) NOT NULL,
    telephone   varchar(255) DEFAULT NULL,
    address     varchar(255) DEFAULT NULL,
    city        varchar(255) DEFAULT NULL,
    sessionId   varchar(100) DEFAULT NULL,
    createdDate datetime NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (shopId) REFERENCES shop (id)
);

INSERT INTO admin
VALUES (0, 1, 1, 2, 1,
        'superAdmin', '123456', 'System Admin',
        null, 'superAdmin@smartpharmacy.lk',
        null, null, null, null,'2020-01-01 00:00:00');

CREATE TABLE product
(
    id             int          NOT NULL AUTO_INCREMENT,
    shopId         int          DEFAULT 0,
    status         int          DEFAULT 0,
    stockAvailable tinyint(1)   DEFAULT 0,
    name           varchar(255) NOT NULL,
    unit           varchar(45) NOT NULL,
    description    varchar(255) DEFAULT NULL,
    image          varchar(255) DEFAULT NULL,
    createdDate datetime NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (shopId) REFERENCES shop (id)
);

CREATE TABLE product_inventory
(
    productId         int NOT NULL,
    shopId            int        DEFAULT 0,
    status            int        DEFAULT 0,
    availableQuantity int        DEFAULT 0,
    price             double     DEFAULT 0,
    PRIMARY KEY (productId),
    FOREIGN KEY (shopId) REFERENCES shop (id),
    FOREIGN KEY (productId) REFERENCES product (id)
);

