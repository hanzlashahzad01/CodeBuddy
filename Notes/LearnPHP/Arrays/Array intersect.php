<?php

//array intersect basically ye common values ko print karta ha jo common hoti hain array mia...

//array intersect key ye same key waly ko print karta ha......

//array intersect associative ye key or value dono ko  print karta ha jo smae hoti hain...

# array intersect uassoc ye basically user define function hota ha is mia hum aik function ko as parametr use karty hain or phr function bana
//kr values ko print karty hain....

// ye itna importan nai ha fisrt three most popular just focus on it...

$color1 = ["a"=>"red","b"=>"yellow","c"=>"black","d"=>"pink"];

$color2 = ["a"=>"purple","b"=>"yellow","g"=>"royalblue"];

//$color3 = ["a"=>"green","i"=>"tan","j"=>"yellow"];

// ye aik new array return karta  ha or ye case sensitive hota ha...
//lets see...


//ye bus same values ko hi combine karta ha na kay keys ko...

//$newarray = array_intersect($color1,$color2,$color3);

//ye same key waly ko print karta ha agr key same ha value different ha to ye fisrt array ki value ko prefer karta ha...

//$newarray = array_intersect_key($color1,$color2);


//ye kay or value dono ko dekh krr print kary ga agr dono same hain to print kary ga...

$newarray = array_intersect_assoc($color1,$color2);

echo "<pre>";
print_r($newarray);
echo "</pre>";


 ?>
