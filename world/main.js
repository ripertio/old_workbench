let startLayer = L.tileLayer.provider('OpenTopoMap');
let map = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});
L.control.layers({
    "OpenTopoMap": startLayer,
    //"Stadia.AlidadeSmooth" : L.tileLayer.provider('OStadia.AlidadeSmooth'),
    //"Stadia.AlidadeSmoothDark" : L.tileLayer.provider('Stadia.AlidadeSmoothDark'),
    "Thunderforest.OpenCycleMap": L.tileLayer.provider('Thunderforest.OpenCycleMap'),
    "Thunderforest.SpinalMap": L.tileLayer.provider('Thunderforest.SpinalMap'),
    "CyclOSM": L.tileLayer.provider('CyclOSM'),
    "Stamen.Watercolor": L.tileLayer.provider('Stamen.Watercolor'),
}).addTo(map);