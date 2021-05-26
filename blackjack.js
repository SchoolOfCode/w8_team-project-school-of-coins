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
    if (playerObj.score >= 21 && playerObj.softHand == false){
        drawCardBtn.disabled = true;
        drawCardBtn.classList.add("disabled-buttons");
        drawCardBtn.classList.remove("draw-card-enabled");
        return;
    }
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
    resetBtn.disabled = false;
    computer.showHiddenCard = true;
    resetBtn.disabled = false;

    standBtn.classList.remove("stand-enabled")
    standBtn.classList.add("disabled-buttons");
    drawCardBtn.classList.add("disabled-buttons");
    drawCardBtn.classList.remove("draw-card-enabled");
    resetBtn.classList.remove("disabled-buttons");
    resetBtn.classList.add("reset-enabled");

    await drawCard(computer);
    while (computer.score < 17 && computer.cardNum <6){
        await drawCard(computer);
    }
    // See https://en.wikipedia.org/wiki/Blackjack#Rules
    if (user.softHand && user.cardNum === 2 && user.score ===21){
        //win - blackjack
        // document.querySelector("body").style.backgroundImage = "url('images/rain-money.gif')";
        // setTimeout(function(){document.querySelector("body").style.backgroundImage = ""; }, 4000);
        outcomeOverlayWin.classList.remove("hidden");
        setTimeout(function(){outcomeOverlayWin.classList.add("hidden");; }, 750);
        user.balance += user.bet + user.bet*1.5;
    } else if(user.score > 21){
        //loss
        outcomeOverlayLoss.classList.remove("hidden");
        setTimeout(function(){outcomeOverlayLoss.classList.add("hidden");; }, 750);
        user.balance = user.balance;
    } else if (computer.score > 21 && user.score <= 21){
        //win
        outcomeOverlayWin.classList.remove("hidden");
        setTimeout(function(){outcomeOverlayWin.classList.add("hidden");; }, 750);
        user.balance += user.bet * 2;
    } else if(user.score > computer.score && user.score <= 21){
        //win
        outcomeOverlayWin.classList.remove("hidden");
        setTimeout(function(){outcomeOverlayWin.classList.add("hidden");; }, 750);
        user.balance += user.bet * 2;
    } else if (computer.score > user.score){
        //loss
        outcomeOverlayLoss.classList.remove("hidden");
        setTimeout(function(){outcomeOverlayLoss.classList.add("hidden");; }, 750);
        user.balance = user.balance;
    } else {
        //draw

        user.balance += user.bet
    }
    document.querySelector("#current-balance").innerText = user.balance;
}

function resetBoard(computer,user){
    /*#################################################################
    clear the screen and reset everything apart from the balance
    #################################################################*/
    drawCardBtn.disabled = true;
    startGameBtn.disabled = false;
    standBtn.disabled = true;
    resetBtn.disabled = true;
    resetBtn.classList.remove("reset-enabled")
    resetBtn.classList.add("disabled-buttons")
    startGameBtn.classList.add("start-game-enabled")
    startGameBtn.classList.remove("disabled-buttons")

    betAmountElem.innerText = 0;
    user.reset();
    computer.reset();
    resetBtn.disabled = true;
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
    let betRadio = document.querySelectorAll('input[name="rdo"]');
    value = parseInt(value,10);
    let player = blackjackPlayers.player(username);
    if (betRadio[0].checked){
        for (let chip in pokerChips){
            if (player.balance-value <= chip){
                pokerChips[chip].disabled = true;
            }
        }
        player.bet += value;
        player.balance -= value;
    }
    if (betRadio[1].checked){
        for (let chip in pokerChips){
            if (player.bet-value >= 0){
                pokerChips[chip].disabled = false;
            }
        }
        if (player.bet-value >= 0){
            player.bet -= value;
            player.balance += value;
        }
    }

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

    // if (window.innerWidth > 1000){
    //     document.querySelector("#table-bg").classList.remove("hidden");
    // }
    if (window.innerWidth > 1000){
        document.querySelector("#table-bg").classList.remove("hidden");
    }
    helpBtn.classList.remove("hidden");
    standBtn.disabled = false;
    startGameBtn.disabled = true;
    drawCardBtn.disabled = false;
    chipBlockDivElem.style.display="flex";
    betDisplayDivElem.classList.remove("hidden");
    addBalanceContainer.classList.add("hidden");

    drawCardBtn.classList.add("draw-card-enabled");
    drawCardBtn.classList.remove("disabled-button");
    resetBtn.classList.add("disabled-buttons");
    resetBtn.classList.remove("reset-enabled");
    standBtn.classList.remove("disabled-buttons");
    standBtn.classList.add("stand-enabled");
    startGameBtn.classList.remove("start-game-enabled");
    startGameBtn.classList.add("disabled-buttons");

    let user = blackjackPlayers.player(username);
    let computer = blackjackPlayers.player("Dealer");

    if (computer.avatar==null){
        computer.avatar = await getAvatar(computer.username);
        let computerProfileImgElem = document.createElement("img");
        computerProfileImgElem.src = computer.avatar;
        computerProfileImgElem.id = `${computer.id}-avatar`;
        computerAvatarElem.appendChild(computerProfileImgElem);
    }
    drawCard(computer);
    drawCard(user);
    drawCard(user);
}

//add to the balance
function addToBalance(){
    let user = blackjackPlayers.loadPlayer(username);
    user.balance += parseInt(addBalance.value,10);
    document.querySelector("#current-balance").innerText = user.balance;
}
