const columns = document.getElementsByClassName('column');
const backdrop = document.querySelector('.backdrop');
const gameResult = document.querySelector('.gameresult');
const restartBtn = document.querySelector('.restartbtn');
const gameresulttext = document.querySelector('.gameresulttext');
//audio
const myAudio = document.querySelector('#audio');
const clickAudio = document.querySelector('#audioclick');
const player1 = {
    index: 1,
    name: localStorage.getItem('player1') || ''
};

let player2 = {
    index: 2,
    name: localStorage.getItem('player1') || ''
};


//----------------------------------------------------------------------
//firststart window
const startthegame = document.querySelector('.startthegame');
const startthegamebtn = document.querySelector('.startthegamebtn');
//localStorage startpage
const isStart = localStorage.getItem('isStart');

startthegamebtn.addEventListener('click', ()=> {
    clickAudio.play();
    startthegame.classList.add('hidden');
    startthegamebtn.classList.add('hidden');
    localStorage.setItem('isStart', 'true');
    player1.name = document.getElementById('input1').value || player1.name;
    player2.name = document.getElementById('input2').value || player2.name;
    playerToMove = player1;
});

if(isStart === 'true'){
    startthegame.classList.add('hidden');
    startthegamebtn.classList.add('hidden');
} else if (!document.getElementById('input1').value && !document.getElementById('input2').value) {
    document.getElementById('input1').value = player1.name;
    document.getElementById('input2').value = player2.name;
}

//names1
const startBtn = document.getElementById('str');

startBtn.addEventListener('click', function(){
    const inputName = document.querySelector('input');
    localStorage.setItem('player1', player1.name);
    inputName.addEventListener('click', ()=>{
        try{
            JSON.parse(localStorage.getItem('player1'));
        } catch {
            return;
        }
    });
});
//names2
const startBtn2 = document.getElementById('str');

startBtn2.addEventListener('click', function(){
    const inputName = document.querySelector('input');
    localStorage.setItem('player2', player2.name);
    inputName.addEventListener('click', ()=>{
        try{
            JSON.parse(localStorage.getItem('player2'));
        } catch {
            return;
        }
    });
});

//restart btn
restartBtn.addEventListener('click', ()=> {
    console.log('player 1 before restart; ', player1);
    clickAudio.play();
    document.location.reload(false);
});



//New Game
const newGame = document.getElementById('newGame');
newGame.addEventListener('click', function populateStorage() {
    clickAudio.play();
    localStorage.clear();
    document.location.reload(false);
});

//-------------------------------------------------------------------

// 1. DEFINE GLOBAL VARIABLES
let holesElements = Array.from(document.querySelectorAll('.hole'));
let columnElements = Array.from(document.querySelectorAll('.column'));

let holes = [
    0, 0, 0, 0, 0, 0,  // first column
    0, 0, 0, 0, 0, 0,  // second column 
    0, 0, 0, 0, 0, 0,  // third column
    0, 0, 0, 0, 0, 0,  // fourth column
    0, 0, 0, 0, 0, 0,  // fifth column
    0, 0, 0, 0, 0, 0,  // sixth column
    0, 0, 0, 0, 0, 0,  // seventh column
];

let playerToMove = player1; //... more global variables
let numOfColumns = 7;
let numOfRows = 6;
// let gameResult;
// let filledIdx;

// 
for (let i=0; i < columns.length; i++){
    columns[i].addEventListener('click', () => {
        clickAudio.play();
        const result = fillColumn(i);
        const successful = result.success;
        const filledIdx = result.filledIdx;
        if (successful){
            const hasColumnWin = checkColumnWin(i);
            const hasRowWin = checkForRowWin(filledIdx);
            const hasDiagonalWin = checkForDiagonalWin();
            const hasDraw = checkForDraw();
            if (playerToMove.index === player1.index){
                playerToMove = player2;
            } else if(playerToMove.index === player2.index){
                playerToMove = player1;
            }
        }else{ //if it was not successful:
            return; //we do nothing
        }             
    });
}



function fillColumn(columnIndex){
    const startIdx = columnIndex * numOfRows;
    const endIdx = startIdx + numOfRows; 
    for (let i=startIdx; i < endIdx; i++){
        if (holes[i] === 0){
            holes[i] = playerToMove.index;
            holesElements[i].classList.add('player' + playerToMove.index);
            return { success: true, filledIdx: i};
        }
    } return { success: false};
}

