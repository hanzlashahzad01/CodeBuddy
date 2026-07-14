<?php
//uuencode bhi md5 ki tarah ap kay password ya msg ko endcode kr dyta ha....diff ye ha md5 mia ap  decode nai kr sekhty
//thy lakin is mia ap decode bhi kr sekhty ho...

//let see...

$str="hanzla shahzad";

$encodestr=convert_uuencode($str)."<br><br>";

echo $encodestr;

//decode...

$decodestr=convert_uudecode($encodestr);

echo $decodestr;

 ?>
