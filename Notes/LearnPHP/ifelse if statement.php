<?php
$per=80;

if ($per>=80 and $per<=100) {
  echo "your are in merit";
}
elseif ($per>=60 && $per<=80) {
  echo "your are in 1st position";
}
elseif ($per>=45 and $per<=60) {
  echo "your are in 2nd position ";
}
elseif ($per>=33 && $per<=45) {
  echo "your are 3rd position";
}
elseif ($per<33) {
  echo "your are fail";
}
else {

  echo "please enter valid percentage";
}

 ?>
