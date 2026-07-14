<?php
//array flip basicallya array ki values ko flip kar deyta ha matlab ye ky replace kar deta ha key,index ko value kay sath...

//let see...

$name = ['a'=>"Bilal",'b'=>"usaman",'c'=>"nouamn",'d'=>"Anas",'e'=>"hamza"];

//ye aik new array mia ja ky is value store hoti ha....

$newarray = array_flip($name);

//array key case ye basically array ki values ko uppercase or lowercase dono mia print karta ha by default vaule lowercase hoti ha...

//ye key value ko upper orr lower karta ha bus...

$newarray = array_change_key_case($name,CASE_UPPER);


echo "<pre>";
print_r($newarray);
echo "</pre>";
 ?>
