// DOM Selectors #######################################################
const playerBalanceDisplay = document.querySelector("#player-balance-container");
const playerCardElem = document.querySelector("#player-cards");
const playerScoreDisplayElem = document.querySelector("#player-score");
const computerCardElem = document.querySelector("#computer-cards");
const computerScoreDisplayElem = document.querySelector("#computer-score");
const outcomeDisplayElem = document.querySelector("#game-outcome");
const leaderBoardDisplayElem = document.querySelector("#leaderboard-display-container");
const usernameAvatarContainerElem = document.querySelector(".username-avatar-container");
const chipBlockDivElem = document.querySelector(".pokerChips");
const betAmountElem = document.querySelector("#bet-amount");
const betDisplayDivElem = document.querySelector("#bet-display")

const customiseAvatarBtn = document.querySelector("#customise-avatar");
const submitUsernameBtn = document.querySelector("#submit-username");
const startGameBtn = document.querySelector("#start-game");
const drawCardBtn = document.querySelector("#draw-card");
const standBtn = document.querySelector("#stand");
const resetBtn = document.querySelector("#reset");
const leaderBoardBtn = document.querySelector("#leaderboard");
const helpBtn = document.querySelector("#help-button");

const usernameInputElement = document.querySelector("#username");


//Poker Chip Buttons & Event Handlers ###################################
const oneChipBtn = document.querySelector("#oneChip");
const tenChipBtn = document.querySelector("#tenChip");
const hundredChipBtn = document.querySelector("#hundredChip");
const thousandChipBtn = document.querySelector("#thousandChip");
const tenThousandChipBtn = document.querySelector("#tenThousandChip");

// Event Handlers #######################################################
startGameBtn.addEventListener("click", startGame);
drawCardBtn.addEventListener("click", function(){
    drawCard(blackjackPlayers.player(username));
});
standBtn.addEventListener("click", function(){
    stand(blackjackPlayers.player("Dealer"),blackjackPlayers.player(username));
});
resetBtn.addEventListener("click", function(){
    resetBoard(blackjackPlayers.player("Dealer"),blackjackPlayers.player(username));
});
leaderBoardBtn.addEventListener("click", displayLeaderBoard);
submitUsernameBtn.addEventListener("click",loadProfile);
//button original states
drawCardBtn.disabled = true;
startGameBtn.disabled = false;
standBtn.disabled = true;
// Class Declerations #######################################################
class Player {

