-- Active: 1737614280833@@127.0.0.1@3306@gameclub

CREATE Table user(
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE
)

INSERT INTO `user` (name) VALUES('1');

SELECT * FROM orderitems;