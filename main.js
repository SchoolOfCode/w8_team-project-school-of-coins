// DOM Selectors #######################################################
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

const usernameInputElement = document.querySelector("#username");

// Event Handlers #######################################################
startGameBtn.addEventListener("click", startGame);
drawCardBtn.addEventListener("click", function(){
    drawCard(blackjackPlayers.players[playerIndex]);
});
standBtn.addEventListener("click", function(){
    stand(blackjackPlayers.players[0],blackjackPlayers.players[playerIndex]);
});
resetBtn.addEventListener("click", function(){
    resetBoard(blackjackPlayers.players[0],blackjackPlayers.players[playerIndex]);
});
// Class Declerations #######################################################
class Player {

    /*#################################################################
    Default values are applied when we don't supply any below, when we make a new user 
    or computer; they are for the house, you can override for any created users 
    on new class instantitation e.g. new Player(id="Jack",username="cryptoKing")
    #################################################################*/
    constructor(id="computer",username="Dealer",balance=100000,hand=[],softHand=false,score=0,showHiddenCard=false,cardNum=0){
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
    /*#################################################################
    If the value of the card is a royal [Q,J,K] then increase score by 10
    If the card is an ACE, default to 11, set softHand variable to true
    Otherwise the value of the card will be added to the score
    #################################################################*/
        if (ROYALS.includes(card.value)){
            this.score += 10;
        } else if (card.value === "ACE"){
            this.score += 11;
            this.softHand = true;
        } else {
            this.score += parseInt(card.value,10);
        }
    }
    displayHand(playerObj){
    /*#################################################################
    Select the appropriate div based on the players id i.e. computer or user
    If we wish to show what is under the hidden card i.e. showHiddenCard = true, 
    hide the back of the card.
    Otherwise, create an img element for each drawn card and append it to the
    appropriate div container e.g. computer-cards or user-cards
    If we are the computer, and we wish to hide the second card initially, 
    insert a blank card i.e. the back of the card image as a placeholder
    #################################################################*/
        let parentDivElem = document.querySelector(`#${this.id}-cards`);
        if (this.showHiddenCard===true){
            let hiddenCard = document.querySelector("#hidden-card");
            hiddenCard.style.display = "none";
        }
        let imgElem = document.createElement("img");
        imgElem.src=playerObj.hand[this.cardNum].cards[0].image;
        parentDivElem.appendChild(imgElem);
        if (this.id ==="computer" && this.showHiddenCard == false){
            let hiddenCard = document.createElement("img");
            hiddenCard.src = "images/SOC-back.png";
            hiddenCard.id = "hidden-card";
            parentDivElem.appendChild(hiddenCard);
        }
    }
    displayScore(){
    /*#################################################################
    Change the value of the appropriate user/computer element with the score
    #################################################################*/
        let parentDivElem = document.querySelector(`#${this.id}-score`);
        parentDivElem.innerHTML = `<h2>${this.username}'s score is: ${this.score}</h2>`;
    }
    reset(){
    /*#################################################################
    Clear all images, clear the game outcome, clear the hand, score etc
    #################################################################*/
        let parentImgDiv = document.querySelector(`#${this.id}-cards`);
        let parentScoreDiv = document.querySelector(`#${this.id}-score`);
        standBtn.disabled = false;
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
        startGameBtn.disabled = false;
    }
}
class Game {
    /*#################################################################
    Create a game container to locally store the players, balance, avatars etc
    Also will be used to make a local leaderboard
    #################################################################*/
    constructor(){
        this.players = [];
        this.leaders = [];
    }
    setupDealer(balance){
        let computer = new Player("computer","Dealer",balance);
        this.players.push(computer)
    }
    loadPlayer(username){
    /*#################################################################
    Check if the username exists in the array of players, if not, create a 
    new player,If the player does exist, retrieve the playerObj
    #################################################################*/
        let currentPlayer;
        let playerObjIndexInArray;
        if (this.checkPlayerExists(username)){
            currentPlayer = this.players.find(player => player.username === username);
            playerObjIndexInArray = this.players.findIndex(player => player.username === username)
        } else{
            currentPlayer = this.newPlayer(username);
            playerObjIndexInArray = this.players.length -1;
        }
        return [currentPlayer, playerObjIndexInArray];
    }
    checkPlayerExists(username){
        return this.players.some(player => player.username === username);//true or false
    }
    newPlayer(username){
        let currentPlayer = new Player("player",username,5000);
        this.players.push(currentPlayer);
        return currentPlayer;
    }
}
// Class Instantiation #####################################################
let blackjackPlayers = new Game();
blackjackPlayers.setupDealer();
blackjackPlayers.loadPlayer("Jack");
blackjackPlayers.loadPlayer("Lewis");
blackjackPlayers.loadPlayer("Emilio");
let playerIndex;
// Global Variables #######################################################
const TEMP_BET = 1000;
const ROYALS = ["KING", "JACK", "QUEEN"];
const DECKS_TO_FETCH = 6;

