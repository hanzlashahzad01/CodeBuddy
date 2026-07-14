<?php
//strtotime is ka kam ye ha kay ye current date mai  kuch days ya month etc add kar deyta ha.....method strtotime(time)

//strftime ye aik format return karta ha methods(format,time)...

//let see...

echo strtotime("now")."<br><br>";

//ab is sey ap kko saii sey read nia ho raha is ky liaya date ka method use karin gaye....

echo date("d-m-Y",strtotime("now"))."<br><br>";

echo date("d-m-Y H:m",strtotime("+5hours"))."<br><br>";

echo date("d-m-Y H:m",strtotime("+1 week 3 days"))."<br><br>";

echo date("d-m-Y H:m",strtotime("+1 week 3 days 7 hours 5 seconds"))."<br><br>";

echo date("d-m-Y H:m",strtotime("next month"))."<br><br>";

echo date("d-m-Y H:m",strtotime("next monday"))."<br><br>";

//strftime method....

//is mai ap format do gaye ky ap kis format mia date print karna chahity hain...

echo strftime("%B %d %Y, %X %Z")."<br><br>";

//hum kisi or format mia bhi time date show karwa sekhty hain...let see...

//ab mia is purna time show karwna chahita hn to mia mktime ka use karon ga...

echo strftime("%d/%m/%Y %H:%M:%S", mktime(21,30,0,05,18,2005))."<br><br>";

//ye function basically ap ko local time show karta ha jo ap ky server ka hota ha....agr ap ko gmmktime ka time show karna ha to let see..


echo strftime("%d/%m/%Y %H:%M:%S", gmmktime(21,30,0,05,18,2005))."<br><br>";


 ?>
