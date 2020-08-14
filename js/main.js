const suits = ['s', 'c', 'd', 'h'];
const pips = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
let playerHand = [];
let computerHand = [];
let masterDeck = [];
let score = {
    player: 0,
    computer: 0,
};
let bet = 0;
let daBank = 500;
const betDisplay = document.querySelector('.betDisplay');
const moneyDisplay = document.querySelector('.moneyDisplay');
const newGameBtn = document.getElementById('newGame');
const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const betBtn = document.getElementById('bet');
const nextHandBtn = document.getElementById('nextHand');
const playerArea = document.querySelector('.playerHand');
const computerArea = document.querySelector('.computerHand');
const pCardArea = playerArea.querySelector('.playArea');
const cCardArea = computerArea.querySelector('.playArea');
const message = document.getElementById('message');
const bettingContainer = document.getElementById('bettingContainer');
const betBtns = bettingContainer.querySelectorAll('.bet');
const pBoardScore = playerArea.querySelector('.scoreDisplay .plyrScore');
const defaultCardHTML = `
    <div class="card back-red"></div>
    <div class="card back-red"></div>
`;

//  ------------------- MASTER DECK -------------------
function buildMasterDeck(){ 
    masterDeck = [],
    suits.forEach(function(suit) {
        pips.forEach(function(pip) {
            let cardObj = {
                suit: suit,
                pip: pip,
                value: Number(pip) || (pip === 'A' ? 11 : 10),
                isHidden: false,
            }
            masterDeck.push(cardObj);
        });
    });
}
buildMasterDeck();
let playDeck = [...masterDeck];

function deal() {
    if (playDeck.length >= 1) {
        let newCard = playDeck.splice((Math.floor(Math.random() * playDeck.length)), 1);
        return newCard[0];
    } else {
        playerHand;
    }
    render();
};

//  ------------------- PLAY F(x)'s -------------------
function startHand() {
    let randomPlayerCard = deal();
    playerHand.push(randomPlayerCard);

    let randomComputerCard = deal();
    randomComputerCard.isHidden = true;
    computerHand.push(randomComputerCard);

    let randomPlayerCard2 = deal();
    playerHand.push(randomPlayerCard2);

    let randomComputerCard2 = deal();
    computerHand.push(randomComputerCard2);

    calcScore();
    render();
    newGameBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    betBtn.disabled = false;
};

function init() {
    score.player = 0;
    score.computer = 0;
    playerHand = [];
    computerHand = [];
    hitBtn.disabled = true;
    standBtn.disabled = true;
    betBtn.disabled = true;
    newGameBtn.disabled = false;
    nextHandBtn.disabled = true;
    pBoardScore.innerHTML = score.player;
    pCardArea.innerHTML = defaultCardHTML;
    cCardArea.innerHTML = defaultCardHTML;
    message.textContent = '';
    bet = 0;
    moneyDisplay.textContent = `$${daBank}`;
    betDisplay.textContent = `$${bet}`;
}

function createCardEl(card) {
    return `<div class="card ${card.isHidden ? "back-red" : ""} ${card.suit}${card.pip}"></div>`
}

function render () {
    pBoardScore.textContent = score.player;
    let playerCardHTML = '';
    let computerCardHTML = '';
    playerHand.forEach((card) => {
        playerCardHTML += createCardEl(card);
    })
    pCardArea.innerHTML = playerCardHTML;
    computerHand.forEach((card) => {
        computerCardHTML += createCardEl(card);
    })
    cCardArea.innerHTML = computerCardHTML;
}

function scoreReset() {
    score.player = 0;
    score.computer = 0;
}

function calcScore() {
    playerHand.forEach((card) => {
        // score.player += card.value is same as below
        score.player = score.player + card.value
    });

    computerHand.forEach((card) => {
        // score.computer += card.value is same as below
        score.computer = score.computer + card.value 
    });
}

