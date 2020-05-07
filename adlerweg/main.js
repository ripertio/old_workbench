let startLayer = L.tileLayer.provider("BasemapAT.terrain");

let map = L.map("map", {
    center: [47.25, 11.5],
    zoom: 9,
    layers: [
        startLayer
    ]
});

let overlay = {
    adlerblicke: L.featureGroup(),
    adlerweg: L.featureGroup(),
    einkehr: L.featureGroup(),
    wikipedia: L.featureGroup(),

}

L.control.layers({
    "BasemapAT.grau": L.tileLayer.provider("BasemapAT.grau"),
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
    "BasemapAT.highdpi": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT.terrain": startLayer,
    "BasemapAT.surface": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT.overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT.orthofoto+overlay": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}, {
    "Adlerblicke": overlay.adlerblicke,
    "Adlerweg": overlay.adlerweg,
    "Einkehrmöglichkeiten": overlay.einkehr,
    "Wikipediaartikel": overlay.wikipedia,
}).addTo(map);

//console.log ("Adlerwerg", ADLERBLICKE)

for (const blick of ADLERBLICKE) {
    //console.log(blick);
    let mrk = L.marker([blick.lat, blick.lng], {
        icon: L.icon({
            iconSize: [32.37], //nötig um zentrierung des Icons zu erzielen
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
            iconUrl: "icons/panoramicview.png"
        })
    }).addTo(overlay.adlerblicke);
    mrk.bindPopup(`Standort ${blick.standort} (${blick.seehoehe}m)`)

}

overlay.adlerblicke.addTo(map);

let drawEtappe = function (nr) {
    overlay.adlerweg.clearLayers();
    //console.log(ETAPPEN[nr].track);
    let track = ETAPPEN[nr].track.replace("A", "");
    //console.log(track);
    let gpx = new L.GPX(`gpx/AdlerwegEtappe${track}.gpx`, {
        async: true,
        marker_options: {
            startIconUrl: `icons/number_${nr}.png`,
            endIconUrl: 'icons/finish.png',
            shadowUrl: null,
            iconSize: [32.37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
            dashArray: [10, 10],
        },
        polyline_options: {
            color: "black",
            dashArray: [2, 5],

        }
    });

    gpx.on("loaded", function (evt) {
        map.fitBounds(evt.target.getBounds());
        controlElevation.clear();
        controlElevation.load(`gpx/AdlerwegEtappe${track}.gpx`);
    }).addTo(overlay.adlerweg);
    overlay.adlerweg.addTo(map);

    for (const key in ETAPPEN[nr]) {
        let val = "Einkehr mit Komma"
        if (key === "einkehr") {
            val = ETAPPEN[nr][key].replace(/#/g, ", ");
        } else {
            val = ETAPPEN[nr][key];
        }
        let elem = document.querySelector(`#et-${key}`)
        if (key === "track") {
            elem.href = `gpx/AdlerwegEtappe${ETAPPEN[nr][key].replace("A","")}.gpx`;
        } else if (elem) {
            elem.innerHTML = val;
            //console.log(val)
        }
        let eink = "Einkehr mit Komma"
        if (key === "einkehr") {
            val = ETAPPEN[nr][key].replace("#", ", ");
        } else {
            val = ETAPPEN[nr][key];
        }

    }
};
drawEtappe(1)

let pulldown = document.querySelector(`#pulldown`);
//console.log("hallo", pulldown);

for (let i = 1; i < ETAPPEN.length; i++) {
    const etappe = ETAPPEN[i];
    //console.log(etappe);
    pulldown.innerHTML += `<option value="${i}">${etappe.titel}</option>`;
}
pulldown.onchange = function (evt) {
    let nr = evt.target.options[evt.target.options.selectedIndex].value;
    drawEtappe(nr);
}

let drawEinkehr = function () {
    for (let einkehr of EINKEHR) {
        //console.log(einkehr);
        let mrk = L.marker([einkehr[2], einkehr[3]], {
            icon: L.icon({
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -37],
                iconUrl: "icons/restaurant.png"
            })
        }).addTo(overlay.einkehr);
        mrk.bindPopup(`${einkehr[1]} (Etappe ${einkehr[0]})`);
    }
};
drawEinkehr();
overlay.einkehr.addTo(map);

let controlElevation = L.control.elevation({
    theme: "adler-theme",
    dtached: true,
    elevationDiv: "#profile",
    followMarker: false,
}).addTo(map);

L.control.scale({
    imperial: false,
}).addTo(map);

let drawMarkers = {};

map.on("zoomend moveend", function (evt) {
    let ext = {
        north: map.getBounds().getNorth(),
        south: map.getBounds().getSouth(),
        east: map.getBounds().getEast(),
        west: map.getBounds().getWest()
    };
    let url = `https://secure.geonames.org/wikipediaBoundingBoxJSON?north=${ext.north}&south=${ext.south}&east=${ext.east}&west=${ext.west}&username=obelix369&lang=de&maxRows=30`
    //console.log(url);

    let wiki = L.Util.jsonp(url).then(function (data) {
        //console.log(data.geonames);
        for (let article of data.geonames) {
            let ll = `${article.lat}${article.lng}`;
            if (drawMarkers[ll]) {
                continue;                
            } else {
                drawMarkers[ll] = true;
            }
            let png = "";
                switch (article.feature) {
                    case "city":
                        png = "city.png";
                        break;
                    case "landmark":
                        png = "landmark.png";
                        break;
                    case "waterbody":
                        png = "water.png";
                        break;
                    case "river":
                        png = "river.png";
                        break;
                    case "mountain":
                        png = "mountain.png"
                        break;
                    default: "info"
                        png = "info.png";
                    }
                    console.log(png);
            let mrk = L.marker([article.lat, article.lng], {
                icon: L.icon({
                    iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                    iconUrl: `icons/${png}`
                })
            }).addTo(overlay.wikipedia);
            let img = "";
            if (article.thumbnailImg) {
                img = `<img src="${article.thumbnailImg}" alt="thumbnail">`
            }
            mrk.bindPopup(`
            <small>${article.feature}</small>
            <h3>${article.title} (${article.elevation}m)</h3>
            ${img}
            <p>${article.summary}</p>
            <a target="wikipedia" href="https://${article.wikipediaURL}">Wikipedia Artikel</a>
            `)
        }
    });
});
overlay.wikipedia.addTo(map);
