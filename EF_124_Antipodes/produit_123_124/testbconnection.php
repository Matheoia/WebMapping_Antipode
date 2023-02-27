<?php

// Connexion à la base de données
$dbconn = pg_connect("host=localhost dbname=webMapping user=postgres password=postgres");

$emprise = json_decode(file_get_contents('php://input'), true);

// Récupération des valeurs de latitude et longitude pour l'emprise spécifiée
$lat1 = $emprise['lat1'];
$lat2 = $emprise['lat2'];
$lng1 = $emprise['lng1'];
$lng2 = $emprise['lng2'];

// Requête SQL pour récupérer les 5 villes les plus peuplées dans l'emprise
$query = "SELECT * FROM villewebmap WHERE latitude > $lat1 AND latitude < $lat2 AND longitude > $lng1 AND longitude < $lng2 ORDER BY population DESC LIMIT 5";

// Exécution de la requête
$result = pg_query($dbconn, $query);

// Tableau pour stocker les résultats
$rows = array();

// Affichage des résultats
while ($row = pg_fetch_assoc($result)) {
    $rows[] = $row;
}

echo json_encode($rows);

// Fermeture de la connexion à la base de données
pg_close($dbconn);

?>