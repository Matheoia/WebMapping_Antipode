// Initiation des variables
var map;  //Carte 1
var map2;  //Carte 2
var rect1;  //Premier rectangle qui apparaît sur la carte 2, définissant les limites de la carte 1
var rect1_bis;  //Deuxième rectangle qui apparaît sur la carte 2, définissant les limites de la carte 1
var rect2;  //Premier rectangle qui apparaît sur la carte 1, définissant les limites de la carte 2
var rect2_bis;  //Deuxième rectangle qui apparaît sur la carte 1, définissant les limites de la carte 2
//Il y a deux rectangles sur chaque carte car sinon l'affichage ne serait pas correct en passant par le méridien

window.onload = function() {  //Au chargement de la page, la fonction affiche les deux cartes

  L.mapquest.key = 'KWsK0g0pCCuHOK9dp1pZ6uKmLVvZEXmE';  //Récupération de la clé de l'API de Mapquest
  var baseLayer = L.mapquest.tileLayer('satellite');  //Initialisation du mode de carte

  //Fonction pour afficher la carte 1
  function showMap() {
    map = createMap(); //Création de la carte 1
    map.addControl(L.mapquest.control()); //Ajout des touches de contrôle sur la carte 1
    addLayerControl(map);
  }

  //Fonction pour créer la carte 1
  function createMap() {
    map = L.mapquest.map('map1', {
      center: [48.864716, 2.349014], //Définir le point central de vue à la création
      layers: L.mapquest.tileLayer('map'), // L.mapquest.tileLayer('map') is the MapQuest map tile layer
      zoom: 4 //Définir le niveau de zoom
    });
    rect2 = new L.rectangle(map.getBounds(), {color: "#07249f", weight: 1,"fillOpacity": 0});  //Définit le premier rectangle définissant les limites de la carte 2
    rect2.addTo(map); //Ajout de ce rectangle sur la carte 1
    return map; //Renvoie la carte 1
  }

  //Fonction pour afficher la carte 2
  function showMap2() {
    map2 = createMap2(); //Création de la carte 2
    map2.addControl(L.mapquest.control()); //Ajout des touches de contrôle sur la carte 2
    addLayerControl(map2);
  }

  //Fonction pour créer la carte 2
  function createMap2() {
    map2 = L.mapquest.map('map2', {
      center: [-48.864716, 177.650986], //Définir le point central de vue à la création (l'antipode du point central de la carte 1)
      layers: L.mapquest.tileLayer('map'), // L.mapquest.tileLayer('map') is the MapQuest map tile layer
      zoom: 4 //Niveau de zoom
    });
    rect1 = new L.rectangle(map2.getBounds(), {color: "#07249f", weight: 1,"fillOpacity": 0});  //Définit le premier rectangle définissant les limites de la carte 1
    rect1.addTo(map2); //Ajout de ce rectangle sur la carte 2
    return map2; //Renvoie la carte 2
  }

  function addLayerControl(map) { //Ajout des types de couches qui peuvent être affichées
    L.control.layers({
      'Map': L.mapquest.tileLayer('map'),
      'Satellite': L.mapquest.tileLayer('satellite'),
      //'Hybrid': L.mapquest.tileLayer('hybrid'),
      //'Light': L.mapquest.tileLayer('light'),
      //'Dark': baseLayer
    }, {}, { position: 'topleft'}).addTo(map);  //Ajout du bouton de sélection en haut à gauche de la carte
  }

  showMap(); //Afficher la carte 1
  showMap2(); //Afficher la carte 2

  function newViewMap2(){ //Définir une nouvelle vue pour la carte 2
    adjustBounds(); //Ajuster les limites des rectangles affichés
    var NewMapCenter = map.getCenter(); //Récupérer les coordonnées du centre de la carte 1
    var lat =  NewMapCenter.lat; //Latitude de ce centre
    var lng = NewMapCenter.lng; //Longitude de ce centre
    var latAnti = lat*(-1); //Latitude de l'antipode de ce centre
    if (lng>=0) {
      lngAnti = lng-180; //Longitude de l'antipode de ce centre si la longitude est >=0
    }
    else {
      lngAnti = lng+180; //Longitude de l'antipode de ce centre si la longitude est <0
    }
    map2.panTo(L.latLng(latAnti, lngAnti)); //Ajuster l'emprise de la carte 2 sur l'antipode du centre de la carte 1
  }

  function newViewMap(){ //Définir une nouvelle vue pour la carte 1 (pareil que la fonction précédente)
    adjustBounds(); //Ajuster les limites des rectangles affichés
    var NewMapCenter = map2.getCenter(); //Récupérer les coordonnées du centre de la carte 2
    var lat =  NewMapCenter.lat; //Latitude de ce centre
    var lng = NewMapCenter.lng; //Longitude de ce centre
    var latAnti = lat*(-1); //Latitude de l'antipode de ce centre
    if (lng>=0) {
      lngAnti = lng-180; //Longitude de l'antipode de ce centre si la longitude est >=0
    }
    else {
      lngAnti = lng+180; //Longitude de l'antipode de ce centre si la longitude est <0
    }
    map.panTo(L.latLng(latAnti, lngAnti)); //Ajuster l'emprise de la carte 1 sur l'antipode du centre de la carte 2
  }

//Fonction qui actualiste la carte 2 en supprimer tous les rectangles antérieurs et en définissant une nouvelle vue pour la carte 2
  function adjustMap2(){
    supprRect();
    newViewMap2();
  }

  //Fonction qui actualiste la carte 1 en supprimer tous les rectangles antérieurs et en définissant une nouvelle vue pour la carte 1
  function adjustMap(){
    supprRect();
    newViewMap();
  }

  map.on('drag',function dragMap(){ //Event listener lorsque l'on traîne la carte 1 avec la souris
    map.on('move',adjustMap2()); //Lorsque la carte 1 bouge, actualiser la carte 2
    map.off('move',adjustMap2()); //Removes previously added listener function
  })

  map.on('zoom',function zoomMap(){ //Event listener lorsque l'on zoom sur la carte 1
    map.on('move',adjustMap2()); //Lorsque la carte 1 bouge, actualiser la carte 2
    map.off('move',adjustMap2()); //Removes previously added listener function
  })

  map2.on('drag',function dragMap2(){ //Event listener lorsque l'on traîne la carte 2 avec la souris
    map2.on('move',adjustMap()); //Lorsque la carte 2 bouge, actualiser la carte 1
    map2.off('move',adjustMap()); //Removes previously added listener function
  })

  map2.on('zoom',function zoomMap2(){ //Event listener lorsque l'on zoom sur la carte 2
    map2.on('move',adjustMap()); //Lorsque la carte 1 bouge, actualiser la carte 2
    map2.off('move',adjustMap()); //Removes previously added listener function
  })

//Fonction qui supprimes tous les rectangles sur les deux cartes
  function supprRect(){
    map.removeLayer(rect2); //Supprime le rectangle 2
    if (map.hasLayer(rect2_bis)){
      map.removeLayer(rect2_bis); //Supprime le rectangle 2bis s'il existe
    };
    map2.removeLayer(rect1); //Supprime le rectangle 1
    if (map2.hasLayer(rect1_bis)){
      map2.removeLayer(rect1_bis); //Supprime le rectangle 1bis s'il existe
    }
  }

//Fonction qui ajuste l'emprise des rectangles
  function adjustBounds(){
    zoom1 = map.getZoom();
    zoom2 = map2.getZoom();
    if (zoom1>zoom2){ //si l'échelle de la carte 1 est plus grande, i.e. on voit moins de choses sur la carte 1
      var bounds = map.getBounds();
      var lat1 = bounds._northEast.lat;
      var lng1 = bounds._northEast.lng;
      var lat2 = bounds._southWest.lat;
      var lng2 = bounds._southWest.lng;
      newBounds = [[-lat2,lng2+180],[-lat1,lng1+180]];
      newBounds2 = [[-lat2,lng2-180],[-lat1,lng1-180]];
      rect1 =  new L.rectangle(newBounds, {color: "#07249f", weight: 1,"fillOpacity": 0});
      rect1_bis =  new L.rectangle(newBounds2, {color: "#07249f", weight: 1,"fillOpacity": 0});
      map2.addLayer(rect1);
      map2.addLayer(rect1_bis);
    }
    else { //si l'échelle de la carte 2 est plus grande, i.e. on voit moins de choses sur la carte 2
      var bounds = map2.getBounds();
      var lat1 = bounds._northEast.lat;
      var lng1 = bounds._northEast.lng;
      var lat2 = bounds._southWest.lat;
      var lng2 = bounds._southWest.lng;
      newBounds = [[-lat2,lng2-180],[-lat1,lng1-180]];
      newBounds2 = [[-lat2,lng2+180],[-lat1,lng1+180]];
      rect2 =  new L.rectangle(newBounds, {color: "#07249f", weight: 1,"fillOpacity": 0});
      rect2_bis = new L.rectangle(newBounds2, {color: "#07249f", weight: 1,"fillOpacity": 0});
      map.addLayer(rect2);
      map.addLayer(rect2_bis);
    }
  }



//Partie Lilian Calas

//Fonction d'affichage des labels des villes

function addlabels(fichier,carte1,carte2, data){ //Prend en paramètre le fichier json, la carte recto, la carte verso et les valeurs d'emprise des deux cartes


    fetch(fichier, {method: 'post',
  body: data,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }})
    .then(r => r.json())
    .then(r => {
      var countKey = Object.keys(r["villes"]).length; //Récupère le nombre de villes dans le fichier json (si il y a moins de 5 villes dans la zone)
      for (var i = 0; i < countKey ; i++) { //Parcours les 5 villes du fichier json
        var marker= L.mapquest.textMarker([r["villes"][i].lat, r["villes"][i].lon], { //Place un marqueur aux coordonnées de chacune des villes sur la carte
                                                                                      //où elles se trouvent en récupérant latitude et longitude dans le fichier json
          text: r["villes"][i].nom, //Récupère le nom de la ville correspondant aux coordonnées dans le fichier json
          position: 'right', // Label situé à droite du localisant
          icon: {
            primaryColor: '#A52A2A', //Couleur rouge
            secondaryColor: '#A52A2A',
            size: 'sm'
          }
        });
        if(carte1==map){markers1.addLayer(marker);}
        else{markers2.addLayer(marker);} // Selon si l'on a les villes de l'emprise ou de l'anti-emprise on ajoute le marqueur au groupe correspondant


//Maintenant il s'agit d'afficher les villes en miroir sur l'autre carte d'une autre couleur avec une formule qui peut varier selon la valeur de la longitude

if (r["villes"][i].lon<=0) //On applique la première formule pour trouver les coordonnées à l'antipode lorsque la longitude <= 0
{ var marker= L.mapquest.textMarker([-r["villes"][i].lat, r["villes"][i].lon+180], { //Place un marqueur aux coordonnées de l'antipode de chacune des villes en
                                                                          //récupérant latitude et longitude dans le fichier json et en appliquant la première formule de longitude
    text: r["villes"][i].nom, //Récupère le nom de la ville correspondant aux coordonnées dans le fichier json
    position: 'right', // Label situé à droite du localisant
    icon: {
      primaryColor: '#808080', //Couleur grise
      secondaryColor: '#808080',
      size: 'sm'
    }
  });
  if(carte1==map){markers2.addLayer(marker);}
  else{markers1.addLayer(marker);} // Selon si l'on a les villes de l'emprise ou de l'anti-emprise on ajoute le marqueur à la carte opposée
}

else //On applique la deuxième formule pour trouver les coordonnées à l'antipode lorsque la longitude > 0
{ var marker= L.mapquest.textMarker([-r["villes"][i].lat, 180-r["villes"][i].lon], { //Place un marqueur aux coordonnées de l'antipode de chacune des villes en
                                                                          //récupérant latitude et longitude dans le fichier json et en appliquant la deuxième formule de longitude
    text: r["villes"][i].nom, //Récupère le nom de la ville correspondant aux coordonnées dans le fichier json
    position: 'right', // Label situé à droite du localisant
    icon: {
      primaryColor: '#808080', //Couleur grise
      secondaryColor: '#808080',
      size: 'sm'
    }
  });
  if(carte1==map){markers2.addLayer(marker);}
  else{markers1.addLayer(marker);} // Selon si l'on a les villes de l'emprise ou de l'anti-emprise on ajoute le marqueur à la carte opposée
      }
    map.addLayer(markers1); //ajout du groupe de marqueurs correspondant à la carte de l-emprise (carte 1)
    map2.addLayer(markers2); //ajout du groupe de marqueurs correspondant à la carte de l'anti-emprise (carte 2)
  }})
}