function hit(turn = "player") {
    const whosHand = turn === 'computer' ? computerHand : playerHand;
    let randomPlayerCard = deal();
    whosHand.push(randomPlayerCard);
    
    if (turn === 'computer') {
        score.computer += randomPlayerCard.value;
    } else {
        score.player +=randomPlayerCard.value;
    }
    render();
    if (score.computer === 21 || score.player > 21) {
        win('computer');
        return;
    }
    if (score.computer === score.player) {
        win('tie');
        return;
    }
    if (score.computer > 21) {
        win('player');
        return;
    }
    if (score.player === 21){
        win('player');
    }
    
}

function revealDealerCard() {
    cCardArea.firstChild.classList.remove('back-red');
}

function stand() {
    revealDealerCard();
    while (score.computer < 17 || score.computer < score.player) {
        hit('computer');
        revealDealerCard();
    };
    if (score.computer > 21) {
        win('player');
        return;
    }
    if (score.computer > score.player && score.computer < 22){ 
        win('computer');
        return;
    }; 
    if (score.computer === score.player) {
        win('tie');
        return;
    };  
}

function win(whoWon) {
    revealDealerCard();
    if (whoWon === 'tie') { 
        message.textContent = "It's a tie! Push all bets back and try again."
    } else {
        message.textContent = `${whoWon === "player"  ? 'You win!' : 'Dealer wins, better luck next time.'}`;
    }
    if (whoWon === 'player') {
        payout(true);
    } else {
        payout(false);
    }
    nextHandBtn.disabled = false
    newGameBtn.disabled = true
    hitBtn.disabled = true
    standBtn.disabled = true
    betBtn.disabled = true
}

function handleBet (e) {
    let chipValue = parseInt(e.target.textContent);
    bet += chipValue;
    betDisplay.textContent = `$${bet}`;
}

function payout(isWin) {
    if (isWin) {
        daBank += (bet * 2);
    } else {
        daBank -= bet;
    };
    moneyDisplay.textContent = `$${daBank}`;
}
function nextHand() {
    init();
    deal();
}

init();

//  ------------------- EVENT LISTENERS -------------------
newGameBtn.addEventListener('click', startHand);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);
betBtn.addEventListener('click', function(){
    bettingContainer.classList.toggle("active");
});
betBtns.forEach(btn => {
    btn.addEventListener('click', handleBet)
})
nextHandBtn.addEventListener('click', nextHand)




//  ------------------- BELOW IS INCOMPLETE -------------------

// function tie () {
//     alert("Dealer and Player tied! Push all bets.")
//     newGameBtn.style.visibility = "visible";
//     hitBtn.style.visibility = "hidden";
//     standBtn.style.visibility = "hidden";
//     betBtn.style.visibility = "hidden";
// }

//TO DO - pass through the information of card randomized card to
// visually show matching counterpart through array method to sync 
// CSS with the card presented....  "Data-attribute" thing maybe?









/*----- app's state (variables) -----*/
/*
1.) Who's turn? 
2.) Bet
3.) 



*/
/*----- cached element references -----*/









/*----- event listeners -----*/









/*----- functions -----*/
// let render = function (shuffleDeck) {

// };
// let newGame;






// run function to see if count <= 21, if so then go to dealer turn

//TO DO - player must now choose hit/stand (bet will be added later)
// so the following outcomes can happen: 
//      1.) Hit - run function push player new card/mutate deck
//      and run function to see if count <= 21
//      2.) Stand - run function that pushes new card/mutate deck
//      and go to dealer hit/stand (While 17 or more, stand)

//TO DO - If player HITS then add new card to player hand and 
// run function to see if >= 21.  If greater, bust and dealer turn. 


/* 
"For example, you might decide to model a game of tic-tac-toe using 
the values of 1, -1 or null to represent whether a square holds 
Player X, Player O, or nobody, respectively. However, when it comes 
time to transfer the app's state to the DOM, you can visualize the 
state anyway you want, e.g., a value of 1 is "rendered" with a 
certain image, etc."

    * IDEA - make cards assigned to this value strategy when 
    rendered they can be tied to a numerical value tied to suit and 
    card #


    */