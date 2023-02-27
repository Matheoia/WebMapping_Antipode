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
      layers: baseLayer, // L.mapquest.tileLayer('map') is the MapQuest map tile layer
      zoom: 4 //Définir le niveau de zoom
    });
    rect2 = new L.rectangle(map.getBounds(), {color: "black", weight: 1,"fillOpacity": 0});  //Définit le premier rectangle définissant les limites de la carte 2
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
      layers: L.mapquest.tileLayer('satellite'), // L.mapquest.tileLayer('map') is the MapQuest map tile layer
      zoom: 4 //Niveau de zoom
    });
    rect1 = new L.rectangle(map2.getBounds(), {color: "black", weight: 1,"fillOpacity": 0});  //Définit le premier rectangle définissant les limites de la carte 1
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
      rect1 =  new L.rectangle(newBounds, {color: "black", weight: 1,"fillOpacity": 0});
      rect1_bis =  new L.rectangle(newBounds2, {color: "black", weight: 1,"fillOpacity": 0});
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
      rect2 =  new L.rectangle(newBounds, {color: "black", weight: 1,"fillOpacity": 0});
      rect2_bis = new L.rectangle(newBounds2, {color: "black", weight: 1,"fillOpacity": 0});
      map.addLayer(rect2);
      map.addLayer(rect2_bis);
    }
  }


/* --- CE QUI A ETE RAJOUTE SUR CE PROJET ---  */

// Avant d'attaquer cette partie, il faut rappeler ce que le projet précédent permet.
// J'ai repris la partie de Yanzhuo Peng qui développait une idée très intéressante 
// et assez ergonomique pour répondre au sujet de vouloir savoir ce qu'il se passait 
// de l'autre côté de la Terre. Les deux cartes utilisées sont en fait liées, et le niveau de zoom 
// de chaque carte et son emprise permet le fait que l'on va par exemple zoomer sur une des deux cartes 
// (ce qui se manifestera par la création d'un rectangle sur celle-ci), ainsi ce que l'on verra alors sur 
// l'autre carte sera la vue de l'autre côté de la Terre, mais délimitée par ce rectangle.
// La visualisation fait preuve de compréhension si vous commencez par le code.

// Pour commencer, on initialise quelques variables :
// à noter que chaque groupe de markers est sous deux versions, une pour chaque carte 
// - Les firstLayers pour afficher les premiers markers dans l'emprise du début
// - Les villes qui eux s'actualiseront bien en fonction de l'emprise 
// - Box et Label servent à l'option de si l'on veut des markers avec un bindPopup 
//   pour en savoir potentiellement plus ou des textMarkers qui affichent le label directement
var firstLayers = L.featureGroup().addTo(map);
var firstLayersAnti = L.featureGroup().addTo(map2);
var villes = L.featureGroup().addTo(map);
var villesAnti = L.featureGroup().addTo(map2);
var box = document.getElementById('box');
var label = document.getElementById('label');

// On écoute premièrement la checkbox et on change juste le label de l'un à l'autre
box.addEventListener('change', e=> {
  if(label.textContent == "Labels") {
    label.textContent = "Popups";
  } else {
    label.textContent = "Labels";
  }
});

