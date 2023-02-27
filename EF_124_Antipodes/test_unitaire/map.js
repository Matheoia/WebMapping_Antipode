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
// - Compte est un compteur, utilisé seulement pour distinguer l'affichage des markers
//   au démarrage ou lorsque l'on change d'emprise.
var firstLayers = L.featureGroup().addTo(map);
var firstLayersAnti = L.featureGroup().addTo(map2);
var villes = L.featureGroup().addTo(map);
var villesAnti = L.featureGroup().addTo(map2);
var box = document.getElementById('box');
var label = document.getElementById('label');
var compte = 0;

// On écoute premièrement la checkbox et on change juste le label de l'un à l'autre
box.addEventListener('change', e=> {
  if(label.textContent == "Labels") {
    label.textContent = "Popups";
  } else {
    label.textContent = "Labels";
  }
});

// Pour les tests unitaires, nous n'avons pas besoin d'envoyer nos emprises
// via un fetch avec une page php. Ainsi, gardé pour la forme, cette fonction 
// n'a ici que d'intérêts d'actualiser les markers que l'on posera sur les 
// deux maps. Puis on appelera addLabels avec en entrée le fichier Json qui
// sert de test.
function Change_boundaries(){
  villes.clearLayers();
  villesAnti.clearLayers();
  addlabels("antipodes.json"); 
}

// Justement, c'est cette fonction addLabels qui permet de fetch notre fichier Json
// et ainsi placer les différents markers selon certaines conditions
function addlabels(fichier){ 

  //on commencer par fetch notre Json
  fetch(fichier)
    .then(r => r.json())
    .then(data => {

      //pour avoir des markers directement au démarrage, j'ai choisi cette solution
      //on aurait pu en choisir une autre
      if(compte==0){
        //on utilise la fonction getTopFiveCitiesWithinMap qui, on le verra par la suite, 
        //permet d'avoir les 5 villes avec les plus grandes populations dans l'emprise qu'on lui donne
        var citiesInBoundsFirst = getTopFiveCitiesWithinMap(data, map);
        var citiesInBoundsAntiFirst = getTopFiveCitiesWithinMap(data, map2);
          
        //ensuite, on place un marker pour chaque ville
        citiesInBoundsFirst.forEach(element => {
          var marker = L.mapquest.textMarker([element['lat'], element['lon']], { text: element['nom'], position: 'right', icon: {primaryColor: '#007fff',secondaryColor: '#007fff',size: 'sm'}}).addTo(firstLayers);
        })
        citiesInBoundsAntiFirst.forEach(element => {
          var markerAnti = L.mapquest.textMarker([element['lat'], element['lon']], { text: element['nom'], position: 'right', icon: {primaryColor: '#A52A2A',secondaryColor: '#A52A2A',size: 'sm'}}).addTo(firstLayersAnti);
        })
        //on incrémente pour passer au else lorsque les emprises s'actualiseront
        compte+=1;
      } else {
        //on commence ce deuxième cas par clear les premiers markers laissés
        firstLayers.clearLayers();
        firstLayersAnti.clearLayers();

        //cela est déjà résumé si vous ne l'avez pas lu dans le map_integre.js mais pour résumer rapidement
        //si on veut "zoomer" sur la map de gauche, alors le rectangle sera effectivement sur cette map
        //ou autrement dit, il existera rect2
        //dans le else : inverse
        //de plus, ce "zoom" est fait lorsque la map de gauche a un plus petit zoom que celle de droite
        //ainsi, on crée ces différents cas et on retrouve les différentes 5 villes selon si l'on veut
        //les villes dans le rectangle ou dans l'emprise totale de la carte
        if(map.getZoom()<=map2.getZoom()) {
          var citiesInBounds = getTopFiveCitiesWithinRect(data, rect2, rect2_bis);
          var citiesInBoundsAnti = getTopFiveCitiesWithinMap(data, map2)
        } else {
          var citiesInBounds = getTopFiveCitiesWithinMap(data, map);
          var citiesInBoundsAnti = getTopFiveCitiesWithinRect(data, rect1, rect1_bis)
        }

        //une fois que l'on a ces villes, il suffit de placer les markers pour chaque élément dans 
        //ces listes de villes citiesInBounds ou citiesInBoundsAnti
        citiesInBounds.forEach(element => {
          //selon si l'on veut des markers ou markerText
          if(label.textContent == "Popups") {
            let textePopUp = "<center>Vous êtes actuellement en : <strong>" + element['pays'] + "</strong> dans la ville de : <strong>" + element['nom'] +"</strong></center>";
            var marker = L.marker([element['lat'], element['lon']]).addTo(villes).bindPopup(textePopUp);
            var markerMondePre = L.marker([element['lat'], element['lon']-360]).addTo(villes).bindPopup(textePopUp);
            var markerMondeAp = L.marker([element['lat'], element['lon']+360]).addTo(villes).bindPopup(textePopUp);
          } else {
            var marker = L.mapquest.textMarker([element['lat'], element['lon']], { text: element['nom'], position: 'right', icon: {primaryColor: '#007fff',secondaryColor: '#007fff',size: 'sm'}}).addTo(villes);
            var markerMondePre = L.mapquest.textMarker([element['lat'], element['lon']-360], { text: element['nom'], position: 'right', icon: {primaryColor: '#007fff',secondaryColor: '#007fff',size: 'sm'}}).addTo(villes);
            var markerMondeAp = L.mapquest.textMarker([element['lat'], element['lon']+360], { text: element['nom'], position: 'right', icon: {primaryColor: '#007fff',secondaryColor: '#007fff',size: 'sm'}}).addTo(villes);
          }
        })

        //on répète pour les villes aux antipodes
        citiesInBoundsAnti.forEach(element => {
          if(label.textContent == "Popups") {
            //à noter que l'idée du Popup est d'intégrer si on le souhaite des informations en plus
            //que celles présentées ici.
            let textePopUp = "<center>Vous êtes actuellement en : <strong>" + element['pays'] + "</strong> dans la ville de : <strong>" + element['nom'] +"</strong></center>";
            var markerAnti = L.marker([element['lat'], element['lon']]).addTo(villesAnti).bindPopup(textePopUp);
            var markerMondePreAnti = L.marker([element['lat'], element['lon']-360]).addTo(villesAnti).bindPopup(textePopUp);
            var markerMondeApAnti = L.marker([element['lat'], element['lon']+360]).addTo(villesAnti).bindPopup(textePopUp);
          } else {
            var markerAnti = L.mapquest.textMarker([element['lat'], element['lon']], { text: element['nom'], position: 'right', icon: {primaryColor: '#A52A2A',secondaryColor: '#A52A2A',size: 'sm'}}).addTo(villesAnti);
            var markerMondePreAnti = L.mapquest.textMarker([element['lat'], element['lon']-360], { text: element['nom'], position: 'right', icon: {primaryColor: '#A52A2A',secondaryColor: '#A52A2A',size: 'sm'}}).addTo(villesAnti);
            var markerMondeApAnti = L.mapquest.textMarker([element['lat'], element['lon']+360], { text: element['nom'], position: 'right', icon: {primaryColor: '#A52A2A',secondaryColor: '#A52A2A',size: 'sm'}}).addTo(villesAnti);
          }
        })
      }
    })
  };

