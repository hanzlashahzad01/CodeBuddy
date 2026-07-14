<?php
// is mia hum session ko delete karin gaye...

session_start();

//ye function sb value ko unset kary ga yani khatam kr dey ga...

session_unset();

session_destroy();

//ab mia kio msg bhi print kr deyta hn ky session destroy ho gaya ha...

echo "Session is destroy.";
 ?>
