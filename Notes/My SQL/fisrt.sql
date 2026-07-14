create table info(
id int not null unique,
name varchar(50) not null,
gender varchar(1) not null,
phone varchar(12) not null unique,
age int not null check(age>=18),
city varchar(15) not null default 'Lahore'
);
