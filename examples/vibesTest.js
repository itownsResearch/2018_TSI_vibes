/* global itowns, document, GuiTools */
// # Simple Globe viewer

// Define initial camera position
// Coordinate can be found on https://www.geoportail.gouv.fr/carte
// setting is "coordonnée geographiques en degres decimaux"

// Position near Gerbier mountain.
var positionOnGlobe = { longitude: 2.396387, latitude: 48.848701, altitude: 2000 };

// `viewerDiv` will contain iTowns' rendering area (`<canvas>`)
var viewerDiv = document.getElementById('viewerDiv');

// Instanciate iTowns GlobeView*
var globeView = new itowns.GlobeView(viewerDiv, positionOnGlobe);

// GUI initialization
var menuGlobe = new GuiTools('menuDiv');

var promiseElevation = [];

menuGlobe.view = globeView;

function addLayerCb(layer) {
    return globeView.addLayer(layer).then(function addGui(la) {
        if (la.type === 'color') {
            menuGlobe.addImageryLayerGUI(la);
        } else if (la.type === 'elevation') {
            menuGlobe.addElevationLayerGUI(la);
        }
    });
}
// Add one imagery layer to the scene
// This layer is defined in a json file but it could be defined as a plain js
// object. See Layer* for more info.
// itowns.Fetcher.json('./layers/JSONLayers/Ortho.json').then(addLayerCb);
itowns.Fetcher.json('./layers/JSONLayers/Ortho.json').then(result => addLayerCb(result));

// Add two elevation layers.
// These will deform iTowns globe geometry to represent terrain elevation.
promiseElevation.push(itowns.Fetcher.json('./layers/JSONLayers/WORLD_DTM.json').then(result => addLayerCb(result)));
promiseElevation.push(itowns.Fetcher.json('./layers/JSONLayers/IGN_MNT_HIGHRES.json').then(result => addLayerCb(result)));

// Geolocation default parameters
var coord = new itowns.Coordinates('EPSG:4326', 2.396159, 48.848264, 50);
var rotateX = Math.PI/2;
var rotateY = 0;
var rotateZ = 0;
var scale = 300;

// Loader initialization
var loader = new itowns.ModelLoader(globeView);

// Symbolizer
var symbolizer = function(view, listObj, listEdge, menu, nbSymbolizer, light, plane) {
    return new itowns.Symbolizer(view, listObj, listEdge, menu, nbSymbolizer, light, plane);
}

// Layer management
var manager = new itowns.LayerManager(globeView, document, menuGlobe, coord, rotateX, rotateY, rotateZ, scale, loader, symbolizer)
window.onload = () => manager.initListener();

// Listen for globe full initialisation event
globeView.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function init() {
    globeView.controls.setOrbitalPosition({ heading: 30, tilt: 30 });
    globeView.controls.setZoom(13, true);
    document.getElementById('viewerDiv').addEventListener('mousemove', function() { 
        document.getElementById('result').innerHTML = "Longitude : " + globeView.controls.getCameraTargetGeoPosition().longitude() + ", Latitude : " + globeView.controls.getCameraTargetGeoPosition().latitude(); 
    }) 
});

function loadFileException(message) {
    this.message = message;
    this.name = "loadFileException";
 }

var loader2 = new itowns.ModelLoader(globeView);
loader2.loadBati3D();