// Cette première fonction affiche les premiers textMakers quand on lance ou rafraîchie la page
function addFirstLabels() {

  //on commence par créer le tableau que l'on va envoyer à notre service
  //on sépare bien l'emprise de la map et l'emprise antipodale de la deuxième
  //pour ensuite fetch avec en body une seule emprise et que cette emprise définisse
  //les 5 villes que l'on aura en sortie
  var FirstEmprise = {lat1: map.getBounds().getSouthWest().lat, lat2: map.getBounds().getNorthEast().lat, lng1: map.getBounds().getSouthWest().lng, lng2: map.getBounds().getNorthEast().lng};
  var FirstEmpriseAnti = {lat1: map2.getBounds().getSouthWest().lat, lat2: map2.getBounds().getNorthEast().lat, lng1: map2.getBounds().getSouthWest().lng, lng2: map2.getBounds().getNorthEast().lng};
  
  //on a alors le fetch qui envoie l'emprise de la map à notre php
  fetch('testbconnection.php', {
    method: 'post',
    body: JSON.stringify(FirstEmprise)
  })
  .then(r => r.json())
  .then(r => {
    //on reçoit les 5 villes et place un textMarker pour chaque
    r.forEach(element=> {
      var markerFirst = L.mapquest.textMarker([element['latitude'], element['longitude']], { text: element['city'], position: 'right', icon: {primaryColor: '#007fff',secondaryColor: '#007fff',size: 'sm'}}).addTo(firstLayers);
    })
  })

  //puis ici, le deuxième fetch pour avoir les 5 villes dans l'emprise antipodale
  fetch('testbconnection.php', {
    method: 'post',
    body: JSON.stringify(FirstEmpriseAnti)
  })
  .then(r => r.json())
  .then(r => {
    //puis les markers pour chaque ville
    r.forEach(element=> {
      var markerAnti = L.mapquest.textMarker([element['latitude'], element['longitude']], { text: element['city'], position: 'right', icon: {primaryColor: '#A52A2A',secondaryColor: '#A52A2A',size: 'sm'}}).addTo(firstLayersAnti);
    })
  })
}

// Il faut bien appeler cette fonction une fois, pour l'affichage au démarrage
addFirstLabels();

// On a ensuite ci-dessous une des deux grandes fonctions nécessaires au code :
// L'idée est d'une de clear les layers que l'on vient de mettre au démarrage
// Puis d'avoir accès à l'emprise et l'emprise antipodale uniquement dans cette fonction
// Puisque par la suite, c'est cette fonction qui va être appelé dans des écouteurs 
// d'évènements sur la carte pour avoir l'emprise(x2) en temps réel

// Point important à la compréhension : 
// En ce qui concerne la visualisation actuelle, on pourrait dire qu'il existe deux cas.
// Soit on veut zoomer à un endroit et voir précisément dans ce rectangle les antipodes ou
// Soit on se balade à un niveau de zoom plus elevé à un endroit et on regarde l'emprise du rectangle 
//     crée sur l'autre map (et les antipodes qu'il contient)
// Ainsi : le rectangle va toujours être créé sur la map qui a un niveau de zoom inférieur à l'autre
// pour avoir cette sensation que j'appelle le zoom à un endroit.
function Change_boundaries(){
  //on clear les dits-layers
  firstLayers.clearLayers();
  firstLayersAnti.clearLayers();

  //comme dit précédemment, la présence du rectangle est définie selon cette condition
  //par exemple dans ce premier cas où l'on 'zoomerait' sur la première map, c'est sur celle-ci
  //que le rectangle sera créé qui est étrangement nommé rect2 par ailleurs, mais qui reflète bien le rectangle
  //sur la première carte
  if(map.getZoom()<=map2.getZoom()) {
    //ensuite, toujours concernant le travail précédent, selon la longitude de l'endroit que l'on veut observer
    //on utilisera rect2 ou rect2_bis. Détails dans la première partie de ce code.
    if(map.getCenter()['lng']<=0) {
      //on peut alors enfin créer nos tableaux qui représentent les emprises(x2) selon les niveaux de zoom
      //et la longitude. Ainsi, on est supposé couvrir tous les cas. Ces emprises seront ensuite envoyées au service.
      var emprise = {lat1: rect2.getBounds().getSouthWest().lat, lat2: rect2.getBounds().getNorthEast().lat, lng1: rect2.getBounds().getSouthWest().lng, lng2: rect2.getBounds().getNorthEast().lng};
      var empriseAnti = {lat1: map2.getBounds().getSouthWest().lat, lat2: map2.getBounds().getNorthEast().lat, lng1: map2.getBounds().getSouthWest().lng, lng2: map2.getBounds().getNorthEast().lng};
    } else {
      var emprise = {lat1: rect2_bis.getBounds().getSouthWest().lat, lat2: rect2_bis.getBounds().getNorthEast().lat, lng1: rect2_bis.getBounds().getSouthWest().lng, lng2: rect2_bis.getBounds().getNorthEast().lng};
      var empriseAnti = {lat1: map2.getBounds().getSouthWest().lat, lat2: map2.getBounds().getNorthEast().lat, lng1: map2.getBounds().getSouthWest().lng, lng2: map2.getBounds().getNorthEast().lng};
    }
  } else {
    if(map2.getCenter()['lng']<=0) {
      var empriseAnti = {lat1: rect1.getBounds().getSouthWest().lat, lat2: rect1.getBounds().getNorthEast().lat, lng1: rect1.getBounds().getSouthWest().lng, lng2: rect1.getBounds().getNorthEast().lng};
      var emprise = {lat1: map.getBounds().getSouthWest().lat, lat2: map.getBounds().getNorthEast().lat, lng1: map.getBounds().getSouthWest().lng, lng2: map.getBounds().getNorthEast().lng};
    } else {
      var empriseAnti = {lat1: rect1_bis.getBounds().getSouthWest().lat, lat2: rect1_bis.getBounds().getNorthEast().lat, lng1: rect1_bis.getBounds().getSouthWest().lng, lng2: rect1_bis.getBounds().getNorthEast().lng};
      var emprise = {lat1: map.getBounds().getSouthWest().lat, lat2: map.getBounds().getNorthEast().lat, lng1: map.getBounds().getSouthWest().lng, lng2: map.getBounds().getNorthEast().lng};
    }
  }

  //une fois les emprises obtenues, on va pouvoir les envoyer aux serveurs puis obtenir les 5 villes souhaitées
  //et enfin placer un marker pour chaque ; et c'est justement ce que fait cette deuxième fonction appelée ici
  addlabels(emprise, empriseAnti); 
}

