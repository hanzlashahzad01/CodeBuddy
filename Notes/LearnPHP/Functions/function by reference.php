<?php

function first($num)
{
  $num +=5;
}
//& ka  jo sign ha address store karta ha varaible ka...

function second(&$num)
{
  $num +=7;
}

$number=10;
first($number);
echo "original value is $number<br>";


second($number);

echo "original value is $number<br>";
 ?>
