<?php
//ap is sey furture or past 2 ki date print kr sekhty hain....method(time,timezone) time zone means ky kon sey country ka time

//show karna ha ap ko....

//method date_format(object,format)...

//ye ap ko aik object return karta ha phr us obj ko ap date formate mai print karty hain...

#let see...

$date=date_create("2030-08-19 18:45:00",timezone_open("Asia/Karachi"));

echo date_format($date,"d/m/y h:i:s");

 ?>
