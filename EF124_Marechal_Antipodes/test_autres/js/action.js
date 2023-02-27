L.mapquest.key = 'aCALLDm2l0tNOvmdDovBSvWsz9haKGI3';
var baseLayer = L.mapquest.tileLayer('satellite');

var map = L.mapquest.map('map', {
    center: [29.953745, -90.074158],
    layers: L.mapquest.tileLayer('map'),
    zoom: 1
});

var map2 = L.mapquest.map('map2', {
    center: [29.953745, -90.074158],
    layers: L.mapquest.tileLayer('map'),
    zoom: 1
});

L.control.layers({
    'Map': L.mapquest.tileLayer('map'),
    'Satellite': L.mapquest.tileLayer('satellite'),
}).addTo(map);

var drawnItems = L.featureGroup().addTo(map);

const drawControl = new L.Control.Draw({
    draw: {
      polygon: false,
      polyline: false,
      rectangle: {
        max: 1
      },
      circle: false,
      circlemarker: false,
      marker: false
    }, edit: {
        featureGroup: drawnItems,
      }
})
  
map.addControl(drawControl);

var villes = L.featureGroup().addTo(map);
var villesAnti = L.featureGroup().addTo(map2);
var featureAnti = L.featureGroup().addTo(map2);

map.on(L.Draw.Event.CREATED, drawARectangle)

function drawARectangle(event) {
    var layer = event.layer;
    bounds = layer.getBounds();
    if(drawnItems && drawnItems.getLayers().length!==0){drawnItems.clearLayers();} 
    drawnItems.addLayer(layer);
    villes.clearLayers();
    featureAnti.clearLayers();
    actualiseMarker(bounds);
    drawAntiRectangle(bounds);
    actualiseMarkerAnti(drawAntiRectangle(bounds).getBounds());
    startLoop(bounds);

    map.on(L.Draw.Event.EDITED, function(e) {
        villes.clearLayers();
        villesAnti.clearLayers();
        featureAnti.clearLayers();
        newBounds = layer.getBounds();
        drawAntiRectangle(newBounds);
        actualiseMarker(newBounds);
        actualiseMarkerAnti(drawAntiRectangle(newBounds).getBounds());
        stopLoop();
        startLoop(newBounds);
    })   
    
    map.on('draw:deleted', function(e) {
        villes.clearLayers();
        villesAnti.clearLayers();
        featureAnti.clearLayers();
        stopLoop();
    });

    return bounds
};

function drawAntiRectangle(bounds){
    const northEast = bounds['_northEast'];
    const southWest = bounds['_southWest'];
    const futurNE = [-northEast['lat'], (northEast['lng']+180) % 360]
    const futurSO = [-southWest['lat'], (southWest['lng']+180) % 360]
    
    const rect = L.rectangle([futurSO, futurNE], {color: 'red', weight: 1}).addTo(featureAnti);
    map2.setView(rect.getBounds().getCenter(), map.getZoom());
    return rect
}

function actualiseMarker(bounds) {
    fetch("../antipodes.json")
    .then(response => response.json())
    .then(data => {
    data['villes'].forEach(element => {
        var marker = L.marker([element['lat'], element['lon']]);
        var markerMondePre = L.marker([element['lat'], element['lon']-360]);
        var markerMondeAp = L.marker([element['lat'], element['lon']+360]);
        if (bounds.contains(marker.getLatLng())) {marker.addTo(villes);}
        if (bounds.contains(markerMondePre.getLatLng())) {markerMondePre.addTo(villes);}
        if (bounds.contains(markerMondeAp.getLatLng())) {markerMondeAp.addTo(villes);}
    })
})};

function actualiseMarkerAnti(bounds) {
    fetch("../antipodes.json")
    .then(response => response.json())
    .then(data => {
    data['villes'].forEach(element => {
        var marker = L.marker([element['lat'], element['lon']]);
        var markerMondePre = L.marker([element['lat'], element['lon']-360]);
        var markerMondeAp = L.marker([element['lat'], element['lon']+360]);
        if (bounds.contains(marker.getLatLng())) {marker.addTo(villesAnti);}
        if (bounds.contains(markerMondePre.getLatLng())) {markerMondePre.addTo(villesAnti);}
        if (bounds.contains(markerMondeAp.getLatLng())) {markerMondeAp.addTo(villesAnti);}
    })
})};


/* --- ACTUALISATION MARKERS --- */

let intervalId;

