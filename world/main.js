let startLayer = L.tileLayer.provider('OpenTopoMap');
let map = L.map ("map", {
    center: [0,0],
    zoom: 2,
    layers: [
        startLayer
    ]
});
L.control.layers({
    "OpenTopoMap" : startLayer,
    "Stadia.AlidadeSmooth" : L.tileLayer.provider('OStadia.AlidadeSmooth'),
}).addTo(map)