<?php
//ye basically given date ky sath time show karwata ha...method(object,hour,min,sec,milisec)...

//let see...

//phely hum date creat karty hain...

$date=date_create("2015-05-15");

//ab apny function ka use karon ga...

date_time_set($date,13,20);

//ab is ko format set karon ga ky kis format mia ye dekhy mujhy...

echo date_format($date,"d-m-Y H:i:s")."<br><br>";

//ab mia ap ko aik or example dekhta hn kisi or time ky sath...

date_time_set($date,07,25,55);

echo date_format($date,"d-m-Y H:i:s");

 ?>