function checkColumnWin(columnIdx){
    const startIdx = columnIdx * numOfRows;
    const endIdx = startIdx + numOfRows; 
    let countChips = 0;
    let lastChip;
    for (let i=startIdx; i < endIdx; i++){
        if(holes[i] === 0){
            return false;
        } else if (holes[i] !== lastChip){
            lastChip = holes[i];
            countChips = 1;
        }else{
            countChips++;
        }
        if (countChips === 4){
            console.log('Player ', playerToMove.name , ' win');
            backdrop.classList.add('hidden');
            gameResult.classList.add('hidden');
            gameresulttext.innerHTML = 'The winner is: ' + playerToMove.name;
            myAudio.play();
            return true;
            
        }       
    }
    return false;
}

function checkForRowWin(filledIdx){
    const startIdx = filledIdx%numOfRows;
    const endIdx = numOfRows * numOfColumns; 
    let countChips = 0;
    let lastChip;
    for (let i=startIdx; i < endIdx; i+=numOfRows){
        if(holes[i] === 0){
            countChips = 0;
        } else if (holes[i] !== lastChip){
            lastChip = holes[i];
            countChips = 1; 
        }else{
            countChips++;
        }
        if (countChips === 4){ 
            console.log('Player ', playerToMove.name, 'win');
            backdrop.classList.add('hidden');
            gameResult.classList.add('hidden');
            gameresulttext.innerHTML = 'The winner is: ' + playerToMove.name;
            myAudio.play();
            return true;
        }       
    }
    return false;
}


function checkForDiagonalWin() {
    for (let i = 0; i < winIndices.length; i++) {
        const hasWin = winIndices[i].every(winIndex => {
            return holes[winIndex] === playerToMove.index;
        });
        if (hasWin === true){
            // console.log('Player ', playerToMove.name, 'win');
            backdrop.classList.add('hidden');
            gameResult.classList.add('hidden');
            gameresulttext.innerHTML = 'The winner is: ' + playerToMove.name;
            myAudio.play();
            return true;
        }
    }
    return false;
}


function checkForDraw(){
    if (holes.includes(0)){
        return false;
    }else{
        console.log('draw');
        backdrop.classList.add('hidden');
        gameResult.classList.add('hidden');
        gameresulttext.innerHTML = 'Impossible, but its a DRAW';
        return true;    
    }
}


const winIndices = [
    // starting from first row; second column
    [0, 7, 14, 21], // index 0
    [7, 14, 21, 28], // index 1
    [14, 21, 28, 35], // index 2
    
    // starting from first row; second column
    [6, 13, 20, 27], // index 3
    [13, 20, 27, 34], // index 4
    [20, 27, 34, 41], // index 5
    
    // starting from first row; third column
    [12, 19, 26, 33], // index 6
    [19, 26, 33, 40], // index 7
    
    // starting from first row; fourth column
    [18, 25, 32, 39], // index 8
    
    // starting from second row; first column
    [1, 8, 15, 22], // index 9
    [8, 15, 22, 29], // index 10
    
    // starting from third row; first column
    [2, 9, 16, 23], // index 11
    
    // starting from first row; 7th/last column
    [36, 31, 26, 21], // index 12
    [31, 26, 21, 16], // index 13
    [26, 21, 16, 11], // index 14
    
    // starting from first row; 6th column
    [30, 25, 20, 15], // index 15
    [25, 20, 15, 10], // index 16
    [20, 15, 10, 5], // index 17
    
    // starting from first row; 5th column
    [24, 19, 14, 9], // index 18
    [19, 14, 9, 4], // index 19
    
    // starting from first row; 4th column
    [18, 13, 8, 3], // index 20
    
    // starting from second row; 7th/last column
    [37, 32, 27, 22], // index 21
    [32, 27, 22, 18], // index 22
    
    // starting from third row; 7th/last column
    [38, 33, 28, 23], // index 23
];


// document.addEventListener('keydown', (event) => {
//     if(event.keyCode === 49){
//         for (let i=0; i < columnElements.length; i++){
//             holes[i] = playerToMove.index;
//             holesElements[i].classList.add('player' + playerToMove.index);
//         }
//     }
// });
// document.body.addEventListener("keydown", (event) => {
//     if (event.keyCode === 13) {
//         clickAudio.play();
//         startthegame.classList.add('hidden');
//         startthegamebtn.classList.add('hidden');
//         localStorage.setItem('isStart', 'true');
//         player1.name = document.getElementById('input1').value || player1.name;
//         player2.name = document.getElementById('input2').value || player2.name;
//         playerToMove = player1;
//     }
// })  ;