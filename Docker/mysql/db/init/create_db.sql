CREATE DATABASE IF NOT EXISTS node_todo;

USE node_todo;

CREATE TABLE user (user_name varchar(50) NOT NULL PRIMARY KEY, 
password varchar(50) NOT NULL);

CREATE TABLE task (task_id int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
user_name varchar(50) NOT NULL,
title varchar(50) NOT NULL,
description char(255) NOT NULL,
required_days int,
deadline date,
FOREIGN KEY fk_username(user_name) REFERENCES user(user_name));

CREATE TABLE task_order (after_task_id int NOT NULL,
before_task_id int NOT NULL,
PRIMARY KEY(after_task_id, before_task_id));