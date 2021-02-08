"use strict";
/***************Global Variable***************/
let min;
let max;
let myTimer;
let resultat;
/***************Sound Files***************/
const chrono = new Audio("sounds/chrono.mp3");
const over = new Audio("sounds/lost.mp3");
const wrong = new Audio("sounds/wrong.mp3");
const right = new Audio("sounds/right.mp3");
/***************Init values***************/
let widthBar = 0;
let step = 5;
const random = () => Math.floor(Math.random() * (max - min + 1)) + min;

/***************Input Value Verification***************/
minNum.oninput = verifInput;
maxNum.oninput = verifInput;

function verifInput() {
    if (this.value != "") {
        if (this.value < 0) this.value = -this.value;
        if (this.value > 100) this.value = 100;
        this.value = parseInt(this.value);
    }
}

/***************Start Game***************/
btnStart.onclick = init;

reponse.oninput = () => {
    resultat = number1.textContent * number2.textContent;

    if (reponse.value.length === resultat.toString().length) {
        clearInterval(myTimer);
        chrono.pause();
        chrono.currentTime = 0;
        if (resultat == reponse.value) nextNumber();
        else gameOver();

    }
    else if (reponse.value[0] !== resultat.toString()[0])
        gameOver();
};

/***************Init the Game***************/
function init() {
    container_start.style.display = "none";
    container_jeu.style.display = "block";
    document.body.classList.add("filterBlur"); //blur effect

    myTimer = setInterval(timer, 500);

    min = (minNum.value) ? parseInt(minNum.value) : 2;
    max = (maxNum.value) ? parseInt(maxNum.value) : 10;

    if (min > max) [min, max] = [max, min]; //reverse min/max

    number1.textContent = random();
    number2.textContent = random();
    reponse.focus();
}

/***************Replay Function***************/
btnReplay.onclick = () => {
    container_gameOver.style.display = "none";
    score.textContent = 0;

    number1.textContent = random();
    number2.textContent = random();
    reponse.value = "";
    widthBar = -5;
    step = 5;
    myTimer = setInterval(timer, 500);
    reponse.focus();
};

/***************Timer Function***************/
function timer() {
    chrono.play();
    widthBar += step;

    if (widthBar > 100) {
        widthBar = 100; //blok to 100%
        container_brain.classList.add("rotate");
        clearInterval(myTimer);
        chrono.pause();
        chrono.currentTime = 0;
        over.play();
        gameOver();
    }

    if (widthBar == 70) chrono.playbackRate = 1.2;

    progressBar.style.width = widthBar + "%";
}

/***************Next Number Function***************/
function nextNumber() {
    right.play();
    score.textContent++;
    document.body.style.borderColor = "green";

    setTimeout(() => {
        document.body.style.borderColor = "gold";
        number1.textContent = random();
        number2.textContent = random();
        reponse.value = "";
        widthBar = -5;
        step = (step < 15) ? step + 1 : 15;
        console.log(step);
        myTimer = setInterval(timer, 500);
    }, 500);
}

/***************Game Over Function***************/
function gameOver() {
    clearInterval(myTimer);
    chrono.pause();
    wrong.play();
    document.body.style.borderColor = "red";
    reponse.blur();

    setTimeout(() => {
        document.body.style.borderColor = "gold";
        container_gameOver.style.display = "flex";
        clearInterval(myTimer);
        resultat = resultat ? resultat : number1.textContent * number2.textContent;
        bonneReponse.textContent = `${number1.textContent} x ${number2.textContent} = ${resultat}`;
        scoreFinal.textContent = score.textContent;
    }, 1500);
}


/***************Prevent Resize cause keyboard***************/
const metas = document.getElementsByTagName('meta');
metas[1].content = 'width=device-width, height=' + window.innerHeight + ' initial-scale=1.0, maximum-scale=5.0,user-scalable=0';