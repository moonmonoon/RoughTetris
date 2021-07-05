// DOM
const playground = document.querySelector(".playground > ul");
    //console.log(playground)

// Setting
const GAME_ROWS = 20;
const Game_COLS = 10;

// variables
let score = 0;
let duration = 500; //블록이 떨어지는 시간
let downInterval;
let tempMovingItem; //움직이기 전 저장

//블록 만들기
const BLOCKS = {
    tree: [
        [[2,1],[0,1],[1,0],[1,1]],
        [],
        [],
        [],
    ]
}

const movingItem = { //다음블럭의 타입, 좌표 정보
    type: "tree",
    direction: 0, //블록 회전 지표
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
    renderBlocks()
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
function renderBlocks(){
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].forEach(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ?  playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving")
        } else {
            tempMovingItem = { ...movingItem }
            setTimeout(()=>{
                renderBlocks(); //좌표 원상복구 시키고 재귀함수 호출
            }, 0)
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function checkEmpty(target){ //블록이 밖으로 벗어나지 않도록, 맨 하단의 블록 체크
    if(!target){
        return false;
    }
    return true;
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks()
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
        default:
            break;
    }
})