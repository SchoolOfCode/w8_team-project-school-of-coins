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
    constructor(id="computer",username="The House", hand=[],softHand=false,score=0, balance=100000,showHiddenCard = false,cardNum=0){
        this.id = id;
        this.username = username;
        this.hand = hand;
        this.softHand = softHand;
        this.score = score;
        this.balance = balance;
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
        parentDivElem.innerHTML = `<h2>${this.username}s score is: ${this.score}</h2>`;
    }
}

let user = new Player("player","Emilio");
let computer = new Player();
let fetchCardErrorCount = 0;
const royals = ["KING", "JACK", "QUEEN"];
let deckID = "amkpqcyydwa0"; 
//to prevent creating a new deck every time during testing- set this to the deckID

async function getDecks(){
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    const newDecks = await response.json();
    // deckID = await newDecks.deck_id;
    // console.log(deckID)
}

async function drawCard(player){
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    if (response.status !== 200) {
        fetchCardErrorCount++;
        if (fetchCardErrorCount > 3) throw "Unable to get any cards!!";
        drawCard(player);
        console.error(response.status,fetchCardErrorCount,"Oops! Let's try that again!")
    }
    const drawnCard = await response.json();
    player["hand"].push(drawnCard);
    player.updateScore(drawnCard.cards[0]);
    player.displayHand(player);
    player.displayScore();
    player.cardNum++;
    fetchCardErrorCount = 0;
}

function startGame(){
    drawCard(computer);
    drawCard(user);
    drawCard(user);

}

async function stand(){
    computer.showHiddenCard = true;
    await drawCard(computer);
    for (let i=computer.hand.length; i<6; i++){
        if (computer.score >= 16) break;
        await drawCard(computer);
        console.log(computer.score)
    }
    //The dealer then reveals the hidden card and must draw cards
    //one by one, until the cards total up to 17 points. 
    //At 17 points or higher the dealer must stop.


}


window.onload = getDecks();