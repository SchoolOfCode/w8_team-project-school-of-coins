const playerCardElem = document.querySelector("#player-cards");
const computerCardElem = document.querySelector("#computer-cards");
const startGameBtn = document.querySelector("#start-game");
const drawCardBtn = document.querySelector("#draw-card");
const playerScoreDisplayElem = document.querySelector("#player-score");
const computerScoreDisplayElem = document.querySelector("#computer-score");
const standBtn = document.querySelector("#stand");

startGameBtn.addEventListener("click", startGame);
drawCardBtn.addEventListener("click", drawPlayerCard);
standBtn.addEventListener("click", stand);

const player = {
    "id":"player",    
    "username": "Emilio",
    "hand":[],
    "score":0,
    "balance": 100000
}
const computer = {
    "id":"player",    
    "username": "Lewis",
    "hand":[],
    "score":0,
    "balance": 100000
}

const royals = ["KING", "JACK", "QUEEN"];
let deckID;

async function getDecks(){
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    const newDecks = await response.json();
    deckID = await newDecks.deck_id;
}

async function drawPlayerCard(){
    try{
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
        const drawCard = await response.json();
        let card = await displayPlayerCard(drawCard.cards[0]);
        player["hand"].push(drawCard);
        console.log(drawCard)
        let cardVal = 0;
        if (royals.includes(drawCard.cards[0].value)){
            cardVal += 10;
        } else if (drawCard.cards[0].value === "ACE"){
            cardVal += 11
        } else cardVal += parseInt(drawCard.cards[0].value);
        player["score"] += cardVal;
        displayPlayerScore();
        return drawCard.cards[0];
    }
    catch {drawPlayerCard()};
}

function displayPlayerCard(card){
    const imgElem = document.createElement("img");
    imgElem.src=card.image;
    playerCardElem.appendChild(imgElem);
}

function displayPlayerScore(){
    playerScoreDisplayElem.innerHTML = player.score;
}

function startGame(){
    drawComputerCard();
    drawPlayerCard();
    drawPlayerCard();

}

async function drawComputerCard(id=0){
    try{
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
        const drawCard = await response.json();
        let card = await displayComputerCard(drawCard.cards[0]);
        computer["hand"].push(drawCard);
        console.log(drawCard)
        let cardVal = 0;
        if (royals.includes(drawCard.cards[0].value)){
            cardVal += 10;
        } else if (drawCard.cards[0].value === "ACE"){
            cardVal += 11
        } else cardVal += parseInt(drawCard.cards[0].value);
        computer["score"] += cardVal;

        if (id == 0){
            let hiddenCard = document.createElement("img");
            hiddenCard.src = "images/back.jpg";
            hiddenCard.id = "hidden-card";
            computerCardElem.appendChild(hiddenCard)
        }

        displayComputerScore();
        return drawCard.cards[0];
    }
    catch {drawComputerCard()};
}

function displayComputerCard(card){
    const imgElem = document.createElement("img");
    imgElem.src=card.image;
    computerCardElem.appendChild(imgElem);
}

function displayComputerScore(){
    computerScoreDisplayElem.innerHTML = computer.score;
}

function stand(){
    let hiddenCard = document.querySelector("#hidden-card");
    hiddenCard.style.display = "none";
    drawComputerCard(1);
}

window.onload = getDecks();