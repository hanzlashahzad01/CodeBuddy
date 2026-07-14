<?php
// is ap apna session view kr sekhty hain....

session_start();

//2nd nai likhna bus start karna ha or echo karna ha...


//ab ye array ha or is ka laiya ab print_r ka function use karty hain...


//print_r($_SESSION);


 ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
<?php

if ($_SESSION["favcolor"]) {
  echo "favorite color : ".$_SESSION["favcolor"];
}

//echo "favorite color : ".$_SESSION["favcolor"];

//ap aik hi sath bhut sary session bana skethy hain jasy mia na favcolor ka session banaya ap or bhi bana sekhty hain...

//ye hr bar yehi value dekhy ga....tb tak yehi value dekhy ga jb tak mia is ko destroy nai karta...ap is ki value ko chage bhi kar

//sekhty hain...


 ?>
  </body>
</html>
