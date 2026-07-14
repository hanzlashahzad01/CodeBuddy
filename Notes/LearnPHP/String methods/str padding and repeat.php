<?php
// str pad means padding ye tab use hota jb mia na string ko bara karna hota ha bina kuch  write kiye...

//method->str_pad(string,lenght,pad_string,pad_type)...pad_type 3 hoti hain left right both by default right hoti ha...

// str repeat ye repeat karta ha string ko...

//let see...

$str="hanzla shahzad";

echo str_pad($str, 50, ".*",STR_PAD_BOTH);

// str repeat...

$info="Hanzla shahzad"."<br>";

echo str_repeat($info,115);
 ?>
