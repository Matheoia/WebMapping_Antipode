<?php

//connexion à la base de données
$link = mysqli_connect('mysql-ctoussaint.alwaysdata.net', '198150', '19Octobre1998', 'ctoussaint_mysqlbdd');

if (!$link) {
  die('Erreur de connexion');
} else {
  //echo 'Succès... ';
}

//permet de récupérer les données que Lilian va m'envoyer sous forme d'un dictionnaire
//exemple
//datafetch : {"lat1": 42, "lat2": 15};
$_réponse = json_decode(file_get_contents('php://input'), true);

//j'obtiens les coordonnées de deux points de chaque emprise : en haut à droite et
//en bas à gauche

$dlat2 = $_réponse['dlat2'];
$glat2 = $_réponse['glat2'];
$dlng2 = $_réponse['dlng2'];
$glng2 = $_réponse['glng2'];


mysqli_set_charset($link, "utf8");

 //requete villes 2e emprise
 $emprise_anti = "SELECT city, latitude, longitude FROM cities WHERE latitude>$glat2 AND latitude<$dlat2 AND longitude>$glng2 AND longitude<$dlng2 LIMIT 5";

 //initialisation de tables pour les tableaux associatifs
 $tab_result_anti = [];

 //initialisation d'un id : de 1 à 5, c'est l'anti-emprise
 //2e emprise
 //ré-initialisation de l'id : de 6 à 10, c'est l'anti emprise
 $id = 1;
 if ($result = mysqli_query($link, $emprise_anti)) {
   while ($ligne = mysqli_fetch_assoc($result)) {
     // $ligne est un tableau associatif
     $tab_result_anti[$id] = $ligne;
     $id +=1;
   }
 } else {
   echo "Erreur de requête de base de données.";
 }

 //renvoyer le résultat
 echo json_encode($tab_result_anti);

 ?>