//Fonction prenant en compte le changement d'emprise et déclanchant le nouvel affichage des labels

function Change_boundaries(){

  //On met une condition si on se trouve au chargement de la page et que les groupes de marqueurs n'existent pas encore
  if(typeof markers1!="undefined"){map.removeLayer(markers1);} //Enlève les anciens localisants avec leur nom de ville sur la carte 1
  if(typeof markers2!="undefined"){map2.removeLayer(markers2);} //Enlève les anciens localisants avec leur nom de ville sur la carte 2

  var bounds1 = map.getBounds(); //récupère le coin Nord-Est et Sud-Ouest de l'emprise 1
  var dlat1 = bounds1._northEast.lat; //coordonnées du coin Nord-Est de l'emprise 1
  var dlng1 = bounds1._northEast.lng;
  var glat1 = bounds1._southWest.lat; //coordonnées du coin Sud-Ouest de l'emprise 1
  var glng1 = bounds1._southWest.lng;

  var bounds2= map2.getBounds(); //récupère le coin Nord-Est et Sud-Ouest de l'emprise 2
  var dlat2 = bounds2._northEast.lat; //coordonnées du coin Nord-Est de l'emprise 2
  var dlng2 = bounds2._northEast.lng;
  var glat2 = bounds2._southWest.lat; //coordonnées du coin Sud-Ouest de l'emprise 2
  var glng2 = bounds2._southWest.lng;


  var data = {dlat1: dlat1, dlng1: dlng1, glat1: glat1 , glng1: glng1 , dlat2: dlat2 , dlng2: dlng2 , glat2: glat2 , glng2: glng2}
 // fichier json contenant les coordonnées des emprises nécessaires à la partie serveur

  markers1 = L.layerGroup(); //Création du groupe de marqueurs vide à afficher sur l'emprise (carte 1)
  markers2 = L.layerGroup(); //Création du groupe de marqueurs vide à afficher sur l'anti-emprise (carte 2)

  addlabels("villes1.json", map,map2,data); // Ajout des nouveaux labels en fonction de la nouvelle emprise 1
  addlabels("villes2.json",map2,map, data); // Ajout des nouveaux labels en fonction de la nouvelle emprise 2
  //Prend en paramètre le fichier json contenant les villes et leurs coordonnées sur la carte 1 ou sur la carte 2, la carte sur laquelle on doit les rajouter avec
  //leurs coordonnées réelles puis à l'opposé et le json contenant les valeurs d'emprise des deux cartes.

console.log("Les valeurs d'emprise ont changé et on va rechercher les informations dans le fichier json.");
//Vérification de la prise en compte des nouvelles coordonnées dans la console
console.log(data);
//Vérifiacation avec l'affichage des nouvelles valeurs d'empris dans la console

}