// On retrouve finalement les écouteurs d'évènements sur les deux maps
// pour que dès que l'on zoom ou drag la map, on applique la fonction Change_boundaries() 
// qui retrouve les emprises(x2) en temps réel et qui implique elle même addLabels pour
// placer les markers aux positions des 5 villes que le service nous rend 

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

Change_boundaries(); //Placement des labels avec l'emprise de départ

function getTopFiveCitiesWithinMap(data, emprise) {
  const cities = data["villes"]; // On récupère les données sous forme d'objet JavaScript grâce à la méthode json()
  let citiesInBounds = []; // On initialise un tableau qui va contenir les villes dans l'emprise de la carte
  
  cities.forEach(city => { // On parcourt chaque ville
    let cityLatLng = [city.lat, city.lon];
    if (emprise.getBounds().contains(cityLatLng)) {
      // Si la ville se trouve dans l'emprise, on l'ajoute au tableau
      citiesInBounds.push(city);
    }
  });
  citiesInBounds.sort((a, b) => b.population - a.population); // On trie le tableau en fonction de la population, par ordre décroissant
  
  return citiesInBounds.slice(0, 5); // On retourne les cinq premières villes (les plus peuplées)
}

function getTopFiveCitiesWithinRect(data, emprise, emprise_bis) {
  const cities = data["villes"]; 
  let citiesInBounds = []; 
  
  cities.forEach(city => { // On parcourt chaque ville
    let cityLatLng = [city.lat, city.lon];
    if (emprise.getBounds().contains(cityLatLng) || emprise_bis.getBounds().contains(cityLatLng)) {
      // Si la ville se trouve dans l'emprise, on l'ajoute au tableau
      citiesInBounds.push(city);
    }
  });
  citiesInBounds.sort((a, b) => b.population - a.population); // On trie le tableau en fonction de la population, par ordre décroissant
  
  return citiesInBounds.slice(0, 5); // On retourne les cinq premières villes (les plus peuplées)
}


};

