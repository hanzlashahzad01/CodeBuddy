<?php

$emp = [
  [1,"Salman","Salesman",20000],
  [2,"Bilal","Driver",18000],
  [3,"Ahmad","Computer operator",34000],
  [4,"Saeed","Bank Manager",25000]
];


// echo $emp[1][1] ." ";
// echo $emp[2][3]. " ";
// echo $emp[3][2]. " ";

//is taraha coding ki lenght bhut zayada ho jatai ha is laiya foreach loop k ause krty hain wo in sb print kr dey ga...

echo "<table border='2px' cellpadding='5px' cellspacing='0'>";

  echo "<tr>

    <th bgColor='skyblue'>Emp Id</th>
    <th bgColor='skyblue'>Emp Name</th>
    <th bgColor='skyblue'>Designation</th>
    <th bgColor='skyblue'>Salary</th>

  </tr>";

foreach($emp as $v1){
echo "<tr>";
  foreach($v1 as $v2){
    echo "<td bgColor='tan' >" . $v2  . "</td>";
  }
  echo "</tr>";

}
echo "</table>";


echo "<pre>";
print_r($emp);
echo "</pre>";

 ?>