let remainingCardsInDeck = 0;
let deckID;
let fetchCardErrorCount = 0;

// Functions #############################################################

async function getDecks(){
    /*#################################################################
    Fetch the stack of 6 decks
    #################################################################*/
    const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${DECKS_TO_FETCH}`);
    const newDecks = await response.json();
    deckID = await newDecks.deck_id;
    remainingCards = 52*DECKS_TO_FETCH;
}

async function drawCard(playerObj){
    /*#################################################################
    Take in a player object e.g. user or computer so we know which object
    to add the card and card values etc to
    Draw a single card, there are some errors with the server side JSON
    so if we get a HTTP 500 return value, try again to a maximum of 5 times
    TODO: Implement a way to notify the user to try refreshing the page
    #################################################################*/
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`,{
        method: 'GET', headers: {'Content-Type': 'application/json'}});
    if (response.status !== 200) {
        fetchCardErrorCount++;
        if (fetchCardErrorCount > 5) throw "Unable to get any cards!!";
        drawCard(playerObj);
        console.error(response.status,fetchCardErrorCount,"Oops! Let's try that again!")
    }
    const drawnCard = await response.json();
    /*#################################################################
    Add the card to the hand of the current player, update the score
    utilising the playerObj updatescore method. Implement automatic softhand
    compensation - ACE will change to 1 if the drawn card makes the score >21
    If the score is already >31, then there is no point changing the score
    base on the ACE as the user has lost regardless
    #################################################################*/
    playerObj["hand"].push(drawnCard);
    playerObj.updateScore(drawnCard.cards[0]);
    if (playerObj.softHand && playerObj.score > 21 && playerObj.score <= 31){
        playerObj.score -= 10;          //convert the ace from 11 to 1
        playerObj.softHand = false;     //prevent it from always taking away 10 if an ace is in the hand
    }
    /*#################################################################
    Use the player objects display hand method to display the cards on the 
    screen. Update the displayed score, increase the total card count, 
    reset the error count if a card is sucessfully drawn, subtract one 
    from our total deck size as we have drawn a card
    #################################################################*/
    playerObj.displayHand(playerObj);
    playerObj.displayScore();
    playerObj.cardNum++;
    fetchCardErrorCount = 0;
    remainingCardsInDeck--;
}

async function stand(computer,user){
    /*#################################################################
    Hide the hidden card overlay (the back of the card), and draw another card 
    for the computer. Keep drawing cards for the house, until we have a 
    maximum of 6 cards or the score exceeds 21. Then check the winning
    conditions and display the outcome and change in balance.
    Adjustment to be made - when stand button pressed following winner 
    decision, disable button until reset button or start game pressed
    #################################################################*/
    computer.showHiddenCard = true;
    standBtn.disabled = true;
    drawCardBtn.disabled = true;
    await drawCard(computer);
    while (computer.score < 17 && computer.cardNum <6){
        await drawCard(computer);
    }
    // See https://en.wikipedia.org/wiki/Blackjack#Rules
    if (user.softHand && user.cardNum === 2 && user.score ===21){
        outcomeDisplayElem.innerHTML = "<h2>Blackjack! Natural. You get a bonus!!!</h2>";
        user.balance += TEMP_BET + TEMP_BET*0.5;
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
    console.log(blackjackPlayers);
}

function resetBoard(computer,user){
    /*#################################################################
    clear the screen and reset everything apart from the balance
    #################################################################*/
    user.reset();
    computer.reset();
}

async function startGame(){
    /*#################################################################
    Re-use the same deck unless there are less than 12ish cards remaining,
    otherwise get a new deck, just to be safe. Draw once for the computer,
    twice for the user
    #################################################################*/
    if (remainingCardsInDeck <= 15){
        await getDecks();
    }

    let username = usernameInputElement.value;
    let user;
    [user, playerIndex] = blackjackPlayers.loadPlayer(username);
    let computer = blackjackPlayers.players[0];
    standBtn.disabled = false;

    playerBalanceDisplay.innerText = `${user.username}'s balance is: ${user.balance}`;
    drawCard(computer);
    drawCard(user);
    drawCard(user);
    startGameBtn.disabled = true;
}

//Javascript needed to turn on and off the overlay effect
function overlayOn(){
    document.getElementById("overlay").style.display = "block";
}

function overlayOff(){
    document.getElementById("overlay").style.display = "none";
}