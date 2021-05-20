const playerCardElem = document.querySelector("#player-cards");
const computerCardElem = document.querySelector("#computer-cards");
const startGameBtn = document.querySelector("#start-game");
const drawCardBtn = document.querySelector("#draw-card");
const playerScoreDisplayElem = document.querySelector("#player-score");
const computerScoreDisplayElem = document.querySelector("#computer-score");
const standBtn = document.querySelector("#stand");
const resetBtn = document.querySelector("#reset");

startGameBtn.addEventListener("click", startGame);
drawCardBtn.addEventListener("click", function(){
    drawCard(user);
});
standBtn.addEventListener("click", stand);
resetBtn.addEventListener("click", resetBoard);

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
    reset(){
        let parentImgDiv = document.querySelector(`#${this.id}-cards`);
        let parentScoreDiv = document.querySelector(`#${this.id}-score`);
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

let user = new Player("player","Emilio");
let computer = new Player();
let fetchCardErrorCount = 0;
const royals = ["KING", "JACK", "QUEEN"];
let deckID //= "x8ezqo789qmx"; 
//to prevent creating a new deck every time during testing- set this to the deckID

async function getDecks(){
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    const newDecks = await response.json();
    deckID = await newDecks.deck_id;
    console.log(deckID)
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
        console.log("removed")
    }
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
    while (computer.score < 17 && computer.hand.length <6){
        await drawCard(computer);
    }
    // See https://en.wikipedia.org/wiki/Blackjack#Rules
    /*
    If the player is dealt an Ace and a ten-value card (called a "blackjack" or "natural"), and the dealer does not, the player wins and usually receives a bonus.
    If the player exceeds a sum of 21 ("busts"), the player loses, even if the dealer also exceeds 21.
    If the dealer exceeds 21 ("busts") and the player does not, the player wins.
    If the player attains a final sum higher than the dealer and does not bust, the player wins.
    If both dealer and player receive a blackjack or any other hands with the same sum, this will be called a "push" and no one wins.
   */
    if (user.softHand && user.cardNum === 2 && user.score ===21){
        console.log("Blackjack! Natural. You get a bonus!!!");
    } else if(user.score > 21){
        console.log("Bust!!!");
    } else if (computer.score > 21 && user.score <= 21){
        console.log("You win!");
    } else if(user.score > computer.score && user.score <= 21){
        console.log("You win!");
    } else{
        console.log("It's a draw");
    }
}

function resetBoard(){
    user.reset();
    computer.reset();
}

window.onload = getDecks();