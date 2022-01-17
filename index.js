/* VARIABLES*/
let deckId;
const cardGrid = [
    3,0,0,2,0,0,4,
    0,3,1,2,1,4,0,
    0,2,3,2,4,2,0,
    1,1,1,1,1,1,1,
    0,2,4,2,3,2,0,
    0,4,1,2,1,3,0,
    4,0,0,2,0,0,3
];

const cardsValue = ["2", "3", "4", "5", "6", "7", "8", "9", 
"10", "JACK", "QUEEN", "KING", "ACE"];
const firstLayer = [0,1,2,13,19,30,31,32];
const secondLayer = [3,5,7,14,18,25,27,29];
const thirdLayer = [4,6,8,12,20,24,26,28];
const fourthLayer = [9,10,11,15,17,21,22,23];
const cardGridEl = document.getElementById("card-grid");
const layer1Modal = document.getElementById("layer1-modal");
const layer2Modal = document.getElementById("layer2-modal");
const layer3Modal = document.getElementById("layer3-modal");
const layer4Modal = document.getElementById("layer4-modal");
const layer5Modal = document.getElementById("layer5-modal");
const gorgeesModal = document.getElementById("gorgees-modal");
const gorgeesDisplay = document.getElementById("gorgees");
const gorgeesABoireDisplay = document.getElementById("gorgees-a-boire");
const okBtn = document.getElementById("ok-btn");
let cards;
let cardsArr;
let clickedCard;
let gorgees = 0;

/* FUNCTIONS*/
async function getDeck() {
    const response = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/draw/?count=18");
    const data = await response.json();
    return data;
}

function isRed(newCard) {
    gorgees++;
    return newCard.suit === "HEARTS" || newCard.suit === "DIAMONDS";
}

function isBlack(newCard) {
    return !isRed(newCard);
}

function isGreater(newCard) {
    gorgees += 2;
    const oldCard = getLayer1Card(clickedCard);
    return cardsValue.indexOf(newCard.value) >= cardsValue.indexOf(oldCard.value);
}

function isLess(newCard) {
    gorgees += 2;
    const oldCard = getLayer1Card(clickedCard);
    return cardsValue.indexOf(newCard.value) <= cardsValue.indexOf(oldCard.value);
}

function isInter(newCard) {
    gorgees += 3;
    const oldCardValues = [];
    getLayer2Cards(clickedCard).forEach(card => {
        oldCardValues.push(card.value);
    });
    oldCardValues.sort();
    return cardsValue.indexOf(newCard.value) <= cardsValue.indexOf(oldCardValues[1]) && cardsValue.indexOf(newCard.value) >= cardsValue.indexOf(oldCardValues[0])
}

function isExter(newCard) {
    gorgees += 3;
    const oldCardValues = [];
    getLayer2Cards(clickedCard).forEach(card => {
        oldCardValues.push(card.value);
    });
    oldCardValues.sort();
    return cardsValue.indexOf(newCard.value) >= cardsValue.indexOf(oldCardValues[1]) || cardsValue.indexOf(newCard.value) <= cardsValue.indexOf(oldCardValues[0])
}

function isSpades(newCard) {
    gorgees += 4;
    return newCard.suit === "SPADES";
}

function isClubs(newCard) {
    gorgees += 4;
    return newCard.suit === "CLUBS";
}

function isHearts(newCard) {
    gorgees += 4;
    return newCard.suit === "HEARTS";
}

function isDiamonds(newCard) {
    gorgees += 4;
    return newCard.suit === "DIAMONDS";
}

function finalCheckComplete(newCard, greaterLess, color) {
    const greaterThan8 = greaterLess === 'greater';
    return newCard.suit === color.toUpperCase() 
    && (
        (greaterThan8 && cardsValue.indexOf(newCard.value) >= 6) 
        ||
        (!greaterThan8 && cardsValue.indexOf(newCard.value) <= 6)
    );
}

function finalCheckPartial(newCard, greaterLess, color) {
    const greaterThan8 = greaterLess === 'greater';
    return newCard.suit === color.toUpperCase() 
    || (
        (greaterThan8 && cardsValue.indexOf(newCard.value) >= 6) 
        ||
        (!greaterThan8 && cardsValue.indexOf(newCard.value) <= 6)
    );
}

function getLayer1Card(card) {
    let clickedIndex = cardsArr.indexOf(card);
    let secondLayerIndex = secondLayer.indexOf(clickedIndex);
    let firstLayerIndex = firstLayer[secondLayerIndex];
    return cards[firstLayerIndex];
}

function getLayer2Cards(card) {
    switch(thirdLayer.indexOf(cardsArr.indexOf(card))) {
        case 0:
            return [cards[0], cards[1]];
        case 1:
            return [cards[1], cards[2]];
        case 2:
            return [cards[0], cards[3]];
        case 3:
            return [cards[2], cards[4]];
        case 4:
            return [cards[3], cards[5]];
        case 5:
            return [cards[4], cards[7]];
        case 6:
            return [cards[5], cards[6]];
        case 7:
            return [cards[6], cards[7]];
    }
}

function getLayer3Card(card) {
    let clickedIndex = cardsArr.indexOf(card);
    let fourthLayerIndex = fourthLayer.indexOf(clickedIndex);
    let secondLayerIndex = secondLayer[fourthLayerIndex];
    return cards[secondLayerIndex];
}

function getLayer4Cards() {
    return cardsArr.filter(card => fourthLayer.includes(cardsArr.indexOf(card)));
}

