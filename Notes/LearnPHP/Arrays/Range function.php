<?php

//yr range ka kam basically ye hota ha ye is mia aik starting point hota ha aik ending point hota ha

//us mia jo jo values ayn gi un ko print kar dey ga....or last pr steps hoty hain ky kitny ka increment karna ha...

//let see...

//ye aik new array return karta ha...

$newarray = range(0,100,10);

echo "<pre>";
print_r($newarray);
echo "</pre>";

//mia is ko loop ky sath bhi use kr sekhta hn...

foreach(range('a','z',2) as $value){
  echo $value . "<br>";
}

 ?>
