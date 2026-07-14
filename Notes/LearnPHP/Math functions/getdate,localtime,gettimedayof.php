<?php
//getdate ye function ap ko time second month year sb kuch print kr dey ga aik array ki form mai....method(timestamp)...

//timestamp means that purna time jo guzr gaya....us ka bhi ye ap ko time din year sb kuch bata sekhta ha ye function...

//gettimeofday ye bhi ap ko aik array return karta ha....method(return_float) is mai true ya false set karty ho agr ap

//true print karty ho to ye ap ko kio array  print nai karta bus ap ko float mia bata ha...ha false by defaulte hota ha...

//localtime ye local time show karta ha ap ky server ka hi ye bhi aik array return karta ha....

//method(timestamp,is_assco) is_assco mia true ya false likhna ha true sey ye associative form mia print karta ha....

#let see.....

//ye ap ko by default current time day month data ha...ap past ka dekh sekhty hain us ky laiaya hum ko mktime ka use karna hota

//hota ha...

echo "<pre>";
print_r(getdate());
echo "</pre>";

//agr ap chahity hain ky ap ko sirf month dekhna ha ya only time dekhna ha to let see...

$date=getdate();

echo $date['month']." - ".$date['year']."<br>";

echo $date['weekday'];

//agr ap past  ki kio date ya time print karwna chahity hain to ap ko mktime ka use karna ha...

$olddate=mktime(0,0,0,01,01,2004);

//ye ap ko us ka time day sb kuch bata dey ga...

echo "<pre>";
print_r(getdate($olddate));
echo "</pre>";

//agr ap chahity hain ky ap ko sirf month dekhna ha ya only time dekhna ha to let see...


$date=getdate($olddate);

echo $date['month']." - ".$date['year']."<br>";

echo $date['weekday'];

// gettimeofday method....


echo "<pre>";
print_r(gettimeofday());
echo "</pre>";

//agr ap chahity hain ky ap ko sirf secs dekhna ha to let see...

$date=gettimeofday();

echo $date['sec'] ." secs.<br>";

//agr ap true pass krty ho to ye ap ko float mia value print karta ha...

echo gettimeofday(true);

//localtime method....

echo "<pre>";
print_r(localtime());
echo "</pre>";

//ye aik readable form mia nai ho ga...agr readable form mia krana ha to let see...

//true sey ye associative array print karta ha...

echo "<pre>";
print_r(localtime(time(),true));
echo "</pre>";

//agr ap old time dekhna chahity ho to mktime ka use karna....

$olddate=mktime(0,0,0,05,18,2004);

echo "<pre>";
print_r(localtime($olddate,true));
echo "</pre>";

 ?>
