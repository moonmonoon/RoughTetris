import BLOCKS from "./blocks.js"

// DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

// Setting
const GAME_ROWS = 20;
const Game_COLS = 10;

// variables
let score = 0;
let duration = 500; //블록이 떨어지는 시간
let downInterval;
let tempMovingItem; //움직이기 전 저장

const movingItem = { //다음블럭의 타입, 좌표 정보
    type: "",
    direction: 3, //블록 회전 지표
    top: 0, //블록 상하 값
    left: 0 //블록 좌우 값

};

init()

// functions
function init() {
    tempMovingItem = {...movingItem}; //안의 내용값만 불러옴
    for(let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    generateNewBlock()
}

// 테트리스 칸(matrix) 생성
function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j = 0; j < Game_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}
function renderBlocks(moveType = ""){
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ?  playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving")
        } else {
            tempMovingItem = { ...movingItem }
            if(moveType === 'retry'){
                clearInterval(downInterval)
                showGameoverText()
            }
            setTimeout(()=>{
                renderBlocks('retry') //좌표 원상복구 시키고 재귀함수 호출
                if(moveType === "top"){
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}
function checkMatch(){
    
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if(!li.classList.contains("seized")){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine()
            score++;
            scoreDisplay.innerHTML = score;
        }
    })

    generateNewBlock()
}
function generateNewBlock(){
    clearInterval(downInterval)
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, duration)

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length) 
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks()
}
function checkEmpty(target){ //블록이 밖으로 벗어나지 않도록, 맨 하단의 블록 체크
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks()
}
function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, 20)
}
function showGameoverText(){
    gameText.style.display = "flex";
}
// event handling
document.addEventListener("keydown", e=> {
    switch(e.keyCode){
        case 39: //오른쪽 이동
            moveBlock("left", 1);
            break;
        case 37: //왼쪽 이동
            moveBlock("left", -1);
            break;
        case 40: //아래 이동
            moveBlock("top", 1);
            break;
        case 38: //회전 (위쪽 화살표)
            changeDirection();
            break;
        case 32: //블록 떨어뜨리기 (스페이스바)
            dropBlock();
            break;
        default:
            break;
    }
})

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    scoreDisplay.innerHTML = "0";
    gameText.style.display = "none";
    init()
})