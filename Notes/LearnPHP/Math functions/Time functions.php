<?php
// smaller h sey ap ko current hour bata ha ky kon sa ha...

// 1 sey 12 tak ka jo time hota ha pakistani wo print karta ha...

// ye 1 sey 9 tak sath 0 bhi print karta ha...

echo "Hour is : " . date("h") . "<br>";

//capital H ye 00 ye 24 hours wala time print karta ha...

echo "Hour is : " . date("H") . "<br>";

//smaller g ye hours ky sath 0 print nai karta 1 sey 9 tak ky...

echo "Hour is : " . date("g") . "<br>";

//24 hours waly time mia 0 nai print karta...

echo "Hour is : " . date("G") . "<br>";

//mintues methods...

//smaller i mintues print karta ha...

echo "Mintues is : " . date("i") . "<br>";

//second method...

echo "Seconds  is : " . date("s") . "<br>";

//Meridiem means am or pm...

//smaller a sey small mia print karta ha... capital A sey capital form mia....

echo "Meridiem is : " . date("a") . "<br>";

//capital A sey capital form mia....

echo "Meridiem is : " . date("A") . "<br>";

//full time...

//h hours ky laiya, i mintues ky laiya, s seconds ky laiya, a Meridiem ky laiya

# ye last pr e ka matlab ye ha ky ye bata ha ky ye kis country ka time ha....

echo "Full time  is : " . date("h:i:sa e") . "<br>";

// full time and date...

echo "Full time & date is : " . date("d-m-y h:i:sa") . "<br>";

//ab ye time wrong print kar raha ha ap apny system ka check karo or is ka check karo diff ha ....reason kia ha...

//kiu ky ye jo software yani php hota ha ye jahn pr bana hota ha ye wahn ka hi time by default print karta ha...

//javascript sey ye time saii print krata ha lakin php sey nai...

//is ka aik solution ha aik function ata ha date default timezone set...ap is function mia kisi bhi country ka time dekh

//sekhty hain....us ky laiya ap ko google pr jana ha wahn pr search karna ha php time zone 1 website pr hi click karna

//php.net wali us ko open karo or kisi country ka time zone copy kr ky function mia a ky paste kr deyna...

date_default_timezone_set("Asia/Karachi");

//ab correct time print kary ga...

# ye last pr e ka matlab ye ha ky ye bata ha ky ye kis country ka time ha....

echo "Time is : " . date("h:i:sa e");


 ?>
