<?php
//explode function basically ye string ko array mia convert kar deyta ha...method -> explode(separater,$ ka name,limit) limit
//opational hota ha...ky kider value ko print karna ha...
//or implode function array ko string mia convert kr deyta ha...

$info = 'hy i am hanzla Shahzad';

//ye aik newarray return karta ha...

$newarray = explode(" ",$info,5);

echo "<pre>";
print_r($newarray);
echo "</pre>";


//or implode function array ko string mia convert kr deyta ha...


$color = ["red","green","orange","blue"];

$nawarray = implode("-",$color);

echo "<pre>";
print_r($nawarray);
echo "</pre>";



 ?>
