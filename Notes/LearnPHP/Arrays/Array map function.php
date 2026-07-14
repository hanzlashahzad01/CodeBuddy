<?php
//ye bhi same array walk ki taraha hi  kam karta ha... bus ye kuch na hum ko return zaror karta ha jb ky array walk asia nai karta tha...
//is mia aik sey zayada array ka bhi use kr sekkkhty hain...

//let see...


$num = [1,2,3,4,5];

//ye bhi aik newarray return karta ha...

$newarray = array_map("square",$num);

function square($n){
  return $n*$n;
}

//baki ap is ko diff array ky sath bhi try kr sekhty ho..

echo "<pre>";
print_r($newarray);
echo "</pre>";
 ?>
