<?php
// array values hum ko sari values print karwa dey ga with index jo array mia hn gi or aik new array bana dey ga...

# array unique basically ye array ki same same values ko remove kr deyta ha or aik new unique array banta ha...

//let see...

$color = ["a"=>"red","b"=>"blue","c"=>"green","d"=>"blue"];

//$newarray = array_values($color);

# array unique same value ko delete kr dey ga or aik unique array dey ga...

$newarray = array_unique($color);


echo "<pre>";
print_r($newarray);
echo "</pre>";
 ?>
