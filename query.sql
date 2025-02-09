-- Active: 1737614280833@@127.0.0.1@3306@gameclub

CREATE DATABASE gameclub;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM("admin", "user") DEFAULT "user",
    isActive BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE orders(
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    totalSum FLOAT NOT NULL,
    payment VARCHAR(255) NOT NULL,
    payStatus ENUM("paid", "pending", "unpaid") NOT NULL,
    Foreign Key (userId) REFERENCES users(id)
);

CREATE TABLE product(
    id INT AUTO_INCREMENT PRIMARY KEY,
    compNumber INT NOT NULL UNIQUE,
    price FLOAT NOT NULL,
    compType VARCHAR(255) NOT NULL,
    status BOOLEAN NOT NULL,
    image VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE orderitems(
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    vipTime BOOLEAN NOT NULL DEFAULT FALSE,
    summa FLOAT NOT NULL,
    roomId INT NULL,
    Foreign Key (orderId) REFERENCES orders(id),
    Foreign Key (productId) REFERENCES product(id),
    Foreign Key (roomId) REFERENCES room(id)
);

CREATE TABLE room(
    id INT AUTO_INCREMENT PRIMARY KEY,
    roomNumber INT NOT NULL UNIQUE,
    countComps INT NOT NULL,
    price FLOAT NOT NULL,
    status BOOLEAN NOT NULL,
    image VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

SELECT * FROM users;

DROP Table room;