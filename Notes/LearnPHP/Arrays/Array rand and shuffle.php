<?php
//array random jo ha ye basically ap  array mia kio aik random value print kr dey ga jb bhi ap page ko refreash karo gaye to...

// or array shuffle jb ap page ko refreash karo gaye to ye replace kr deti ha...

//let see...

$color = ['red','green','blue','tan','brown'];

//ye aik new array bana deyta ha...

//hum khud bhi set kr sekhty  hain ky kitni values ko ye random kary as second parameter...warna by default ye aik ko hi run karti ha...

//$newarray = array_rand($color,2);

// or array shuffle jb ap page ko refreash karo gaye to ye replace kr deti ha...

$newarray = shuffle($color);

//ye kio new array nai banta ye usi array ko hi change kr deta ha bus...

shuffle($color);

echo "<pre>";
print_r($color);
echo "</pre>";

//
// echo $color[$newarray[0]] . "<br>";
// echo $color[$newarray[1]];

 ?>
