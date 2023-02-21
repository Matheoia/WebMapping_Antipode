<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Mini projet : base de données</title>
  </head>
  <body>
    <p>Les données de la requête</p>
    <?php

//connexion à la base de données
$link = mysqli_connect('localhost', 'my_user', 'my_password', 'my_db');

if (!$link) {
  die('Erreur de connexion');
} else {
  echo 'Succès... ';
}

//permet de récupérer les données que Lilian va m'envoyer sous forme d'un dictionnaire
//exemple
//datafetch : {"lat1": 42, "lat2": 15};
$_réponse = json_decode(file_get_contents('php://input'), true);

//j'obtiens les coordonnées de deux points de chaque emprise : en haut à droite et
//en bas à gauche

$dlat1 = $_réponse['dlat1'];
$dlat2 = $_réponse['dlat2'];
$glat1 = $_réponse['glat1'];
$glat2 = $_réponse['glat2'];
$dlng1 = $_réponse['dlng1'];
$dlng2 = $_réponse['dlng2'];
$glng1 = $_réponse['glng1'];
$glng2 = $_réponse['glng2'];


mysqli_set_charset($link, "utf8");

//requête pour avoir les villes de la 1ere emprise
$emprise = mysqli_query($link, "SELECT city, latitude, longitude FROM cities WHERE latitude>$glat1 AND latitude<$dlat1 AND longitude>$glng1 AND longitude<$dlng1 LIMIT 5");

 //requete villes 2e emprise
 $emprise_anti = mysqli_query($link, "SELECT city, latitude, longitude FROM cities WHERE latitude>$glat2 AND latitude<$dlat2 AND longitude>$glng2 AND longitude<$dlng2 LIMIT 5");


//initialisation de tables pour les tableaux associatifs
$tab_result = [];

//initialisation d'un id : de 1 à 5, c'est l'emprise et de 6 à 10, c'est l'anti emprise
$id = 1;

  // solution préconisee: extraire des tableaux associatifs.
  //1ere emprise
if ($emprise = mysqli_query($link, $emprise)) {
  while ($ligne = mysqli_fetch_assoc($emprise)) {
    // $ligne est un tableau associatif
    $tab_result[$id] = $ligne;
    $id +=1;
  }
} else {
  echo "Erreur de requête de base de données.";
}

//2e emprise
//ré-initialisation de l'id : de 6 à 10, c'est l'anti emprise
$id = 6;
if ($empriseanti = mysqli_query($link, $empriseanti)) {
  while ($ligne = mysqli_fetch_assoc($empriseanti)) {
    // $ligne est un tableau associatif
    $tab_result[$id] = $ligne;
    $id +=1;
  }
} else {
  echo "Erreur de requête de base de données.";
}

//renvoyer le résultat
echo json_encode($tab_result);

?>

  </body>
</html>
