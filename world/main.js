let startLayer = L.tileLayer.provider('Stamen.TonerLite');
let map = L.map("map", {
    center: [30, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});
let circleGroup = L.featureGroup().addTo(map);

L.control.layers({
        "OpenTopoMap": L.tileLayer.provider('OpenTopoMap'),
        //"Stadia.AlidadeSmooth" : L.tileLayer.provider('OStadia.AlidadeSmooth'),
        //"Stadia.AlidadeSmoothDark" : L.tileLayer.provider('Stadia.AlidadeSmoothDark'),
        "Thunderforest.OpenCycleMap": L.tileLayer.provider('Thunderforest.OpenCycleMap'),
        "Thunderforest.SpinalMap": L.tileLayer.provider('Thunderforest.SpinalMap'),
        "CyclOSM": L.tileLayer.provider('CyclOSM'),
        "Stamen.Watercolor": L.tileLayer.provider('Stamen.Watercolor'),
        "Stamen.TonerLite": startLayer,
        "OpenStreetMap.DE": L.tileLayer.provider('OpenStreetMap.DE'),
    }, {
        "Bestätigte COVID 19 Fälle": circleGroup
    }

).addTo(map);

let drawCircles = function () {
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
        color ="purple";
    } else  {
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
        } ;
        // let mrk =L.marker ([lat,lng]).addTo(map);
        // mrk.bindPopup(`${reg}: ${val}`);
        let s = 0.5;
        let r = Math.sqrt(val * s / Math.PI) *0.5

        let circle = L.circleMarker([lat, lng], {
            radius: r,
             color: color
        }).addTo(circleGroup);
        circle.bindPopup(`${reg}: ${val}`);
    }
};
document.querySelector("#pulldown").onchange = function () {
    drawCircles();
}
let slider = document.querySelector("#slider");
slider.min = 4;
slider.max = CONFIRMED[0].length-1;
slider.step =1;
slider.value = slider.max;

slider.onchange = function () {
    drawCircles();
}


drawCircles()
//drawCircles(RECOVERED)
//drawCircles(DEATHS)