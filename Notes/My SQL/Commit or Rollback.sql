//commit jo hota ha basically jo bhi value hum update krty hain phr jb hum us ko commit kr dyn to phr wo rollback nai ho sekti...

//rollback means that jo bhi value hum na update ki ho gi us ko change kr dy  ga jo value upadte sey phley thi wo ho jaye gi...

//lakin commit sey phley wali rollback nai ho sekhti.....

//method....

SELECT * FROM information;

commit;

update information set age=18
where id=3;

update information set percentage=92
where id=3;

//ye id 3 ko update kary ga phr commit kary ga phr jb hum is ko rollback karin gaye to commit wali rollback nai ho skehy gi baki

//baki ho jaye gi...

//commit or rollback sirf insert update or delete command ky sath hi use hoti ha....

SELECT * FROM information;


update information set age=18
where id=5;

update information set percentage=82
where id=3;

rollback;

//ab phley ye update ho gi phr rollback...exicute ky laiya 4 button pr click karna ha hr line ko separate separat karna ha exicute...

SELECT * FROM information;


update information set age=18
where id=5;

commit;

update information set percentage=82
where id=4;

rollback;

//ab ye down sey top jaye gi phley rollback ho gi phr update phr jb is ko commit mily ga to ye stop ho jaye ga udhr hi...
