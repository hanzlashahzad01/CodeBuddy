<?php

// array reduce basically array ki values ko aik string ban deyta ha... matlab reduce yani kam kr ky aik hi string bana deyta ha line ko...
//ye bhi array walk ki tahara hi kam karta h...

$food = ['lemon','orange','dates','banana'];

//ye bhi aik newarray return karta ha...

//ap is third parametr jo ky intial parametr hota ha wo add kr sekthy ho...

//integer float value bhi kr sekhty ho ap reduce...

$newarray = array_reduce($food,'myfunction',"apple");

function myfunction($n, $m){
  return $n . "-" . $m;
}


echo "<pre>";
print_r($newarray);
echo "</pre>";


 ?>
