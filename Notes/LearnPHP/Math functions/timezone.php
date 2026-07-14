<?php
//default time zone set ye function ko ap ky server ka time show karwata ha....

//let see...

//ab mera ye software europe ka ha to ye europe ka time set ha is py...

echo date_default_timezone_get()."<br><br>";

// set function sey hum khud set kr sekhty hain...

date_default_timezone_set("Asia/Karachi");

echo date_default_timezone_get()."<br><br>";

//time zone open....

//ye bhi time ko set karny ky laiya hi use hota ha....

$tz=timezone_open("Asia/Karachi");

echo timezone_name_get($tz);

// timezone location get...ye ap ko  longitude latitude bata dey ga jis country ka tiem zone ap na set kia ho ga....

echo "<pre>";
print_r(timezone_location_get($tz));
echo "</pre>";

//timezone identifiers list...

echo "<pre>";
print_r(timezone_identifiers_list());
echo "</pre>";

//ye ap ko sb countries  ka timezone dekha dey ga...

//agr kis aik specific country ka timezone dekhna chahity hain to un ky codes hoty hain jasy hum Africa ka dekhna chahity hain
//to 1 likhna ha....2 sey america...or 16 sey asia...ka...

echo "<pre>";
print_r(timezone_identifiers_list(16));
echo "</pre>";
 ?>
