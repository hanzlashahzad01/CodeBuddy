<?php
//array fill key jo hota ye jo array mia values set karty hain un ko key bana deyta ha...

//method...first of all array ka name second value set karty hain jo print karni hoti key ky sath...


//$info = ['a','b','c','d','e','f'];

//ye aik new array return karta ha...

//$newarray = array_fill_keys($info,"testing");

//array_fill basically kisi array kay sath use nai hota ye byself kam karta ha...
//method fisrt kider sey start karna ha second length kitni rekhni ha third value... - mai bhi set  kar sekhty ho ap...

//let see...

$newarray = array_fill(3,6,"hanzla");

echo "<pre>";
print_r($newarray);
echo "</pre>";



 ?>