function startLoop(bounds) {
  intervalId = setInterval(() => {
    if(drawnItems) {
        if(drawnItems.getLayers().length==0){
            stopLoop();
          } 
        var newBounds = drawnItems.getLayers()[0].getBounds();
        if(bounds==newBounds) {
            //console.log("le rectangle ne bouge pas");
        } else {
            //console.log("le rectangle bouge");
            villes.clearLayers();
            villesAnti.clearLayers();
            featureAnti.clearLayers();
            drawAntiRectangle(newBounds);
            actualiseMarkerAnti(drawAntiRectangle(newBounds).getBounds());
            actualiseMarker(newBounds);
        }
    }
  }, 1000);
}

function stopLoop() {
  clearInterval(intervalId);
}

/* --- BOUTONS BLOQUER VUE OU NON --- */

var btnSynchro = document.getElementById('btnSynchro');
var btnDesynchro = document.getElementById('btnDesynchro');
var btnCentre = document.getElementById('btnCentre');

btnSynchro.addEventListener('click', function(){
    map.on('drag', synchroVue);
})
btnDesynchro.addEventListener('click', function(){
    map.removeEventListener('drag', synchroVue);
})

function synchroVue(){
    const center = map.getCenter();
    const centerAnti = [-center['lat'], (center['lng']+180) % 360]
    map2.setView(centerAnti, map.getZoom());
}

btnCentre.addEventListener('click', centreVue);

function centreVue(e) {
    if(featureAnti.getLayers().length==2) {
        const rect = drawnItems.getLayers()[0];
        const rectAnti = featureAnti.getLayers()[0];
        map.fitBounds(rect.getBounds())
        map2.fitBounds(rectAnti.getBounds())
    } else {
        e.preventDefault();
    }
    
}

/* --- ON THE MOVE --- */

var boxSquare = document.getElementById('carre');
var boxCircle = document.getElementById('cercle');
var featureCreee = L.featureGroup().addTo(map)

function changeSquareSize(value) {
    actualiseRectCree(value);
    map.on('drag', function() {
        actualiseRectCree(value);
    })
}

function actualiseRectCree(value) {
    if(value!=0) {
        featureCreee.clearLayers();
        var centerMap = map.getCenter();
        var futurNE = L.latLng(centerMap.lat + value/2, centerMap.lng + value/2).wrap();
        var futurSO = L.latLng(centerMap.lat - value/2, centerMap.lng - value/2).wrap();
        if(boxSquare) {
            const rectCree = L.rectangle([futurNE, futurSO], {color: 'blue', weight: 1}).addTo(featureCreee);
            //map.fitBounds(rectCree.getBounds());
    }} else {
        featureCreee.clearLayers();
    }
}

/* --- CURSOR --- */

const cursor = document.getElementById('cursor')
const cursorAnti = document.getElementById('cursorAnti')
var btnCursor =  document.getElementById('btnCursor')
var div = document.querySelector('div')
var btnEnleveCursor = document.getElementById('btnEnleveCursor')
const carteAnti = document.getElementById('map2')

btnCursor.addEventListener('click', changeCurseur)
btnEnleveCursor.addEventListener('click', remetCurseur)

function changeCurseur() {
    div.style.cursor = 'none';
    div.style.zIndex = '0';
    carteAnti.style.zIndex = '0';
    cursor.style.visibility = 'visible';
    cursorAnti.style.visibility = 'visible';
    document.addEventListener('mousemove', e=> {
        map.on('mousemove', event=> {
            cursor.style.top = e.pageY-20+'px';
            cursor.style.left = e.pageX-20+'px';
            var mouseX = event.containerPoint.x;
            var mouseY = event.containerPoint.y;
            var latLng = map.containerPointToLatLng(L.point(mouseX, mouseY));
            var latLngAnti = L.latLng(-latLng.lat, latLng.lng+180);
            map2.setView(latLngAnti, map.getZoom());
            cursorAnti.style.top = carteAnti.offsetTop+carteAnti.offsetHeight/2-20+'px';
            cursorAnti.style.left = carteAnti.offsetLeft+carteAnti.offsetWidth/2-20+'px';

        })
        map.on('mouseout', function() {   
            cursor.style.visibility = 'hidden';
            cursorAnti.style.visibility = 'hidden';
        })
    })
}

function remetCurseur() {
    div.style.cursor = 'auto';
    cursor.style.visibility = "hidden";
    cursorAnti.style.visibility = 'hidden';
}