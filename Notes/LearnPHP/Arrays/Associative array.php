<?php

#associative array jo hota ha ye basically array ka index bata ha or jo  array ka index ye integer value mia deyta ha lakin
//associative ki help sey ap aaray ka index string mia dey sekhty hain...

$age = [
  100=>25,
  "Steve"=>"28",
  "gates"=>22
];

//hum array ki value ko bhi change kr sekhty hain us ka index dey kay...
$age["gates"]=50;

echo "<pre>";

//var_dump ka jo function ha ye type bata ha kay int ha string ha....
var_dump($age);

#print_r ye function ha array ka index or value sb bata deyta ha...
//print_r($age);

echo "</pre>";

echo $age[100] . "<br>";
echo $age["Steve"] . "<br>";
echo $age["gates"] . "<br>";
