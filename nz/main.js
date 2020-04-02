//alter ("Hallo Welt")
/*
var mapNapier = L.map('map').setView([-39.490556, 176.904444], 13);
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>tributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https:/ntopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mapNapier)
var markerNapier = L.marker([-39.490556, 176.904444]).addTo(mapNapier)
markerNapier.bindPopup("Napier-Stadt").openPopup();

*/

let mapdiv = document.querySelector("#map");
let map = L.map("map", {
            center: [
                mapdiv.dataset.lat,
                mapdiv.dataset.lng
            ],
            zoom: 13,
            layers: [
                L.tileLayer.provider('OpenTopoMap')
            ]
        });
let mrk = L.marker([
    mapdiv.dataset.lat,
    mapdiv.dataset.lng
]).addTo(map);

mrk.bindPopup(mapdiv.dataset.title).openPopup();