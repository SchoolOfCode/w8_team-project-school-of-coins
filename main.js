// DOM Selectors #######################################################

const gameContainer = document.querySelector("#game-container");

const playerBalanceDisplay = document.querySelector("#player-balance-container");
const playerCardElem = document.querySelector("#player-cards");
const playerScoreDisplayElem = document.querySelector("#player-score");
const playerAvatarElem =  document.querySelector("#player-avatar");

const computerCardElem = document.querySelector("#computer-cards");
const computerScoreDisplayElem = document.querySelector("#computer-score");
const computerAvatarElem =  document.querySelector("#computer-avatar");

const outcomeDisplayElem = document.querySelector("#game-outcome");
const leaderBoardDisplayElem = document.querySelector("#leaderboard-display-container");
const usernameAvatarContainerElem = document.querySelector(".username-avatar-container");
const chipBlockDivElem = document.querySelector(".pokerChips");
const betAmountElem = document.querySelector("#bet-amount");
const betDisplayDivElem = document.querySelector("#bet-display");
const addBalanceContainer = document.querySelector("#add-balance-container");

const customiseAvatarBtn = document.querySelector("#customise-avatar");
const submitUsernameBtn = document.querySelector("#submit-username");
const startGameBtn = document.querySelector("#start-game");
const drawCardBtn = document.querySelector("#draw-card");
const standBtn = document.querySelector("#stand");
const resetBtn = document.querySelector("#reset");
const leaderBoardBtn = document.querySelector("#leaderboard");
const helpBtn = document.querySelector("#help-button");

const usernameInputElement = document.querySelector("#username");
const addBalance = document.querySelector("#add-balance-value");
const addToBalanceBtn = document.querySelector("#add-balance-btn");

const winningImage = document.querySelector("#winning-image");
const outcomeOverlayWin = document.querySelector("#outcome-overlay-win");
const outcomeOverlayLoss = document.querySelector("#outcome-overlay-loss");

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
leaderBoardBtn.style.display = "none";
submitUsernameBtn.addEventListener("click",loadProfile);
addToBalanceBtn.addEventListener("click",addToBalance);
//button original states
drawCardBtn.disabled = true;
startGameBtn.disabled = false;
standBtn.disabled = true;

startGameBtn.classList.add("start-game-enabled");

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

// Help Overlay Functions #################################################
function overlayOn(){
    document.getElementById("overlay").style.display = "block";
}

function overlayOff(){
    document.getElementById("overlay").style.display = "none";
}

