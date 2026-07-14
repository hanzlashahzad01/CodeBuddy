<?php
//trim means that ye first last letters ko delete kr deyta ha startting waly....rtrim only right sey ltrim only left sey...
//or trim both sey...aik hota chop ye rtrim ki tarah kam karta ha chop use kr lo ya rtrim...


$str="hanzla shahzad";
echo $str."<br>";
//ye last or first sey hi delete karta yani trim karta ha...

echo trim($str,"ad")."<br>";

//ye right sey karta ha...

echo rtrim($str,"zad")."<br>";

//chop use kr lo ya rtrim...same working hoti ha....

echo chop($str,"zad")."<br>";

//ye left sey  karta ha...

echo ltrim($str,"han");


 ?>
