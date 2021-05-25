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
        parentDivElem.innerHTML = `<h2>Score: ${this.score}</h2>`;
    }
    reset(){
    /*#################################################################
    Clear all card images, clear the game outcome, clear the hand, score etc
    #################################################################*/
        let parentImgDiv = document.querySelector(`#${this.id}-cards`);
        let parentScoreDiv = document.querySelector(`#${this.id}-score`);
        outcomeDisplayElem.innerHTML = "";
        while (parentImgDiv.hasChildNodes()) {
            parentImgDiv.removeChild(parentImgDiv.lastChild);
        }
        parentScoreDiv.innerHTML="";
        this.hand = [];
        this.score = 0;
        this.bet = 0;
        this.showHiddenCard = false;
        this.softHand=false;
        this.cardNum=0;
    }
}