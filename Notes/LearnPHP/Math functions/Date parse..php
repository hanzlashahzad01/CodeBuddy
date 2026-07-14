<?php
//date parse ka kam ye hota ha ky ap na date  enter krni hoti ha wo ap ko us date ki sari information dey dey ga...date future or past

//kio bhi ho...method(date)...

#let see....

//ye hum aik associative array return karta ha is laiya print_r ka use karty hian...

echo "<pre>";
print_r(date_parse("2016-06-19 12:33:22"));
echo "</pre>";

//ye  ap sari info print kr dyta ha agr ap ko only  day ya time print karna ha to...

$date=date_parse("2016-06-19 12:33:22");

echo $date['day']."<br>";

echo $date['hour']."<br>";
 ?>
