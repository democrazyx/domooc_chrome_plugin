create table User(
id varchar(16) not null,
email varchar(40),
nickname varchar(20),
urlsuffix varchar(25),
reqtimes int(8) DEFAULT 1,
contribution int(8) DEFAULT 0,
primary key(id)
);

create table AddedInfo(
infoid int(8) not null,
infotext text not null,
loadtimes int(8)  DEFAULT 0,
primary key(infoid)
);

create table QuestionBank(
courseid varchar(20) not null,
ts  timestamp not null DEFAULT CURRENT_TIMESTAMP(),
giver varchar(120),
giverid varchar(16),
jsonQB mediumtext,
updatetimes int(8) DEFAULT 0,
curlength int(8) DEFAULT 0,
infoid int(8),
reqtimes int(8) DEFAULT 1,
primary key(courseid),
foreign key(infoid) references AddedInfo(infoid),
foreign key(giverid) references User(id)
);

create table ServerQuizBank(
courseid varchar(20) not null,
termid varchar(20) not null,
sjsonqb mediumtext,
donequiz varchar(1000),
ts  timestamp not null DEFAULT CURRENT_TIMESTAMP(),
primary key(courseid,termid)
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

insert into QuestionBank (courseid,giver,jsonQB) values("111","333","444");
insert into addedinfo(infoid,infotext) values(1,'xxxxx');
insert into addedinfo(infoid,infotext) values(2,'xxxxsxx');
insert into addedinfo(infoid,infotext) values(3,'xxsadfdsxxx');

SET FOREIGN_KEY_CHECKS=0; 
ALTER TABLE addedinfo change infoid infoid int(8);
ALTER TABLE QuestionBank change infoid infoid int(8);
SET FOREIGN_KEY_CHECKS=1;