// L'objectif de cette fonction a été éclairci juste au-dessus
// Comme dans la fonction addFirstLabels, on retrouve ces deux fetch, une pour chaque emprise donnée.
// On les récrit alors deux fois même s'ils sont très ressemblants puisque l'on ajoute des markers différents
// selon la map auxquelles on veut les attribuer. À noter que ces cas pourraient alors être écrits dans 
// une seule fonction avec un seul fetch mais qui, selon si l'on précise sur la map ou la map2,
// changerait directement ces caractéristiques
function addlabels(emprise, empriseAnti){

  fetch('testbconnection.php', {
    method: 'post',
    body: JSON.stringify(emprise)
  })
  .then(r => r.json())
  .then(r => {
    console.log(r);
    villes.clearLayers();
    //le serveur nous donne les 5 villes directement donc pour chacune, on : 
    r.forEach(element=> {
      //selon si l'on veut des markers ou des markersText
      if(label.textContent == "Popups") {
        //place directement les markers en retrouvant les différentes lignes (ou caractéristiques) de chaque ville
        let textePopUp = "<center>Vous êtes actuellement dans la ville de : <strong>" + element['city'] +"</strong> qui a une population de " + element['population']+" habitants</center>";
        var marker = L.marker([element['latitude'], element['longitude']]).addTo(villes).bindPopup(textePopUp);
        var markerMondePre = L.marker([element['latitude'], element['longitude']-360]).addTo(villes).bindPopup(textePopUp);
        var markerMondeAp = L.marker([element['latitude'], element['longitude']+360]).addTo(villes).bindPopup(textePopUp);
      } else {
        //on peut aussi noter que je crée trois markers pour chaque ville pour faciliter les transitions
        //de passage des différentes mondes sur la map ; en somme cela évite de devoir faire le tour du
        //monde si l'on passe de l'Amérique du Sud à l'Asie du Sud-Est et donne un peu de liberté je trouve, c'est un choix  
        var marker = L.mapquest.textMarker([element['latitude'], element['longitude']], { text: element['city'], position: 'right', icon: {primaryColor: '#007fff',secondaryColor: '#007fff',size: 'sm'}}).addTo(villes);
        var markerMondePre = L.mapquest.textMarker([element['latitude'], element['longitude']-360], { text: element['city'], position: 'right', icon: {primaryColor: '#007fff',secondaryColor: '#007fff',size: 'sm'}}).addTo(villes);
        var markerMondeAp = L.mapquest.textMarker([element['latitude'], element['longitude']+360], { text: element['city'], position: 'right', icon: {primaryColor: '#007fff',secondaryColor: '#007fff',size: 'sm'}}).addTo(villes);
      }
    })
  })

  fetch('testbconnection.php', {
    method: 'post',
    body: JSON.stringify(empriseAnti)
  })
  .then(r => r.json())
  .then(r => {
    console.log(r);
    villesAnti.clearLayers();
    r.forEach(element=> {
      //le bindPopup est une idée pour gérer de une si l'utilisateur veut cacher les labels ou alors 
      //en connaître plus sur la ville puisque l'on pourrait en effet rajouter des informations dans 
      //ce Popup en plus du nom de la ville et de sa population. A nous d'être créatifs ensuite.
      if(label.textContent == "Popups") {
        let textePopUp = "<center>Vous êtes actuellement dans la ville de : <strong>" + element['city'] +"</strong> qui a une population de "+ element['population']+" habitants</center>";
        var markerAnti = L.marker([element['latitude'], element['longitude']]).addTo(villesAnti).bindPopup(textePopUp);
        var markerMondePreAnti = L.marker([element['latitude'], element['longitude']-360]).addTo(villesAnti).bindPopup(textePopUp);
        var markerMondeApAnti = L.marker([element['latitude'], element['longitude']+360]).addTo(villesAnti).bindPopup(textePopUp);
      } else {
        //selon la map sur laquelle on veut ajouter les villes, on change la couleur du textMarker et bien évidemment les addTo
        var markerAnti = L.mapquest.textMarker([element['latitude'], element['longitude']], { text: element['city'], position: 'right', icon: {primaryColor: '#A52A2A',secondaryColor: '#A52A2A',size: 'sm'}}).addTo(villesAnti);
        var markerMondePreAnti = L.mapquest.textMarker([element['latitude'], element['longitude']-360], { text: element['city'], position: 'right', icon: {primaryColor: '#A52A2A',secondaryColor: '#A52A2A',size: 'sm'}}).addTo(villesAnti);
        var markerMondeApAnti = L.mapquest.textMarker([element['latitude'], element['longitude']+360], { text: element['city'], position: 'right', icon: {primaryColor: '#A52A2A',secondaryColor: '#A52A2A',size: 'sm'}}).addTo(villesAnti);
      }
    })
  })
};

