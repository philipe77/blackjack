var blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//My Cards
document.querySelector('#blackjack-hit-btn').addEventListener('click', function blackJackHit() {

    if (blackjackGame['isStand'] == false) {
        let card = randomCard();
        showCard(card, YOU)
        scoreUpdate(card, YOU)
        showScore(YOU)
    }
})


//Bots Cards
async function blackJackStand(event) {
    blackjackGame['isStand'] = true;
    document.getElementById(event.id).disabled = true;
    console.log(event)

    while (DEALER['score'] <= 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER)
        scoreUpdate(card, DEALER)
        showScore(DEALER)
        await sleep(1000);
    }
    
    blackjackGame['turnOver'] = true;
    
    let winner = computeWinner();
    showResult(winner);
}

//deal 
document.querySelector('#blackjack-deal-btn').addEventListener('click', function blackJackDeal() {
    console.log(blackjackGame['turnOver'])

    blackjackGame['isStand'] = false;
    blackjackGame['turnOver'] = false;

    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

    for (let i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
    }
    for (let i = 0; i < dealerImages.length; i++) {
        dealerImages[i].remove();
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#your-blackjack-result').style.color = "white";
    document.querySelector('#dealer-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').style.color = "white";
    document.getElementById('blackjack-stand-btn').disabled = false;

});


function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();

    }
}

function scoreUpdate(card, activePlayer) {
    if (card === 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            console.log(blackjackGame['cardsMap'][card][1])
            activePlayer['score'] += blackjackGame['cardsMap'][card][1]
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0]
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] <= 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = "Bust!";
        document.querySelector(activePlayer['scoreSpan']).style.color = "red";
    }
}

//compute winner  and return how just won
function computeWinner() {
    let winner;
    if (YOU['score'] <= 21 && blackjackGame['turnOver'] === true) {

        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) {
            winner = "DRAW"
        }
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        winner = DEALER;
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        winner = "DRAW"
    }
    return winner
}

function showResult(winner) {
    let message, messageColor;
    if (winner === YOU) {
        message = "Você ganhou !";
        messageColor = "green";
        blackjackGame['wins']++;
        document.querySelector('#wins').textContent = blackjackGame['wins']
        winSound.play()
    } else if (winner === DEALER) {
        message = "Você perdeu !";
        messageColor = "red";
        blackjackGame['losses']++;
        document.querySelector('#losses').textContent = blackjackGame['losses']
        lossSound.play()
    } else {
        blackjackGame['draws']++;
        document.querySelector('#draws').textContent = blackjackGame['draws']
        message = "Empate !";
    }
    document.querySelector('#backjack-result').textContent = message;
    document.querySelector('#backjack-result').style.color = messageColor;

    blackjackGame['turnOver'] = true;
    DEALER['score']=== 0
}


