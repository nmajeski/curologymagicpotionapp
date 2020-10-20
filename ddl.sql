create table address (id bigint not null, version bigint not null, city varchar(255) not null, order_id bigint not null, state varchar(255) not null, street1 varchar(255) not null, street2 varchar(255) not null, zip varchar(255) not null, primary key (id));
create table order (id bigint generated by default as identity, version bigint not null, email varchar(255) not null, first_name varchar(255) not null, last_name varchar(255) not null, phone varchar(255) not null, quantity integer not null, total varchar(255) not null, primary key (id));
create table payment (id bigint not null, version bigint not null, cc_num varchar(255) not null, exp varchar(255) not null, order_id bigint not null, primary key (id));
alter table address add constraint FKiikv9f4p80l3f18h76w9d06hp foreign key (order_id) references order;
alter table payment add constraint FK458pu56xefty15ugupb46wrin foreign key (order_id) references order;
create table address (id bigint generated by default as identity, version bigint not null, city varchar(255) not null, magic_potion_order_id bigint not null, state varchar(255) not null, street1 varchar(255) not null, street2 varchar(255) not null, zip varchar(255) not null, primary key (id));
create table magic_potion_order (id bigint generated by default as identity, version bigint not null, created_datetime timestamp not null, email varchar(255) not null, first_name varchar(255) not null, fulfilled boolean not null, last_name varchar(255) not null, phone varchar(255) not null, quantity integer not null, total varchar(255) not null, primary key (id));
create table payment (id bigint generated by default as identity, version bigint not null, cc_num varchar(255) not null, exp varchar(255) not null, magic_potion_order_id bigint not null, primary key (id));
alter table address add constraint FKrro4byu6xvgk9wlj7hm26mc3q foreign key (magic_potion_order_id) references magic_potion_order;
alter table payment add constraint FKanspuy0rmo1wxt7jae3sssycv foreign key (magic_potion_order_id) references magic_potion_order;