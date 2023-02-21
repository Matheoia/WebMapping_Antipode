// Initiation des variables
var map;  //Carte 1
var map2;  //Carte 2
var rect1;  //Premier rectangle qui appara�t sur la carte 2, d�finissant les limites de la carte 1
var rect1_bis;  //Deuxi�me rectangle qui appara�t sur la carte 2, d�finissant les limites de la carte 1
var rect2;  //Premier rectangle qui appara�t sur la carte 1, d�finissant les limites de la carte 2
var rect2_bis;  //Deuxi�me rectangle qui appara�t sur la carte 1, d�finissant les limites de la carte 2
//Il y a deux rectangles sur chaque carte car sinon l'affichage ne serait pas correct en passant par le m�ridien

window.onload = function() {  //Au chargement de la page, la fonction affiche les deux cartes

  L.mapquest.key = 'KWsK0g0pCCuHOK9dp1pZ6uKmLVvZEXmE';  //R�cup�ration de la cl� de l'API de Mapquest
  var baseLayer = L.mapquest.tileLayer('satellite');  //Initialisation du mode de carte

  //Fonction pour afficher la carte 1
  function showMap() {
    map = createMap(); //Cr�ation de la carte 1
    map.addControl(L.mapquest.control()); //Ajout des touches de contr�le sur la carte 1
    addLayerControl(map);
  }

  //Fonction pour cr�er la carte 1
  function createMap() {
    map = L.mapquest.map('map1', {
      center: [48.864716, 2.349014], //D�finir le point central de vue � la cr�ation
      layers: L.mapquest.tileLayer('map'), // L.mapquest.tileLayer('map') is the MapQuest map tile layer
      zoom: 4 //D�finir le niveau de zoom
    });
    rect2 = new L.rectangle(map.getBounds(), {color: "#07249f", weight: 1,"fillOpacity": 0});  //D�finit le premier rectangle d�finissant les limites de la carte 2
    rect2.addTo(map); //Ajout de ce rectangle sur la carte 1
    return map; //Renvoie la carte 1
  }

  //Fonction pour afficher la carte 2
  function showMap2() {
    map2 = createMap2(); //Cr�ation de la carte 2
    map2.addControl(L.mapquest.control()); //Ajout des touches de contr�le sur la carte 2
    addLayerControl(map2);
  }

  //Fonction pour cr�er la carte 2
  function createMap2() {
    map2 = L.mapquest.map('map2', {
      center: [-48.864716, 177.650986], //D�finir le point central de vue � la cr�ation (l'antipode du point central de la carte 1)
      layers: L.mapquest.tileLayer('map'), // L.mapquest.tileLayer('map') is the MapQuest map tile layer
      zoom: 4 //Niveau de zoom
    });
    rect1 = new L.rectangle(map2.getBounds(), {color: "#07249f", weight: 1,"fillOpacity": 0});  //D�finit le premier rectangle d�finissant les limites de la carte 1
    rect1.addTo(map2); //Ajout de ce rectangle sur la carte 2
    return map2; //Renvoie la carte 2
  }

  function addLayerControl(map) { //Ajout des types de couches qui peuvent �tre affich�es
    L.control.layers({
      'Map': L.mapquest.tileLayer('map'),
      'Satellite': L.mapquest.tileLayer('satellite'),
      //'Hybrid': L.mapquest.tileLayer('hybrid'),
      //'Light': L.mapquest.tileLayer('light'),
      //'Dark': baseLayer
    }, {}, { position: 'topleft'}).addTo(map);  //Ajout du bouton de s�lection en haut � gauche de la carte
  }

  showMap(); //Afficher la carte 1
  showMap2(); //Afficher la carte 2

  function newViewMap2(){ //D�finir une nouvelle vue pour la carte 2
    adjustBounds(); //Ajuster les limites des rectangles affich�s
    var NewMapCenter = map.getCenter(); //R�cup�rer les coordonn�es du centre de la carte 1
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

  function newViewMap(){ //D�finir une nouvelle vue pour la carte 1 (pareil que la fonction pr�c�dente)
    adjustBounds(); //Ajuster les limites des rectangles affich�s
    var NewMapCenter = map2.getCenter(); //R�cup�rer les coordonn�es du centre de la carte 2
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

//Fonction qui actualiste la carte 2 en supprimer tous les rectangles ant�rieurs et en d�finissant une nouvelle vue pour la carte 2
  function adjustMap2(){
    supprRect();
    newViewMap2();
  }

  //Fonction qui actualiste la carte 1 en supprimer tous les rectangles ant�rieurs et en d�finissant une nouvelle vue pour la carte 1
  function adjustMap(){
    supprRect();
    newViewMap();
  }

  map.on('drag',function dragMap(){ //Event listener lorsque l'on tra�ne la carte 1 avec la souris
    map.on('move',adjustMap2()); //Lorsque la carte 1 bouge, actualiser la carte 2
    map.off('move',adjustMap2()); //Removes previously added listener function
  })

  map.on('zoom',function zoomMap(){ //Event listener lorsque l'on zoom sur la carte 1
    map.on('move',adjustMap2()); //Lorsque la carte 1 bouge, actualiser la carte 2
    map.off('move',adjustMap2()); //Removes previously added listener function
  })

  map2.on('drag',function dragMap2(){ //Event listener lorsque l'on tra�ne la carte 2 avec la souris
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
    if (zoom1>zoom2){ //si l'�chelle de la carte 1 est plus grande, i.e. on voit moins de choses sur la carte 1
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
    else { //si l'�chelle de la carte 2 est plus grande, i.e. on voit moins de choses sur la carte 2
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

function addlabels(fichier,carte1,carte2, data){ //Prend en param�tre le fichier json, la carte recto, la carte verso et les valeurs d'emprise


    fetch(fichier, {method: 'post',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }})
    .then(r => r.json())
    .then(r => {
      var countKey = Object.keys(r).length; //R�cup�re le nombre de villes dans le fichier json (si il y a moins de 5 villes dans la zone)
      console.log(countKey);
      for (var i = 1; i < countKey+1 ; i++) { //Parcours les 5 villes du fichier json
        var marker= L.mapquest.textMarker([r[i].latitude, r[i].longitude], { //Place un marqueur aux coordonn�es de chacune des villes sur la carte                                                                            //o� elles se trouvent en r�cup�rant latitude et longitude dans le fichier json
          text: r[i].city, //R�cup�re le nom de la ville correspondant aux coordonn�es dans le fichier json
          position: 'right', // Label situ� � droite du localisant
          icon: {
            primaryColor: '#A52A2A', //Couleur rouge
            secondaryColor: '#A52A2A',
            size: 'sm'
          }
        });
        if(carte1==map){markers1.addLayer(marker);}
        else{markers2.addLayer(marker);}


if (r[i].longitude<=0) //On applique la premi�re formule pour trouver les coordonn�es � l'antipode lorsque la longitude <= 0
{ var marker= L.mapquest.textMarker([-r[i].latitude, r[i].longitude+180], { //Place un marqueur aux coordonn�es de l'antipode de chacune des villes en
                                                                          //r�cup�rant latitude et longitude dans le fichier json et en appliquant la premi�re formule de longitude
    text: r[i].city, //R�cup�re le nom de la ville correspondant aux coordonn�es dans le fichier json
    position: 'right', // Label situ� � droite du localisant
    icon: {
      primaryColor: '#808080', //Couleur grise
      secondaryColor: '#808080',
      size: 'sm'
    }
  });
  if(carte1==map){markers2.addLayer(marker);}
  else{markers1.addLayer(marker);}
}
else //On applique la deuxi�me formule pour trouver les coordonn�es � l'antipode lorsque la longitude > 0
{ var marker= L.mapquest.textMarker([-r[i].latitude, 180-r[i].longitude], { //Place un marqueur aux coordonn�es de l'antipode de chacune des villes en
                                                                          //r�cup�rant latitude et longitude dans le fichier json et en appliquant la deuxi�me formule de longitude
    text: r[i].city, //R�cup�re le nom de la ville correspondant aux coordonn�es dans le fichier json
    position: 'right', // Label situ� � droite du localisant
    icon: {
      primaryColor: '#808080', //Couleur grise
      secondaryColor: '#808080',
      size: 'sm'
    }
  });
  if(carte1==map){markers2.addLayer(marker);}
  else{markers1.addLayer(marker);}
      }
    map.addLayer(markers1);
    map2.addLayer(markers2);
  }})



}

//Fonction prenant en compte le changement d'emprise et d�clanchant le nouvel affichage des labels

function Change_boundaries(){

if(typeof markers1!="undefined"){map.removeLayer(markers1);}
if(typeof markers2!="undefined"){map2.removeLayer(markers2);}

  var bounds1 = map.getBounds(); //r�cup�re le coin Nord-Est et Sud-Ouest de l'emprise 1
  var dlat1 = bounds1._northEast.lat; //coordonn�es du coin Nord-Est de l'emprise 1
  var dlng1 = bounds1._northEast.lng;
  var glat1 = bounds1._southWest.lat; //coordonn�es du coin Sud-Ouest de l'emprise 1
  var glng1 = bounds1._southWest.lng;

  var bounds2= map2.getBounds(); //r�cup�re le coin Nord-Est et Sud-Ouest de l'emprise 2
  var dlat2 = bounds2._northEast.lat; //coordonn�es du coin Nord-Est de l'emprise 2
  var dlng2 = bounds2._northEast.lng;
  var glat2 = bounds2._southWest.lat; //coordonn�es du coin Sud-Ouest de l'emprise 2
  var glng2 = bounds2._southWest.lng;


  var data = {dlat1: dlat1, dlng1: dlng1, glat1: glat1 , glng1: glng1 , dlat2: dlat2 , dlng2: dlng2 , glat2: glat2 , glng2: glng2};
 // fichier json contenant les coordonn�es des emprises n�cessaires � la partie serveur

  markers1 = L.layerGroup();
  markers2 = L.layerGroup();

  addlabels('bdd_emprise.php', map,map2,data); // Ajout des nouveaux labels en fonction de la nouvelle emprise 1
  addlabels('bdd_anti_emprise.php',map2,map, data); // Ajout des nouveaux labels en fonction de la nouvelle emprise 1


}

Change_boundaries(); //Placement des labels avec l'emprise de d�part
map.on("drag", function dragMap(){ //Ev�nement sur le changement d'emprise par d�placement sur la carte 1
  map.on('move',Change_boundaries()); //Lorsque la carte 1 bouge, r�cup�rer les nouvelles emprises de la carte 1 et 2
  map.off('move',Change_boundaries()); //Removes previously added listener function
});

map.on("zoom", function zoomMap(){ //Ev�nement sur le changement d'emprise par zoom sur la carte 1
  map.on('move',Change_boundaries()); //Lorsque le zoom de la carte 1 change, r�cup�rer les nouvelles emprises de la carte 1 et 2
  map.off('move',Change_boundaries()); //Removes previously added listener function
});

map2.on("drag", function dragMap(){ //Ev�nement sur le changement d'emprise par d�placement sur la carte 2
  map2.on('move',Change_boundaries()); //Lorsque la carte 2 bouge, r�cup�rer les nouvelles emprises de la carte 1 et 2
  map2.off('move',Change_boundaries()); //Removes previously added listener function
});

map2.on("zoom", function zoomMap(){ // Ev�nement sur le changement d'emprise par zoom sur la carte 2
  map2.on('move',Change_boundaries()); //Lorsque le zoom de la carte 2 bouge, r�cup�rer les nouvelles emprises de la carte 1 et 2
  map2.off('move',Change_boundaries()); //Removes previously added listener function
});



};
