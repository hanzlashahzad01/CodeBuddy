<?php
// first method we can use array with loops also....

$colors=["red","blue","green","black"];

echo "<ul>";
for($i=0;$i<4;$i++)
{
  echo"<li>". $colors[$i]."</li>";
}
echo "</ul>";

#second method...

// $colors[0]="red";
// $colors[1]="blue";
// $colors[2]=733.33;
// $colors[3]="black";

#third method...

// echo $colors[0]."<br>";
// echo $colors[1]."<br>";
// echo $colors[2]."<br>";
// echo $colors[3]."<br>";

// print_r()ka kam ye hota ha ky ye bus array ka index or value dono hi return kr dey ga...
//ye pre tag style ky laiya use hota ha...

// echo "<pre>";
// print_r($colors);
// echo "</pre>";

?>