// On retrouve finalement les écouteurs d'évènements sur les deux maps
// pour que dès que l'on zoom ou drag la map, on applique la fonction Change_boundaries() 
// qui retrouve les emprises(x2) en temps réel et qui implique elle même addLabels pour
// placer les markers aux positions des 5 villes que le service nous rend 

map.on("drag", function dragMap(){ //Evénement sur le changement d'emprise par déplacement sur la carte 1
  //map.on('move',Change_boundaries()); //Lorsque la carte 1 bouge, récupérer les nouvelles emprises de la carte 1 et 2 puis ajouter les labels en conséquence
  map.off('move',Change_boundaries()); //Removes previously added listener function
});

map.on("zoom", function zoomMap(){ //Evénement sur le changement d'emprise par zoom sur la carte 1
  //map.on('move',Change_boundaries()); //Lorsque le zoom de la carte 1 change, récupérer les nouvelles emprises de la carte 1 et 2 puis ajouter les labels en conséquence
  map.off('move',Change_boundaries()); //Removes previously added listener function
});

map2.on("drag", function dragMap(){ //Evénement sur le changement d'emprise par déplacement sur la carte 2
  //map2.on('move',Change_boundaries()); //Lorsque la carte 2 bouge, récupérer les nouvelles emprises de la carte 1 et 2 puis ajouter les labels en conséquence
  map2.off('move',Change_boundaries()); //Removes previously added listener function
});

map2.on("zoom", function zoomMap(){ // Evénement sur le changement d'emprise par zoom sur la carte 2
  //map2.on('move',Change_boundaries()); //Lorsque le zoom de la carte 2 bouge, récupérer les nouvelles emprises de la carte 1 et 2 puis ajouter les labels en conséquence
  map2.off('move',Change_boundaries()); //Removes previously added listener function
});

};