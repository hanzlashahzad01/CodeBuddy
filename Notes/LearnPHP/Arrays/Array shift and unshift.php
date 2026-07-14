<?php

//array_shift first value ko delete karta ha...unshift first ko add karta ha...


$food = ["mango","apple","banana","dates"];

array_shift($food);

array_unshift($food,"lime","guava");

echo "<pre>";

print_r($food);

echo "</pre>";

 ?>
