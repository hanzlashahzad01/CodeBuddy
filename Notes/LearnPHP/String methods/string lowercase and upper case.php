<?php

// string writting methods...(1)strtolower ye puri string ko lowercase mia kr dey ga...(2) strtoupper ye upper mia convert

//kr dey ga...(3)ucfirst ye fisrt letter ko capital kr dey ga bus...(4) ucwords ye hr word ky fisrt letter ko

//capital kr dey ga...(5)lcfirst ye fisrt letter ko lower kr dey ga....

$str = "hanzla shahzad";

// ye aik newarray mia store hoti ha...

//$newarray=ucfirst($str);

//$newarray=strtolower($str);

//$newarray=strtoupper($str);

//$newarray=ucwords($str);

$newarray=lcfirst($str);

echo $newarray;

 ?>
