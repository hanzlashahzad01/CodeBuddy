<?php

//array key basically array ki key ko print karta ha...
//
// $food = ["mango","lime","dates","guava"];
//
//
// $newarray = array_keys($food);

# ye basically associative array ky sath use hoti hain...

$color = [
  "fisrt"=>"red",
  "second"=>"blue",
  "third"=>"green"
];

//$newarray = array_keys($color);
//$newarray = array_key_first($color);
//$newarray = array_key_last($color);

// is mia agr key ho gi to 1 print kary ga otherwise null... condition ky sath bhi use kr sekhty ho...

//$newarray = array_key_exists("second",$color);

  // echo "<pre>";
  // print_r($newarray);
  // echo "</pre>";



$newarray = key_exists("third",$color);

if($newarray)
{
  echo "key exist!";
}else {
  echo "key does't exist!";
}



 ?>