Change_boundaries(); //Placement des labels avec l'emprise de départ
map.on("drag", function dragMap(){ //Evénement sur le changement d'emprise par déplacement sur la carte 1
  map.on('move',Change_boundaries()); //Lorsque la carte 1 bouge, récupérer les nouvelles emprises de la carte 1 et 2 puis ajouter les labels en conséquence
  map.off('move',Change_boundaries()); //Removes previously added listener function
});

map.on("zoom", function zoomMap(){ //Evénement sur le changement d'emprise par zoom sur la carte 1
  map.on('move',Change_boundaries()); //Lorsque le zoom de la carte 1 change, récupérer les nouvelles emprises de la carte 1 et 2 puis ajouter les labels en conséquence
  map.off('move',Change_boundaries()); //Removes previously added listener function
});

map2.on("drag", function dragMap(){ //Evénement sur le changement d'emprise par déplacement sur la carte 2
  map2.on('move',Change_boundaries()); //Lorsque la carte 2 bouge, récupérer les nouvelles emprises de la carte 1 et 2 puis ajouter les labels en conséquence
  map2.off('move',Change_boundaries()); //Removes previously added listener function
});

map2.on("zoom", function zoomMap(){ // Evénement sur le changement d'emprise par zoom sur la carte 2
  map2.on('move',Change_boundaries()); //Lorsque le zoom de la carte 2 bouge, récupérer les nouvelles emprises de la carte 1 et 2 puis ajouter les labels en conséquence
  map2.off('move',Change_boundaries()); //Removes previously added listener function
});



};
