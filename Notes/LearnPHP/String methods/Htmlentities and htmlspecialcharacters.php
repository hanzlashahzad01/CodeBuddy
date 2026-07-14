<?php
//htmlentities ye basically encoding ky laiya use hota ha...ye msg ko encode kr  dey  ga or ye "" ko hi convert karta ha

// " " ko & mia convert kr dey ga...methods(string,flag)...ab flag ki diff types hain...(1)ent_quotes(2)ent no quotes(3)

//htmlspecialchars ye specail char  ko hi encode karta ha ....

//gethtmltablechar ye char ka table dy ga...

// ye sb is liaya hota ha ky kio hacker data ap ka hack na kr sekhy...

//let see...

//ap view source kr ky encode msg ko  dekh  sekhty ho right click kr ky...

//humm kisi bhi link ko bhi encode kr sekhty hain...

          $str="A 'quote' is <b>bold</b>";

          echo $str."<br><br>";

    echo htmlentities($str)."<br>";
    //ye "" ko karta ha...
    echo htmlentities($str,ENT_QUOTES)."<br>";

    echo htmlentities($str,ENT_NOQUOTES)."<br>";

//ab in ko decode krny ky laiya bhi methods hoty hain...

//htmlspecialchars ye special char ko karta ha encode bus....matlab "",<,>ect...

    echo htmlspecialchars($str,ENT_NOQUOTES)."<br>";

    //ye decode krny ky laiya kay use hota ha...

    echo html_entity_decode($str)."<br>";
    //ye specail char ko decode karta ha...

    echo htmlspecialchars_decode($str)."<br>";

//get html translation table ye ap ko all specail chars print kar dey ga jo ap encode ky laiya use krty ho...

echo "<pre>";
print_r(get_html_translation_table(HTML_SPECIALCHARS));
echo "</pre>";

//or ye ap ko complete values dy ga...or sath un ky name bhi bata dy ga...

    echo "<pre>";
    print_r(get_html_translation_table(HTML_ENTITIES));
    echo "</pre>";

 ?>
