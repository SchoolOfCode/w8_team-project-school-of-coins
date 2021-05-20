const playerBalanceDisplay = document.querySelector("#player-balance");

const playerCardElem = document.querySelector("#player-cards");
const playerScoreDisplayElem = document.querySelector("#player-score");

const computerCardElem = document.querySelector("#computer-cards");
const computerScoreDisplayElem = document.querySelector("#computer-score");

const outcomeDisplayElem = document.querySelector("#game-outcome");

const startGameBtn = document.querySelector("#start-game");
const drawCardBtn = document.querySelector("#draw-card");
const standBtn = document.querySelector("#stand");
const resetBtn = document.querySelector("#reset");


startGameBtn.addEventListener("click", startGame);
drawCardBtn.addEventListener("click", function(){
    drawCard(user);
});
standBtn.addEventListener("click", stand);
resetBtn.addEventListener("click", resetBoard);

class Player {
    constructor(id="computer",username="The House",balance=100000,hand=[],softHand=false,score=0,showHiddenCard=false,cardNum=0){
        this.id = id;
        this.username = username;
        this.balance = balance;
        this.hand = hand;
        this.softHand = softHand;
        this.score = score;
        this.showHiddenCard = showHiddenCard;
        this.cardNum = cardNum;
    }
    updateScore(card){
        if (royals.includes(card.value)){
            this.score += 10;
        } else if (card.value === "ACE"){
            this.score += 11;
            this.softHand = true;
        } else {
            this.score += parseInt(card.value,10);
        }
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
        parentDivElem.innerHTML = `<h2>${this.username}'s score is: ${this.score}</h2>`;
    }
    reset(){
        let parentImgDiv = document.querySelector(`#${this.id}-cards`);
        let parentScoreDiv = document.querySelector(`#${this.id}-score`);
        outcomeDisplayElem.innerHTML = "";
        while (parentImgDiv.firstChild) {
            parentImgDiv.removeChild(parentImgDiv.lastChild);
        }
        parentScoreDiv.innerHTML="";
        this.hand = [];
        this.score = 0;
        this.showHiddenCard = false;
        this.softHand=false;
        this.cardNum=0;
    }
}

let user = new Player("player","Emilio",5000);
let computer = new Player();
let fetchCardErrorCount = 0;
const royals = ["KING", "JACK", "QUEEN"];
let deckID = "vtq1bnblc5we"; 
//to prevent creating a new deck every time during testing- set this to the deckID
const TEMP_BET = 1000;

async function getDecks(){
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    const newDecks = await response.json();
    // deckID = await newDecks.deck_id;
    // console.log(deckID)
}

async function drawCard(player){
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`,{
        method: 'GET', headers: {'Content-Type': 'application/json'}});
    if (response.status !== 200) {
        fetchCardErrorCount++;
        if (fetchCardErrorCount > 3) throw "Unable to get any cards!!";
        drawCard(player);
        console.error(response.status,fetchCardErrorCount,"Oops! Let's try that again!")
    }
    const drawnCard = await response.json();
    player["hand"].push(drawnCard);
    player.updateScore(drawnCard.cards[0]);
    if (player.softHand && player.score > 21 && player.score <= 31){
        player.score -= 10; //convert the ace from 11 to 1
        player.softHand = false; //prevent it from always taking away 10 if an ace is in the hand
    }
    player.displayHand(player);
    player.displayScore();
    player.cardNum++;
    fetchCardErrorCount = 0;
}

async function stand(){
    computer.showHiddenCard = true;
    await drawCard(computer);
    while (computer.score < 17 && computer.hand.length <6){
        await drawCard(computer);
    }
    let bonus = false;
    // See https://en.wikipedia.org/wiki/Blackjack#Rules
    if (user.softHand && user.cardNum === 2 && user.score ===21){
        outcomeDisplayElem.innerHTML = "<h2>Blackjack! Natural. You get a bonus!!!</h2>";
        user.balance += TEMP_BET * 2;
        bonus = true;
    } else if(user.score > 21){
        outcomeDisplayElem.innerHTML = "<h2>Bust!!!</h2>";
        user.balance -= TEMP_BET;
    } else if (computer.score > 21 && user.score <= 21){
        outcomeDisplayElem.innerHTML = "<h2>You win!</h2>";
        user.balance += TEMP_BET;
    } else if(user.score > computer.score && user.score <= 21){
        outcomeDisplayElem.innerHTML = "<h2>You win!</h2>";
        user.balance += TEMP_BET;
    } else if (computer.score > user.score){
        outcomeDisplayElem.innerHTML = "<h2>Bust!!!</h2>";
        user.balance -= TEMP_BET;
    } else {
        outcomeDisplayElem.innerHTML = "<h2>It's a draw</h2>";
    }
    playerBalanceDisplay.innerText = `${user.username}'s balance is: ${user.balance}`;
}

function resetBoard(){
    user.reset();
    computer.reset();
}


function startGame(){
    playerBalanceDisplay.innerText = `${user.username}'s balance is: ${user.balance}`;
    drawCard(computer);
    drawCard(user);
    drawCard(user);
}

window.onload = getDecks();