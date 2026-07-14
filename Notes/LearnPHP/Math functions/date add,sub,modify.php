<?php
//date add kia kam karta ha existing date mai kuch din din add karny hn to use kart hain is ko...

# date sub existing date mia sey days ko subtract karny ka kam karta ha...modify bhi date ko modify karta ha...

//let see...

//ye bhi aik obj return karta ha...

$date=date_create("2024-08-02");

//ye itna function is laiya ha kiu ky ye 2 kam kam kr raha add bhi or string value ko int mia convert bhi kr raha ha...

//for sub...

//date_sub($date,date_interval_create_from_date_string("25days"));

//for add...

//date_add($date,date_interval_create_from_date_string("25days"));


//date modify function...

//is mai ap ko wo itna function use karny ki zarort nai hoti ha ap bus just " " mia days enter karo gaye...agr ap + mia

//days do gaye to ye add kary ga agr - mia deyin gaye to ye subtracy kary ga...

date_modify($date,"10days");

echo date_format($date,"d-m-y");

 ?>