function isUnlocked(card, layer) {
    let isUnlocked = false;
    if(layer === 2) {
        isUnlocked = getLayer1Card(card).classList.contains('discovered');
    } else if (layer === 3) {
        const [card1, card2] = getLayer2Cards(card);
        isUnlocked = card1.classList.contains('discovered') && card2.classList.contains('discovered');
    } else if (layer === 4) {
        isUnlocked = getLayer3Card(card).classList.contains('discovered');
    } else if (layer === 5) {
        const count = getLayer4Cards().filter(card => card.classList.contains('discovered')).length;
        isUnlocked = count >= 6;
    }
    return isUnlocked;
}

function buttonClick(condition, layerModal) {
    clickedCard.classList.add('discovered');
    getCard().then(newCard => {
        clickedCard.src = newCard.image;
        clickedCard.value = newCard.value;
        layerModal.style.display = "none";
        if(condition(newCard)) {
            gorgeesDisplay.textContent = gorgees;
        } else {
            gorgeesABoireDisplay.textContent = gorgees;
            gorgeesModal.style.display = 'block'
            gorgees = 0;
            gorgeesDisplay.textContent = gorgees;
        }
    });
}

function finalClick(event) {
    event.preventDefault();
    const formData = new FormData(finalForm);
    const greaterLess = formData.get('greater-less');
    const color = formData.get('colors');
    getCard().then(newCard => {
        clickedCard.src = newCard.image;
        clickedCard.value = newCard.value;
        layer5Modal.style.display = "none";
        if(finalCheckComplete(newCard, greaterLess, color)) {
            gorgees += 10;
            gorgeesDisplay.textContent = gorgees;
        } else {
            if (finalCheckPartial(newCard, greaterLess, color)) {
                gorgees += 5;
            }
            else {
                gorgees += 10;
            }
            gorgeesABoireDisplay.textContent = gorgees;
            gorgeesModal.style.display = 'block'
            gorgees = 0;
            gorgeesDisplay.textContent = gorgees;
        }
    });
}

function redClick() {
    buttonClick(isRed, layer1Modal);
}

function blackClick() {
    buttonClick(isBlack, layer1Modal);
}

function greaterClick() {
    buttonClick(isGreater, layer2Modal);
}

function lessClick() {
    buttonClick(isLess, layer2Modal);
}

function interClick() {
    buttonClick(isInter, layer3Modal);
}

function exterClick() {
    buttonClick(isExter, layer3Modal);
}

function spadesClick() {
    buttonClick(isSpades, layer4Modal);
}

function clubsClick() {
    buttonClick(isClubs, layer4Modal);
}

function heartsClick() {
    buttonClick(isHearts, layer4Modal);
}

function diamondsClick() {
    buttonClick(isDiamonds, layer4Modal);
}

async function getCard() {
    const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=1`)
    const data = await response.json();
    const newCard = await data.cards[0];
    return newCard;
}

document.getElementById("ok-btn").addEventListener("click", function () {
    gorgeesModal.style.display = 'none';
});

document.getElementById("red-btn").addEventListener("click", redClick);
document.getElementById("black-btn").addEventListener("click", blackClick);
document.getElementById("greater-btn").addEventListener("click", greaterClick);
document.getElementById("less-btn").addEventListener("click", lessClick);
document.getElementById("inter-btn").addEventListener("click", interClick);
document.getElementById("exter-btn").addEventListener("click", exterClick);
document.getElementById("spades-btn").addEventListener("click", spadesClick);
document.getElementById("clubs-btn").addEventListener("click", clubsClick);
document.getElementById("hearts-btn").addEventListener("click", heartsClick);
document.getElementById("diamonds-btn").addEventListener("click", diamondsClick);
const finalForm = document.getElementById("final-form");
finalForm.addEventListener("submit", finalClick);

getDeck()
.then(deck => {
    deckId = deck.deck_id;
    console.log(deckId);
    let cardGridHtml = "";
    for(const card of cardGrid) {
        if(card) {
            cardGridHtml += `
                <div class="card-placeholder">
                    <img class="card card${card}" src="img/card_back.jpg">
                </div>
            `;
        }
        else {
            cardGridHtml += `
                <div class="card-placeholder"></div>
            `;
        }
    }

    cardGridEl.innerHTML = cardGridHtml;
    cards = document.getElementsByClassName('card');
    setInterval(function () {
        for(let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if(!card.classList.contains('discovered')){
                if(firstLayer.includes(i)){
                    card.classList.add('unlocked');
                } else if (secondLayer.includes(i)) {
                    if(isUnlocked(card, 2)){
                        card.classList.add('unlocked');
                    }
                } else if (thirdLayer.includes(i)) {
                    if(isUnlocked(card, 3)){
                        card.classList.add('unlocked');
                    }
                } else if (fourthLayer.includes(i)) {
                    if(isUnlocked(card, 4)){
                        card.classList.add('unlocked');
                    }
                }
                else {
                    if(isUnlocked(card,5)){
                        card.classList.add('unlocked');
                    }
                }
            }
        }
    }, 100);
    cardsArr = Array.prototype.slice.call(cards);
    for(let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.addEventListener('click', () => {
            if(!card.classList.contains('discovered') && card.classList.contains('unlocked')){
                if(firstLayer.includes(i)){
                    layer1Modal.style.display = 'block';
                    clickedCard = card;
                } else if (secondLayer.includes(i)) {
                    layer2Modal.style.display = 'block';
                    clickedCard = card;
                } else if (thirdLayer.includes(i)) {
                    layer3Modal.style.display = 'block';
                    clickedCard = card;
                } else if (fourthLayer.includes(i)) {
                    layer4Modal.style.display = 'block';
                    clickedCard = card;
                } else {
                    layer5Modal.style.display = 'block';
                    clickedCard = card;
                }
            }
        })
    }
});