    /*#################################################################
    Default values are applied when we don't supply any below, when we make a new user 
    or computer; they are for the house, you can override for any created users 
    on new class instantitation e.g. new Player(id="Jack",username="cryptoKing")
    #################################################################*/
    constructor(id="computer",username="Dealer",balance=100000,avatar=null,hand=[],softHand=false,score=0,showHiddenCard=false,cardNum=0,bet=0){
        this.id = id;
        this.username = username;
        this.balance = balance;
        this.avatar = avatar;
        this.hand = hand;
        this.softHand = softHand;
        this.score = score;
        this.showHiddenCard = showHiddenCard;
        this.cardNum = cardNum;
        this.bet = bet;
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
        imgElem.classList.add("playing-cards")
        imgElem.id = `${this.id}-card-${this.cardNum}`
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
    Clear all card images, clear the game outcome, clear the hand, score etc
    #################################################################*/
        let parentImgDiv = document.querySelector(`#${this.id}-cards`);
        let parentScoreDiv = document.querySelector(`#${this.id}-score`);
        outcomeDisplayElem.innerHTML = "";
        while (parentImgDiv.childNodes.length > 1) {
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
        this.players.push(new Player("computer","Dealer",balance));
    }
    loadPlayer(username){
    /*#################################################################
    Check if the username exists in the array of players, if not, create a 
    new player,If the player does exist, retrieve the playerObj
    #################################################################*/
        let currentPlayer;
        if (this.checkPlayerExists(username)){
            currentPlayer = this.player(username);
        } else{
            currentPlayer = this.createPlayer(username);
        }
        return currentPlayer;
    }
    checkPlayerExists(username){
        return this.players.some(player => player.username === username);//true or false
    }
    createPlayer(username){
        let newPlayer = new Player("player",username,5000);
        this.players.push(newPlayer);
        return newPlayer;
    }
    player(username){
        return this.players.find(player => player.username === username);
    }
    generateLeaderBoard(){
        this.leaders = [];
        for (let i = 1; i <this.players.length; i++){
            this.leaders.push([this.players[i].username, this.players[i].balance]);
        }
        return this.leaders.sort((a,b)=> b[1]-a[1]);
    }
}
// Class Instantiation #####################################################
let blackjackPlayers = new Game();
blackjackPlayers.setupDealer();

// Create some default profiles for testing - remove once testing is complete
blackjackPlayers.loadPlayer("Jack");
blackjackPlayers.player("Jack").balance = 1234;
blackjackPlayers.loadPlayer("Lewis");
blackjackPlayers.player("Lewis").balance = 5678;
blackjackPlayers.loadPlayer("Emilio");
blackjackPlayers.player("Emilio").balance = 999999;

// Global Variables #######################################################
const TEMP_BET = 1000;
const ROYALS = ["KING", "JACK", "QUEEN"];
const DECKS_TO_FETCH = 6;
const playingButtons = [drawCardBtn,standBtn,resetBtn,leaderBoardBtn];
const pokerChips = {
    1: oneChipBtn,
    10: tenChipBtn,
    100: hundredChipBtn,
    1000: thousandChipBtn,
    10000: tenThousandChipBtn
}
let username;
let remainingCardsInDeck = 0;
let deckID;
let fetchCardErrorCount = 0;

// BlackJack Functions ####################################################

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
    #################################################################*/
    standBtn.disabled = true;
    drawCardBtn.disabled = true;
    computer.showHiddenCard = true;
    await drawCard(computer);
    while (computer.score < 17 && computer.cardNum <6){
        await drawCard(computer);
    }
    // See https://en.wikipedia.org/wiki/Blackjack#Rules
    if (user.softHand && user.cardNum === 2 && user.score ===21){
        //win - blackjack
        user.balance += user.bet + user.bet*1.5;
    } else if(user.score > 21){
        //loss
        user.balance = user.balance;
    } else if (computer.score > 21 && user.score <= 21){
        //win
        user.balance += user.bet * 2;
    } else if(user.score > computer.score && user.score <= 21){
        //win
        user.balance += user.bet * 2;
    } else if (computer.score > user.score){
        //loss
        user.balance = user.balance;
    } else {
        //draw
        user.balance += user.bet
    }
    document.querySelector("#current-balance").innerText = user.balance;
    console.log(blackjackPlayers);
}

function resetBoard(computer,user){
    /*#################################################################
    clear the screen and reset everything apart from the balance
    #################################################################*/
    drawCardBtn.disabled = true;
    startGameBtn.disabled = false;
    standBtn.disabled = true;
    betAmountElem.innerText = 0;
    user.reset();
    computer.reset();
}

function displayLeaderBoard(){
    /*#################################################################
    Clear the leaderboard if it already exists, otherwise generate a 
    leaderboard with the highest balance first, add it to an unordered list
    TODO: make this on overlay? Can disappear on clicking
    #################################################################*/
    while (leaderBoardDisplayElem.hasChildNodes()) {
        leaderBoardDisplayElem.removeChild(leaderBoardDisplayElem.lastChild);
    }
    let leaderBoard = blackjackPlayers.generateLeaderBoard();
    let olElem = document.createElement("ol");
    leaderBoardDisplayElem.appendChild(olElem);

    leaderBoard.forEach(player => {
        let liElem = document.createElement("li");
        liElem.innerText = `${player[0]} with ${player[1]}`;
        olElem.appendChild(liElem);
    });
}

function checkBet(value){
    value = parseInt(value,10);
    let player = blackjackPlayers.player(username);
    for (let chip in pokerChips){
        if (player.balance-value <= chip){
            pokerChips[chip].disabled = true;
        }
    }
    player.balance -= value;
    player.bet += value;
    document.querySelector("#current-balance").innerText = player.balance;
    betAmountElem.innerText = player.bet;
}

