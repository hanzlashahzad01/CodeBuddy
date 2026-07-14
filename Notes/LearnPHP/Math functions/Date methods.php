<?php

//date methods date kay diff methods hoty hain day ko likhny ky diff ways hain date ko likhny ky diff ways hain or year

//ko bhi....

//#let see....

//date method...

// ye smaller d hota ha ye 0 sey 9 tak jo date hoti ha us ky  sath 0 lagta ha...

echo "Today is : ".date("d")."<br>";

//or ye jo smaller j ha ye kio 0 nai lagta simple date print karta ha.... S ka kam ye hota ha ky ye date ky sath th rd nth etc
//print karta ha...

echo "Today is : ".date("jS")."<br>";

//month methods....

//ye capital F hota ha ye pura month print karta ha  english mai...

echo "Month is : " . date("F") . "<br>";

//smaller m digits mia month bata ha 0 sey 9 tak sath 0 bhi lagta ha...

echo "Month is : " . date("m") . "<br>";

// n ye sath 0 nai lagta...

echo "Month is : " . date("n") . "<br>";

//capital M ye month ko english mia print karta ha lakin first 3 char tak...

echo "Month is : " . date("M") . "<br>";

//year methods...

//capital Y sey digits mia full year bata ha...

echo "Year is : " . date("Y") . "<br>";

//smaller y sey ye 20 nai lagta means simple hi print karta ha year 24, ha ya 25 ha...

echo "Year is : " . date("y") . "<br>";

//print full date...

echo "Full date is : " . date("d/m/Y") . "<br>";

echo "Full date is : " . date("Y-d-m") . "<br>";

echo "Full date is : " . date("d/M/Y") . "<br>";

//week day...

//capital D sey day ko english mia print karta ha 3 char tak...

echo "Week day is : " . date("D") . "<br>";

//smalller l sey full day print karta ha alphabats mai...

echo "Week day is : " . date("l") . "<br>";

//capital N sey digit mia print karta ha....

echo "Week day is : " . date("N") . "<br>";

//ab ap ko pata ha year mia 365 days hoty hain ye function check karta ha aj kon sa din ha...

echo " Year Day is : " . date("z") . "<br>";

//week of the year ye year ky weeks count karta ha...

echo "Week  is : " . date("W") . "<br>";

//smaller t means month mia kitny days hain...

echo "Month day is : " . date("t") . "<br>";

//check this year is leap year or not... 1 print karta ha to leap year ha 0 ha to nai...
//leap year kia ha leap year 4 saal bad ata ha is mai saal mia 366 din hoty hain jasiy feb mia 28 days hoty but
//leap year mia 29 days hoty hain feb mia...ab ye 2024 ha to ye year leap year ha...

echo "This year is leap year : " . date("L") . "<br>";

 ?>
