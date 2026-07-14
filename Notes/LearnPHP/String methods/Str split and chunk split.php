<?php
//str split basically explode ki tarah hi kam karta ha... method($ ka name ,length)...

$info = "hanzla Shahzad";

//ye aik new array return karta ha...

$newarray = str_split($info,2);

echo "<pre>";
print_r($newarray);
echo "</pre>";

//str chunk ka kam ye ha ky ye string mia kuch bhi add karna ho maltab double codes highphone etc....
//method($ ka name,length  opational ha,end)

$var = "hanzla Shahzad";

$newarray = chunk_split($var,1,"...");

echo $newarray;

 ?>
