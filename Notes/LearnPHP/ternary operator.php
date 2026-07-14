<?php
// this is use for small statements only...
$x=30;

#($x>20)? $z="greater" : $z="smaller";

#another methode to write this...

$z= "value is : " . (($x>20) ? "greater" : "smaller");

#another methode to write this...

#$z= "value is : " . ($x<20 ? "greater" : "smaller");

echo $z;

 ?>
