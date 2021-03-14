let startLayer = L.tileLayer.provider('Stamen.TonerLite');
let map = L.map("map", {
    center: [30, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});
let keyfeatures = L.featureGroup().addTo(map);

L.control.layers({
        "Stamen.TonerLite": startLayer,
        "OpenStreetMap.DE": L.tileLayer.provider('OpenStreetMap.DE'),
    }, {
        "7 Tages Inzidenz": keyfeatures
    }

).addTo(map);
L.geoJson(COUNTRIES).addTo(map);

console.log(cov_data)






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