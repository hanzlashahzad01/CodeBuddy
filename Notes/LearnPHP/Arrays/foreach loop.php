<?php

//basically foreach loop jo hota ha  ye array kay sath hi use hota ha ye array  ki hr statement ky laiya run hota ha.....

// $colors=[
//   "red",
//   "green",
//   "blue",
//   "black"
// ];
// //second varaible ap apni marzi ka lay sekhty hain...
//
// foreach($colors as $value){
//   echo $value."<br>";
// }

//example...
// declare associative array....
$ages=[
  "Bill"=>25,
  "gates"=>28,
  "elon"=>22
];
echo "<ul>";
foreach($ages as $element){
  echo "li>".$element."</li>";
}
echo "</ul>";
 ?>
