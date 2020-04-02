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
    "Stamen.TonerLite": L.tileLayer.provider('Stamen.TonerLite'),
    "OpenStreetMap.DE": L.tileLayer.provider('OpenStreetMap.DE'),
}).addTo(map);


console.log(CONFIRMED);

for (let i = 1; i < CONFIRMED.length; i++) {
    const row = CONFIRMED[i];
    console.log(row[2], row[3]);
    let val =row[row.length-1];
    let mrk =L.marker ([row[2],row[3]]).addTo(map);
    mrk.bindPopup(`${row[0]}${row[1]}: ${val}`);
}