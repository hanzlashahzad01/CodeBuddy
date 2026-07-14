<?php

//array sum array ki values ko sum karta ha or product multiply karta ha float or integer values ko only...

$num = [12,34.4,855,67.6,34.2,90];

//ye bhi aik array banata ha value store krny kay laiya...

//$newarray = array_sum($num);

// ye array ki float or integer value ko multiply karta ha...

$newarray = array_product($num);

echo "<pre>";
print_r($newarray);
echo "</pre>";

 ?>
