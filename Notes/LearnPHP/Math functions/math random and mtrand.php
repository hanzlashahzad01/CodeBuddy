<?php
//random function...(1)random(max,min) (2)mt_rand(max,min) (3) lcg_value()....

//random kio bhi random value print kr dey ga...page refreash ya load py...hum khud bhi set kr sekhty hain kky jasy 0,10

//tak kio bhi random value print kary....mt random bhi same hi work karta ha jo marzi use kr lo...

//lcg_value ye ap 0 or 1 mai sey kio bhi float dy ga...

//let see...

echo rand()."<br>";

echo rand(0,20)."<br>";

//mt_rand wasiy most popular ha...

echo mt_rand()."<br>";

echo rand(0,100)."<br>";

echo lcg_value()."<br>";




 ?>
