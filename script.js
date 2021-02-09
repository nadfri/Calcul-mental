"use strict";
/***************Global Variable***************/
let min;
let max;
let step;
let score;
let hiScore;
let myTimer;
let resultat;
let widthBar;
let firstRecord;

/***************Sound Files***************/
const over = new Audio("sounds/lost.mp3");
const wrong = new Audio("sounds/wrong.mp3");
const right = new Audio("sounds/right.mp3");
const chrono = new Audio("sounds/chrono.mp3");
const newRecord = new Audio("sounds/hiScore.mp3");
const tabAudio = [chrono, over, wrong, right, newRecord];
mute(localStorage.getItem("sound")); //mute function

/***************Start Game***************/
btnStart.onclick = init;
btnHome.onclick = home;

minNum.oninput = verifInput;
maxNum.oninput = verifInput;

reponse.oninput = () => {
    if (reponse.value[0] !== resultat.toString()[0])
        gameOver();

    else if (reponse.value.length === resultat.toString().length) {

        if (resultat == reponse.value) nextNumber();
        else gameOver();
    }
};

/***End Game Code***/

/***************Random Function***************/
function newNumbersRandom() {
    const random = () => Math.floor(Math.random() * (max - min + 1)) + min;
    number1.textContent = random();
    number2.textContent = random();
    resultat = number1.textContent * number2.textContent;
}

/***************Input Value Verification***************/
function verifInput() {
    if (this.value != "") {
        if (this.value < 0) this.value = -this.value;
        if (this.value > 100) this.value = 100;
        this.value = parseInt(this.value);
    }
}

/***************Init the Game***************/
function init() {
    widthBar = 0;
    step = 5;
    score = 0;
    firstRecord = true;
    hiScore = localStorage.getItem("hiScore") || "5";
    hiScoreID.textContent = hiScore;

    installBtn.classList.remove("slide"); //affiche la banniere perso
    container_start.style.display = "none";
    container_jeu.style.display = "block";
    document.body.classList.add("filterBlur"); //blur effect

    myTimer = setInterval(timer, 500);

    min = (minNum.value) ? parseInt(minNum.value) : 2;
    max = (maxNum.value) ? parseInt(maxNum.value) : 10;

    if (min > max) [min, max] = [max, min]; //reverse min/max

    newNumbersRandom();
    reponse.focus();
}

/***************Timer Function***************/
function timer() {
    chrono.play();
    widthBar += step;

    if (widthBar > 100) {
        widthBar = 100; //blok to 100%
        container_brain.classList.add("rotate");
        gameOver();
    }

    if (widthBar > 60) chrono.playbackRate = 1.2;

    progressBar.style.width = widthBar + "%";
}

/***************Next Calcul Function***************/
function nextNumber() {
    clearInterval(myTimer);
    chrono.currentTime = 0;
    chrono.pause();

    right.play();
    document.body.style.borderColor = "#28df99";
    score++;
    scoreID.textContent = score;

    newHiScore();

    setTimeout(() => {
        document.body.style.borderColor = "gold";
        newNumbersRandom();
        reponse.value = "";
        widthBar = -5;
        step = (step < 15) ? step + 1 : 15;
        chrono.playbackRate = 1;
        myTimer = setInterval(timer, 500);
    }, 700);
}

/***************New HighScore Function***************/
function newHiScore() {
    if (min < 3 && max > 9) {
        if (score > hiScore) {
            localStorage.setItem("hiScore", score);
            hiScoreID.textContent = score;
            if (firstRecord) {
                newRecord.play();
                firstRecord = false;
            }
        }
    }
}
/***************Replay Function***************/
btnReplay.onclick = () => {
    document.body.classList.add("filterBlur"); //blur effect
    container_gameOver.style.display = "none";
    container_brain.classList.remove("rotate");
    score = 0;
    scoreID.textContent = 0;
    hiScoreID.textContent = hiScore;
    firstRecord = true;

    newNumbersRandom();

    reponse.value = "";
    widthBar = -5;
    step = 5;
    chrono.playbackRate = 1;
    chrono.currentTime = 0;
    myTimer = setInterval(timer, 500);
    reponse.focus();
};

/***************Back Home Function***************/
function home() {
    installBtn.classList.add("slide"); //affiche la banniere perso
    container_start.style.display = "block";
    container_jeu.style.display = "none";
    container_gameOver.style.display = "none";
    reponse.value = "";
}


/***************Game Over Function***************/
function gameOver() {
    chrono.pause();
    clearInterval(myTimer);

    (widthBar == 100) ? over.play() : wrong.play();

    document.body.style.borderColor = "red";
    reponse.blur();

    setTimeout(() => {
        document.body.classList.remove("filterBlur"); //blur effect
        document.body.style.borderColor = "gold";
        container_gameOver.style.display = "flex";

        bonneReponse.textContent = `${number1.textContent} x ${number2.textContent} = ${resultat}`;
        scoreFinal.textContent = score;
        if (!firstRecord) scoreFinal.textContent += "\nNouveau Record!";
    }, 1000);
}

/***************Sound Control***************/
function mute(sound) {
    if (sound == "off") {
        speaker.textContent = "🔈";
        for (let audio of tabAudio) audio.muted = true;
    }
}

speaker.onclick = () => {
    if (speaker.textContent == "🔊") {
        speaker.textContent = "🔈";
        for (let audio of tabAudio) audio.muted = true;
        localStorage.setItem("sound", "off");
    }

    else {
        speaker.textContent = "🔊";
        for (let audio of tabAudio) audio.muted = false;
        localStorage.setItem("sound", "on");
    }
};

function mutedOnScreen() {
    if (document.hidden)
        for (let audio of tabAudio) audio.muted = true;
    else
        for (let audio of tabAudio) audio.muted = false;

}
document.addEventListener("visibilitychange", mutedOnScreen, false);

/***************Prevent Resize cause keyboard***************/
const metas = document.getElementsByTagName('meta');
metas[1].content = 'width=device-width, height=' + window.innerHeight + ' initial-scale=1.0, maximum-scale=5.0,user-scalable=0';

/******************Bouton d'Installation PWA******************/
window.onbeforeinstallprompt = (event) => {
    installBtn.classList.add("slide"); //affiche la banniere perso

    event.preventDefault(); // annuler la banniere par defaut

    installBtn.onclick = () => {
        installBtn.classList.remove("slide"); //faire disparaitre le bouton
        setTimeout(() => installBtn.style.display = "none", 500);
        event.prompt(); //permettre l'installation
    };
};

/******************Service Worker ******************/
//Register service worker to control making site work offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('sw.js')
            .then(registration => {
                console.log(
                    `Service Worker enregistré ! Ressource: ${registration.scope}`
                );
            })
            .catch(err => {
                console.log(
                    `Echec de l'enregistrement du Service Worker: ${err}`
                );
            });
    });
}

