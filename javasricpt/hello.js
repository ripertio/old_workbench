// alert ("Hello world");


// Let message = "Hello World";
//alert(message);
// message )"Hallo Welt";
//alert (message);

const LINK_COLOR = "#ff0000";
console.log("Link bitte in der Farbe ", LINK_COLOR)


let highscore = 520233
console.log(highscore / 10)

let firstname = "Bob"
let lastname = "Jooo"

console.log('Name: ', firstname, lastname);

let template = `Dein Highscore sind ${highscore} Punkte`;
console.log(template);

let isOver18 = "true";
console.log(isOver18)

let age = 18;
console.log("über 18", age > 18);

let participants = ["John", "Jane", "Max"];
console.log(participants)
console.log("eingräge im Arrey: ", participants.length)

let gameHighscores = [2099, 3010, 3333, 5000]
console.log(gameHighscores)

let user = {
    firstname: "JOhn",
    lastname: "Bob",
    age: 25
};

console.log(user)
user.highscore = 200;
console.log(user)


// let a =2
// let b =5
// console.log (a+b)
// console.log (a/(b-2))

// a++;
// console.log(a);
// let myAge = prompt ("Wie alt bist du?");
// console.log (`Du bist ${myAge} Jahre alt`);
// console.log (`über 18? ${myAge >18}`) ;
// if (myAge > 18) {console.log ("Glückwunsch du bist über 18");
// }
// else {
//     console.log ("Leider unter 18");
// }

for (let i = 0; i < 10; i++) {
    console.log(`Schleife ${i}`);
}

for (let j = 0; j < participants.length; j++) {
    const participant = participants[j];
    console.log(`Teilnermer_in ${j} ${participant}`);
};

participants.forEach(participant => {
    console.log(`Teilnehmer_in ${participant}`)
});

//Funktion
function showAge(birthYear) {
    console.log(`Du bist ca. ${2020- birthYear} Jahre Alt`)
}

showAge(1994)

function calcAge(birthYear) {
    return 2020 - birthYear;
}

console.log(`Max ist ${calcAge(1997)} Jahre alt (ca.)`);


let birthYears = [1965, 1877, 1985, 2003, 2012];
console.log(birthYears);

birthYears.forEach(year => {
    console.log(`Geboren ${year}; heute ca. ${calcAge(year)} Jahre alt.`);
});

let users = [{
        firstname: "John",
        lastname: "Bob",
        birthyear: 1960
    },
    {
        firstname: "Jan",
        lastname: "doe",
        birthyear: 1960
    },
    {
        firstname: "max",
        lastname: "Mensch",
        birthyear: 1960
    },
];

console.log(users);

users.forEach(user => {
    console.log(`${user.firstname} ist oder wird heuer ${calcAge(user.birthYear)} Jahre alt.`);
});


let firstParagraph = document.querySelector ("#pFirst");
console.log(firstParagraph);
//firstParagraph.remove();

firstParagraph.innerHTML ="Test";
firstParagraph.style.color ="red";

let indentedParas = document.querySelectorAll (".ident");
console.log(indentedParas);

indentedParas.forEach((para, index) => {
    console.log(`data attribut LAT ${para.dataset.lat}`)
    para.innerHTML = `Àbsatz ${index}`;
    if ( index % 2 == 0) {
     para.style.color= "pink";
    }
});