console.log("JS connected to HTML")

let newCard;
let deckID;

let  waitForDeckID = false;

const card = document.getElementById("card-text");

async function newDeck(){
    waitForDeckID = true;
const response = await fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=2");
newCard = await response.json();
console.log(newCard)
card.innerHTML = `${newCard.cards[0].code} + ${newCard.cards[1].code}`
deckID = newCard.deck_id
console.log(deckID)
    waitForDeckID = false;
}

newDeck();


async function drawCard(){
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`)
    const drawCard = await response.json();
    console.log(drawCard);
}

