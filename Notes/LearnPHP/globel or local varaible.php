<?php
//local and golble varaible....
//local ko  hum bus function mia call kr sekhty hain....or globle ko function kay bahir call karna ha...


//local varaible is ko bahir define nai kr skhty...
// function hy()
//
// {
//   $s=20;
//   echo "hanzla shahzad : $s<br>";
// }
// hy();

//echo "hanzla : $s";   //error


//globel varaible...

$a=10;

function hello()
{
// global ka use kr kay hum global ko as a local bhi use kr sekhyty hain...

  global $a;

  echo "hello boy";
}
hello();
echo "hello boy";
