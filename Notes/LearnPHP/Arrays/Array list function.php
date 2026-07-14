<?php
//list function basically array ki values ko varaible mai store karwta ha...

//list function index array or associtive array ki numeric values kay liaya hi run hota ha...

$color = ['red','pink','tan'];

list($a,$b,$c) = $color;

echo "value of a : $a <br>";
echo "value of b : $b <br>";
echo "value of c : $c <br>";
 echo "<br>";


// ap is ko associtive array ki numeric value ky sath hi use kr sekhty ho...

$food = [0=>'banana',1=>'orange',2=>"apple"];

list($a,$b,$c) = $food;

echo "value of a : $a <br>";
echo "value of b : $b <br>";
echo "value of c : $c <br>";


 ?>
