<?php


$emp = [
  [1,"Salman","Salesman",20000],
  [2,"Bilal","Driver",18000],
  [3,"Ahmad","Computer operator",34000],
  [4,"Saeed","Bank Manager",25000],
  [5,"Ikram","Manager",35000]
];

//ap is ko associative array ky sath bhi kr sektyh hain...

//ye list function ka use hum array kay laiya hi use karty hain...
#is mia hum nested loop ki zarorat nai hoti bus aik hi loop kafi hoti ha...

echo "<table border='2px' cellpadding='5px' cellspacing='0px' >";

echo "<tr bgColor='tan'>

<th>ID</th>
<th>Name</th>
<th>Designation</th>
<th>Salary</th>

";

foreach($emp as list($id,$name,$designation,$Salary))
{
  echo "<tr><td bgColor='green'>$id</td> <td bgColor='red'>$name</td> <td bgColor='skyblue'>$designation</td> <td bgColor='orange'>$Salary</td> </tr>";
}
echo "</table>";

echo "<pre>";
print_r($emp);
echo "</pre>";
 ?>
