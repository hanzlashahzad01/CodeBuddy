<?php
//add slahes sey stirng mia slahes add ho jati hain...stripslahes sey slahes remove ho jati hain....ye sirf '' waly mia
// hi slahes add kary ga or addcslashes hoty hain ye hr character ky sath ya selected character mai slahes add kr deyta
//ha or stripcslashes ye remove krta ha slahes ko....

//let see...

$str="hello,i am 'hanzla' shahzad";

echo $str."<br>";
//ye single code waly ko slahes dy ga only...

echo addslashes($str)."<br>";

// stripslahes...ye remove karta ha...

$newstr = addslashes($str)."<br>";

echo stripslashes($newstr);

//addcslashes ye selected character mia slashes add kary ga...

$info=addcslashes($str,"a..z")."<br>";

echo $info;

//stripcslashes ye remove karta ha...

$hello=stripslashes($str,"a..z")."<br>";

echo $hello;
 ?>
