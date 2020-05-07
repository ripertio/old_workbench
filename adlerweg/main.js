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
        let mrk = L.marker([einkehr[2],einkehr[3]], {
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
    theme: "steelblue-theme",
    dtached: true, 
    elevationDiv:"#profile",
    followMarker: false, 
});