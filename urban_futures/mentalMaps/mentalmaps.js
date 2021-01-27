let startLayer = L.tileLayer.provider('OpenStreetMap.Mapnik')
	
let map = L.map("map", {
    center: [47.260628556714636, 11.3876325479441],
    zoom: 14,
    layers: [
        startLayer
    ]
});
let jakeGroup = L.markerClusterGroup().addTo(map);
let rosaGroup = L.markerClusterGroup().addTo(map);
let holdGroup = L.markerClusterGroup().addTo(map);



L.control.layers({
    "OpenStreeMap ": startLayer,
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
}, {
    "Punkte Jake": jakeGroup,
    "Punkte Rosa": rosaGroup,
    "Punkte Hold": holdGroup,
}).addTo(map);

jake = person_jake;

console.log(jake);

for (let i = 1; i < jake.length; i++) {
    const row = jake[i];
    //console.log(row[1], row[2]);
    let lat = row[1];
    let lng = row[2];
    let pic = row[3];
    let text = row[4];
    console.log(lat, lng, pic, text);

    
    let mrk =L.marker ([lat,lng]).addTo(jakeGroup);
    mrk.bindPopup(`Jakes Marker "<img src="${pic}">: ${text}`);
    };

rosa = person_rosa;


for (let i = 1; i < rosa.length; i++) {
    const row = rosa[i];
    console.log(row[1], row[2]);
    let lat = row[1];
    let lng = row[2];
    let pic = row[3];
    let text = row[4];
    console.log(lat, lng, pic, text);

    
    let mrk =L.marker ([lat,lng]).addTo(rosaGroup);
    mrk.bindPopup(`Rosas Marker "<img src="${pic}">: ${text}`);
    };

let allLayers = L.featureGroup([jakeGroup,rosaGroup,holdGroup]).addTo(map);
map.fitBounds(allLayers.getBounds(),{padding: [5, 5]});


    /*let jake = person_jake , {
    pointToLayer: function (point, latlng) {
        let icon = L.icon({
            iconUrl: 'icons/sight.svg',
            iconSize: [30, 30],
        });
        let marker = L.marker(latlng, {
            icon: icon
        });
        //console.log("point", point);
        marker.bindPopup(`<h3>${point.properties.NAME}</h3>
        <p>${point.properties.ADRESSE}</p>
        <p>${point.properties.BEMERKUNG}</p>
        <p><a target="links" href="${point.properties.WEITERE_INF}">Link</a></p>
        `);

        return marker;
    }
});
jake.on("data:loaded", function () {
    jakeGroup.addLayer(jakes);
    //console.log(`dataloaded!`);
    map.fitBounds(jakeGroup.getBounds());
});

let wandernRundum = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WANDERWEGEOGD&srsName=EPSG:4326&outputFormat=json";
let wandernStadt = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WANDERWEGEOGD&srsName=EPSG:4326&outputFormat=json";

L.geoJson.ajax(wandernRundum, {
    onEachFeature: function (featureRundum, layer) {
        //console.log("FeatureRundum", featureRundum);
        layer.bindPopup(`<h3>${featureRundum.properties.BEZ_TEXT}</h3>`);
    },
    filter: function (featureRundum) {
        return featureRundum.properties.TYP === "2";
    },
    style: function () {
        return {
            color: "black",
            weight: 4,
            //gepunkted
            dashArray: "0.1 , 7",

        };
    },
}).addTo(walkGroup);

L.geoJson.ajax(wandernStadt, {
    onEachFeature: function (featureStadt, layer) {
        console.log("FeatureStadt", featureStadt);
        layer.bindPopup(`<h3>${featureStadt.properties.BEZ_TEXT} </h3>`);
    },
    filter: function (featureStadt) {
        return featureStadt.properties.TYP === "1";
    },
    style: function () {
        return {
            color: "black",
            weight: 4,
            //gestrichelt
            dashArray: "10 , 10",

        };
    }
}).addTo(walkGroup);


let heritageA = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WELTKULTERBEOGD&srsName=EPSG:4326&outputFormat=json";

let heritageB = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WELTKULTERBEOGD&srsName=EPSG:4326&outputFormat=json";


L.geoJson.ajax(heritageA, {
    onEachFeature: function (feature, layer) {
        //console.log("Feature", feature);
        layer.bindPopup(`<h3>${feature.properties.NAME}</h3> <p>${feature.properties.INFO}</p>`);
        let zone = feature.properties.TYP
    },
    filter: function (feature) {
        return feature.properties.TYP === "2";
    },
    style: function () {
        return {
            color: "yellow",
            fillOpacity: 0.3
        };
    },
}).addTo(heritageGroup);

L.geoJson.ajax(heritageB, {
    onEachFeature: function (feature, layer) {
        //console.log("Feature", feature);
        layer.bindPopup(`<h3>${feature.properties.NAME}</h3> <p>${feature.properties.INFO}</p>`);
        let zone = feature.properties.TYP
    },
    filter: function (feature) {
        return feature.properties.TYP === "1";
    },
    style: function (feature) {
        return {
            color: "red",
            fillOpacity: 0.3
        };
    },

}).addTo(heritageGroup); 

*/