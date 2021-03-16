let startLayer = L.tileLayer.provider('Stamen.TonerLite');
let map = L.map("map", {
    center: [30, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});
let layer_pop_dens = L.featureGroup().addTo(map);
let lyer_case_per_100000 =  L.featureGroup();



//console.log(cov_data[0].features)
let data = cov_data[0].features;

let country_data = []; // variable für Choropleth
let Population_density = [];
let inzidenz7 = []; // variable für Choropleth

for (let i = 1; i < data.length; i++) {
    let countries = data[i];
    //console.log(countries.properties.population_density)
    country_data.push(countries)
    Population_density.push(countries.properties.population_density)

};
console.log(country_data);

L.control.layers({
    "Stamen.TonerLite": startLayer,
    "OpenStreetMap.DE": L.tileLayer.provider('OpenStreetMap.DE'),
}, {
    "Population Density": layer_pop_dens,
    "Fälle pro 100 000 Einwohner_innen" : lyer_case_per_100000,
}

).addTo(map);
L.geoJson(country_data).addTo(layer_pop_dens);


function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
};
function style(feature) {
    return {
        fillColor: getColor(feature.properties.population_density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
L.geoJson(country_data, {style: style}).addTo(layer_pop_dens);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
console.log(country_data[country_data.length-1].properties.data[country_data[country_data.length-1].properties.data.length-1])

function style(feature) {
    return {
        fillColor: getColor(feature.properties.data[feature.properties.data.length-1].new_cases_per_million),
        weight: 1,
        opacity: 10,
        color: 'grey',
        fillOpacity: 0.9
    };
}
L.geoJson(country_data, {style: style}).addTo(lyer_case_per_100000);


/*let drawCircles = function () {
    //console.log(data);
    let data = CONFIRMED;
    let header = CONFIRMED[0];
    let index = document.querySelector("#slider").value;
    let options = document.querySelector("#pulldown").options;
    let value = options[options.selectedIndex].value;
    let label = options[options.selectedIndex].text;
    let color;
    //console.log(value,label,options);

    if (value === "confirmed") {
        data = CONFIRMED;
        color = "blue";
    } else if (value === "deaths") {
        data = DEATHS;
        color = "purple";
    } else {
        data = RECOVERED;
        color = "green";
    };
    //console.log(CONFIRMED== RECOVERED)
    //Datum & Thema anzeigen lassen 
    document.querySelector("#datum").innerHTML = ` am ${header[index]} - ${label}`;

    circleGroup.clearLayers();
    //funktion um die großen Kreise nach hinten zu schieben damit die kleinen Kreise auch angewählt werden können
    data.sort(function compareNumbers(row1, row2) {
        return row2[index] - row1[index];
    });
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        //console.log(row[2], row[3]);
        let lat = row[2];
        let lng = row[3];
        let reg = `${row[0]}${row[1]}`;
        let val = row[index];

        if (val === "0") {
            continue;
            //console.log (val)
        };
        // let mrk =L.marker ([lat,lng]).addTo(map);
        // mrk.bindPopup(`${reg}: ${val}`);
        let s = 0.5;
        let r = Math.sqrt(val * s / Math.PI) * 0.5

        let circle = L.circleMarker([lat, lng], {
            radius: r,
            color: color
        }).addTo(circleGroup);
        circle.bindPopup(`${reg}: ${val}`);
    }
}; */
document.querySelector("#pulldown").onchange = function () {
    drawCircles();
}
let slider = document.querySelector("#slider");
slider.min = 4;
slider.max = CONFIRMED[0].length - 1;
slider.step = 1;
slider.value = slider.max;

slider.onchange = function () {
    drawCircles();
}


drawCircles()
//drawCircles(RECOVERED)
//drawCircles(DEATHS)

let playButton = document.querySelector("#play");
let runningAnimation = null;
playButton.onclick = function () {
    let value = slider.min;
    if (slider.value == slider.max) {
        value = slider.min;
    } else {
        value = slider.value;
    }

    playButton.value = "⏸️";

    if (runningAnimation) {
        window.clearInterval(runningAnimation);
        playButton.value = "▶️";
        runningAnimation = null;
    } else {
        runningAnimation = window.setInterval(function () {
            slider.value = value;
            drawCircles();
            value++;

            if (value > slider.max) {
                window.clearInterval(runningAnimation);
            }
            console.log(value)
        }, 250)
    }
};
