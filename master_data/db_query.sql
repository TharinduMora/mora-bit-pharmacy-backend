CREATE TABLE shop
(
    id        int          NOT NULL AUTO_INCREMENT,
    status    int          DEFAULT 0,
    email     varchar(255) NOT NULL,
    name      varchar(255) DEFAULT NULL,
    description      varchar(400) DEFAULT NULL,
    image     varchar(255) DEFAULT NULL,
    telephone varchar(255) DEFAULT NULL,
    address   varchar(255) DEFAULT NULL,
    city      varchar(255) DEFAULT NULL,
    longitude float (10,8) NOT NULL,
    latitude  float (10,8) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE admin
(
    id        int          NOT NULL AUTO_INCREMENT,
    shopId    int          DEFAULT 0,
    roleId    int          DEFAULT 0,
    status    int          DEFAULT 0,
    systemAdmin    tinyint(1)          DEFAULT 0,
    userName  varchar(255) NOT NULL,
    password  varchar(255) NOT NULL,
    fullName  varchar(255) DEFAULT NULL,
    image     varchar(255) DEFAULT NULL,
    email     varchar(255) NOT NULL,
    telephone varchar(255) DEFAULT NULL,
    address   varchar(255) DEFAULT NULL,
    city      varchar(255) DEFAULT NULL,
    sessionId varchar(100) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (shopId) REFERENCES shop(id)
);

