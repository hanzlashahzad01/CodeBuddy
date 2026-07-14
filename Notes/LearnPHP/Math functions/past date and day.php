<?php
#mktime ye ap ko past ka day print kr ky dey ga ky kon sa din tha...

//method(hour,minute,second,month,day,year)...gmmktime bhi same mktime ki traha hi work karta ha or is mia uk ka time set hota ha

#let see...

# l sey ye day print karta ha..

echo "Full time & date is : " . date("d-m-y h:i:sa") . "<br><br>";

echo date("l",mktime(0,0,0,01,2004))."<br><br>";

echo date("d-m-y h:i:sa",mktime(0,0,0,01,2004))."<br><br>";

#gmmktime bhi same hi work karta ha....

echo date("l",gmmktime(0,0,0,01,2004))."<br><br>";


 ?>
