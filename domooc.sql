create table Users(
id varchar(16) not null,
email varchar(40),
nickname varchar(20),
urlsuffix varchar(25),
reqtimes int(8) DEFAULT 0,
primary key(id)
);

create table AddedInfo(
infoid int(8) unsigned not null,
infotext text not null,
loadtimes int(8)  DEFAULT 1,
primary key(infoid)
);

create table QuestionBank(
courseid varchar(20) not null ,
ts  timestamp not null DEFAULT CURRENT_TIMESTAMP(),
giver varchar(120),
giverid varchar(16),
jsonQB mediumtext,
updatetimes int(8)  DEFAULT 1,
curlength int(8) not null,
infoid int(8) unsigned,
reqtimes int(8) DEFAULT 0,
primary key(courseid),
foreign key(infoid) references AddedInfo(infoid),
foreign key(giverid) references Users(id)
);

set character_set_client=utf8;
set character_set_connection=utf8;
set character_set_database=utf8;
set character_set_results=utf8;
set character_set_server=utf8;
set character_set_system=utf8;
set collation_connection=utf8;
set collation_server=utf8;
set collation_database=utf8;

insert into QuestionBank (courseid,giver,jsonQB) values("111","333","444")