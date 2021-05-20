const playerCardElem = document.querySelector("#player-cards");
const computerCardElem = document.querySelector("#computer-cards");
const startGameBtn = document.querySelector("#start-game");
const drawCardBtn = document.querySelector("#draw-card");
const playerScoreDisplayElem = document.querySelector("#player-score");
const computerScoreDisplayElem = document.querySelector("#computer-score");
const standBtn = document.querySelector("#stand");

startGameBtn.addEventListener("click", startGame);
drawCardBtn.addEventListener("click", function(){
    drawCard(user);
});
standBtn.addEventListener("click", stand);

class Player {
    constructor(id="computer",username="The House", hand=[],score=0, balance=100000,showHiddenCard = false,cardNum=0){
        this.id = id;
        this.username = username;
        this.hand = hand;
        this.score = score;
        this.balance = balance;
        this.showHiddenCard = showHiddenCard;
        this.cardNum = cardNum;
    }
    updateScore(card){
        if (royals.includes(card.value)){
            this.score += 10;
        } else if (card.value === "ACE"){
            this.score += 11
        } else this.score += parseInt(card.value);
    }
    displayHand(player){
        let parentDivElem = document.querySelector(`#${this.id}-cards`);
        if (this.showHiddenCard){
            let hiddenCard = document.querySelector("#hidden-card");
            hiddenCard.style.display = "none";
        }
        let imgElem = document.createElement("img");
        imgElem.src=player.hand[this.cardNum].cards[0].image;
        parentDivElem.appendChild(imgElem);
        if (this.id ==="computer" && this.showHiddenCard == false){
            let hiddenCard = document.createElement("img");
            hiddenCard.src = "images/back.png";
            hiddenCard.id = "hidden-card";
            parentDivElem.appendChild(hiddenCard);
        }
    }
    displayScore(){
        let parentDivElem = document.querySelector(`#${this.id}-score`);
        parentDivElem.innerHTML = `<h2>${this.username}s score is: ${this.score}</h2>`;
    }
}

let user = new Player("player","Emilio");
let computer = new Player();

const royals = ["KING", "JACK", "QUEEN"];
let deckID //= ""; 
//to prevent creating a new deck every time during testing- set this to the deckID

async function getDecks(){
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    const newDecks = await response.json();
    deckID = await newDecks.deck_id;
    console.log(deckID)
}

async function drawCard(player){
    try{
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
        const drawnCard = await response.json();
        player["hand"].push(drawnCard);
        player.updateScore(drawnCard.cards[0]);
        player.displayHand(player);
        player.displayScore();
        player.cardNum++;
    } catch {drawCard(player)};
}

function startGame(){
    drawCard(computer);
    drawCard(user);
    drawCard(user);
}

function stand(){
    computer.showHiddenCard = true;
    drawCard(computer);
}

window.onload = getDecks();