async function startGame(){
    /*#################################################################
    Re-use the same deck unless there are less than 12ish cards remaining,
    otherwise get a new deck, just to be safe. Draw once for the computer, twice 
    for the user. Once the user clicks start game, the other game buttons are revealed, 
    and the cusomise button is removed. Load profile remains to allow switching.
    #################################################################*/
    if (remainingCardsInDeck <= 15){
        await getDecks();
    }
    playingButtons.forEach(btn => btn.classList.remove("hidden"));
    customiseAvatarBtn.classList.add("hidden");
    helpBtn.classList.remove("hidden");
    standBtn.disabled = false;
    startGameBtn.disabled = true;
    drawCardBtn.disabled = false;
    chipBlockDivElem.style.display="block";
    betDisplayDivElem.classList.remove("hidden");

    let user = blackjackPlayers.player(username);
    let computer = blackjackPlayers.player("Dealer");

    if (computer.avatar==null){
        computer.avatar = await getAvatar(computer.username);
        let computerProfileImgElem = document.createElement("img");
        computerProfileImgElem.src = computer.avatar;
        computerProfileImgElem.id = `${computer.id}-avatar`;
        computerProfileImgElem.class= "avatar-picture";
        computerCardElem.appendChild(computerProfileImgElem);
    }
    drawCard(computer);
    drawCard(user);
    drawCard(user);
}

// Profile Functions ######################################################

const AVATAR_URL = "https://avatars.dicebear.com/api/bottts";
const styleOptions = {
    "colors": ["amber", "blue", "blueGrey", "brown", "cyan", "deepOrange", "deepPurple",
    "green", "grey", "indigo", "lightBlue", "lightGreen", "lime", "orange", "pink", "purple",
    "red", "teal", "yellow"],
    "colorful":"false",//Use different colors for body parts
    "primaryColorLevel":600, //Default 600. 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
    "secondaryColorLevel":400, //Default 400.50, 100, 200, 300, 400, 500, 600, 700, 800, 900
    "textureChance": 50, //Texture Probability 0-100
    "mouthChance": 100, //Mouth Probability 0-100
    "sidesChance": 100, //Sides Probability 0-100
    "topChance": 100    //Top Probability 0-100
}
async function loadProfile(){
    /*#################################################################
    Use this to load the profile, generate the avatar with the seed
    Once the profile has been loaded, show the start game button
    Reset the game board on clicking load profile
    #################################################################*/
    username = usernameInputElement.value;
    let user = blackjackPlayers.loadPlayer(username);
    let computer = blackjackPlayers.player("Dealer");

    playerBalanceDisplay.innerHTML="";
    let prevAvatarImage = document.querySelector("#player-avatar");
    if (prevAvatarImage !== null){
        playerCardElem.removeChild(prevAvatarImage);
    }

    resetBoard(computer,user);

    customiseAvatarBtn.classList.remove("hidden");

    let profileImg = document.createElement("img");
    profileImg.src = await getAvatar(user.username);
    profileImg.class = "avatar-picture";
    user.avatar = profileImg.src;
    if (user.avatar !== null){
        profileImg.id = `${user.id}-avatar`;
        playerCardElem.appendChild(profileImg);
    }

    playerBalanceDisplay.innerHTML = `<p>${user.username}'s balance is: <span id='current-balance'>${user.balance}</span></p>`;
    startGameBtn.classList.remove("hidden"); //display the start button if the profile is loaded sucessfully
}

async function getAvatar(seed=username,width=200,height=200,backgroundColor="transparent", styleFurther=false){
    //Need to add some error catching here if avatar generation fails
    //Need to add additional style options
    let avatarParameters = `/:${seed}.svg?background=${backgroundColor}&width=${width}&height=${height}`;
    const avatarSrc = await fetch(AVATAR_URL+avatarParameters);
    return avatarSrc.url;
}

// Help Overlay Functions #################################################
function overlayOn(){
    document.getElementById("overlay").style.display = "block";
}

function overlayOff(){
    document.getElementById("overlay").style.display = "none";
}