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
        [[0,0],[0,1],[1,0],[1,1]],
        [],
        [],
        [],
    ]
}

const movingItem = { //다음블럭의 타입, 좌표 정보
    type: "tree",
    direction: 0, //블록 회전 지표
    top: 0, //블록 상하 값
    left: 0, //블록 좌우 값

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
    
    BLOCKS[type][direction].forEach(block=>{
        const x = block[0];
        const y = block[1];
        const target = playground.childNodes[y].childNodes[0].childNodes[x];
        target.classList.add(type);
    })
}