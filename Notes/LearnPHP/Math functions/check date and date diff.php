<?php

//check date check karta ha future or past 2 ki dates ko check kr sekhta ha ky wo aik valid date ha ya nai...

//agr valid ha to 1 print kary ga otherwise false print kary ga...

#let see...


echo checkdate(2,29,2004)."<br><br>";

//ye true is laiya dey raha kiu ky 2004 year jo tha wo aik leap year tha...2024 bhi leap year ha...

echo checkdate(2,29,2024)."<br><br>";


//date_diff ye diff check karta ha dates mia...

//cearte 2 dates by date method...

$date1=date_create("2016-06-24");

$date2=date_create("2016-12-12");

$diff=date_diff($date1,$date2);

//ye ap ko sb kuch time day etc dey dey ga...
echo "<pre>";
print_r($diff);
echo "</pre>";

#agr ap days ka diff chahity hain to ap ko ye method use karna ho ga...

echo $diff->days . "days";

 ?>
