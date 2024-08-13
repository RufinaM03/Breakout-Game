const grid = document.querySelector('.grid')
let bat
let ball
let blocks
let life = 2
const boardHeight = 400
const boardWidth = 560
const margin = 10
const blockWidth = 100
const blockHeight = 20
const ballSize = 20

const batStart = [230, 5]
let currentPosition = batStart
const ballStart = [270, 25]
let bPosition = ballStart

let timerId_1, timerId_2
let microseconds = 30
let px = 4

let blockhit = false

let directionFlags = {
    ru: false,
    lu: false,
    u: false,
    ld: false,
    rd: false,
    d: false
};

let ArrayOfDirections = [
    [moveBall_right_upward, 'ru'],
    [moveBall_left_upward, 'lu'],
    [moveBall_upward, 'u'],
    [moveBall_left_downward, 'ld'],
    [moveBall_right_downward, 'rd'],
    [moveBall_downward, 'd']
];

function falsify_all_directions() {
    for (let direction in directionFlags) {
        directionFlags[direction] = false
    }
}

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight],
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

function addBlock() {

    const existingBlocks = document.querySelectorAll('.block')
    existingBlocks.forEach(block => {
        grid.removeChild(block);
    })

    blocks = [
        new Block(10,370),
        new Block(120,370),
        new Block(230,370),
        new Block(340,370),
        new Block(450,370),
        new Block(10,340),
        new Block(120,340),
        new Block(230,340),
        new Block(340,340),
        new Block(450,340),
        new Block(10,310),
        new Block(120,310),
        new Block(230,310),
        new Block(340,310),
        new Block(450,310)
    ]

    for (let i=0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block') 
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)
    }
}

function addBat() {
    const existingBat = document.querySelector('.bat');
    if (existingBat) {
        grid.removeChild(existingBat);
    }

    bat = document.createElement('div')
    bat.classList.add('bat')
    drawBat()
    grid.appendChild(bat)
}

function drawBat() {
    bat.style.left = currentPosition[0] + 'px'
    bat.style.bottom = currentPosition[1] + 'px'
}

function user(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0 + margin)
                currentPosition[0] -= 20
            drawBat()
            break
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth - margin)
                currentPosition[0] += 20
            drawBat()
            break
    }
}

function addBall() {
    const existingBall = document.querySelector('.ball');
    if (existingBall) {
        grid.removeChild(existingBall);
    }

    ball = document.createElement('div')
    ball.classList.add('ball')
    drawBall()
    grid.appendChild(ball)
}

function drawBall() {
    ball.style.left = bPosition[0] + 'px'
    ball.style.bottom = bPosition[1] + 'px'
}

function moveBall_right_upward() {
    directionFlags.ru = true
    bPosition[0] += px
    bPosition[1] += px
    drawBall()
}

function moveBall_left_upward() {
    directionFlags.lu = true
    bPosition[0] -= px
    bPosition[1] += px
    drawBall()
}

function moveBall_upward() {
    directionFlags.u = true
    bPosition[1] += px
    drawBall()
}

function moveBall_left_downward() {
    directionFlags.ld = true
    bPosition[0] -= px
    bPosition[1] -= px
    drawBall()
}

function moveBall_right_downward() {
    directionFlags.rd = true
    bPosition[0] += px
    bPosition[1] -= px
    drawBall()
}

function moveBall_downward() {
    directionFlags.d = true
    bPosition[1] -= px
    drawBall()
}

let num
let directions
function rand() {
    num = Math.ceil(Math.random()*directions)
    falsify_all_directions()
}

directions = 3

function moveBall_default() {
    switch(num) {
        case 1:
            moveBall_upward()
            break;
        case 2:
            moveBall_left_upward()
            break;
        case 3:
            moveBall_right_upward()
            break;
    }
}


function moveBall_rightborder() {
    switch(num) {
        case 1:
            moveBall_downward()
            break;
        case 2:
            moveBall_left_downward()
            break;
        case 3:
            moveBall_left_upward()
            break;
    }
}


function moveBall_leftborder() {
    switch(num) {
        case 1:
            moveBall_downward()
            break;
        case 2:
            moveBall_right_downward()
            break;
        case 3:
            moveBall_right_upward()
            break;
    }
}

function moveBall_upperborder() {
    switch(num) {
        case 1:
            moveBall_downward()
            break
        case 2:
            moveBall_left_downward()
            break
        case 3:
            moveBall_right_downward()
            break
    }
}

fullReset()


function game_on() {
    document.addEventListener('keydown', user)
    bathit()
    setTimeout(() => {
        grid.removeEventListener('click',game_on)
        grid.addEventListener('click',pause)
    }, 100)
}
function stop() {
    document.removeEventListener('keydown', user)
    clearInterval(timerId_1)
    clearInterval(timerId_2)
}
function resume() {
    for (let j = 0; j < 6; j++) {
        if (directionFlags[ArrayOfDirections[j][1]]) {
            timerId_1 = setInterval(() => {
                ArrayOfDirections[j][0]()
                collisionExecution()
            }, microseconds)
        }
    }
}
function pause() {
    stop()
    setTimeout(() => {
        grid.removeEventListener('click',pause)
        grid.addEventListener('click',play)
    }, 100)
}
function play() {
    resume()
    collisionExecution()
    document.addEventListener('keydown', user)
    setTimeout(() => {
        grid.removeEventListener('click',play)
        grid.addEventListener('click',pause)
    }, 100)
}

function collisionExecution() {
    clearInterval(timerId_2)
    timerId_2 = setInterval(() => {
        checkForCollisions()
    }, microseconds/px)
}

function bathit() {

    let leftHit = currentPosition[0] - ballSize
    let rightHit = currentPosition[0] + blockWidth
    let batTop = currentPosition[1] + blockHeight

    if ((bPosition[0] > leftHit && bPosition[0] < rightHit) && (bPosition[1] == batTop)) {
        clearInterval(timerId_1)
        clearInterval(timerId_2)
        rand()
        timerId_1 = setInterval(() => {
            moveBall_default()
            collisionExecution()
        }, microseconds)
    }
}

let x_start, x_end
let y_start, y_end

function removeBlock(block_number) {
    const allBlocks = Array.from(document.querySelectorAll('.block'))
    allBlocks[block_number].classList.remove('block')
    blocks.splice(block_number, 1)
}

function blockHitCheck() {
    for (let i=0; i<blocks.length; i++) {
        x_start = blocks[i].bottomLeft[0] - ballSize
        x_end = blocks[i].bottomLeft[0] + blockWidth
        y_start = blocks[i].bottomLeft[1] - ballSize
        y_end = blocks[i].bottomLeft[1] + blockHeight

        if ((bPosition[0] >= x_start && bPosition[0] <= x_end) && (bPosition[1] >= y_start && bPosition[1] <= y_end)) {
            
            console.log('blockhit')
            blockhit = true
            removeBlock(i)

            clearInterval(timerId_1)
            clearInterval(timerId_2)
            rand()

            if(bPosition[0] === x_start) {
                timerId_1 = setInterval(() => {
                    moveBall_rightborder()
                    collisionExecution()
                }, microseconds)
            }
            if (bPosition[0] === x_end) {
                timerId_1 = setInterval(() => {
                    moveBall_()
                    collisionExecution()
                }, microseconds)
            }
            if (bPosition[0] > x_start && bPosition[1] < x_end) {
                if (bPosition[1] === y_start || bPosition[1] < y_end/2) {
                    timerId_1 = setInterval(() => {
                        moveBall_upperborder()
                        collisionExecution()
                    }, microseconds)
                }
                if (bPosition[1] === y_end || bPosition[1] > y_end/2) {
                    timerId_1 = setInterval(() => {
                        moveBall_default()
                        collisionExecution()
                    }, microseconds)
                }  
            }
        }
    }
}

function checkForCollisions() {

    if (bPosition[0] >= boardWidth - ballSize) {
        clearInterval(timerId_1)
        clearInterval(timerId_2)

        if (blockhit == true) {
            blockhit = false
            directions = 2
        }

        rand()
        directions = 3

        timerId_1 = setInterval(() => {
            moveBall_rightborder()
            collisionExecution()
        }, microseconds)
    }
    else if (bPosition[0] <= 0) {
        clearInterval(timerId_1)
        clearInterval(timerId_2)

        if (blockhit == true) {
            blockhit = false
            directions = 2
        }

        rand()
        directions = 3
        
        timerId_1 = setInterval(() => {
            moveBall_leftborder()
            collisionExecution()
        }, microseconds)
    }
    else if (bPosition[1] >= boardHeight - ballSize) {
        clearInterval(timerId_1)
        clearInterval(timerId_2)
        rand()
        timerId_1 = setInterval(() => {
            moveBall_upperborder()
            collisionExecution()
        }, microseconds)
    }
    else if (bPosition[1] <= 0) {
        stop()
        setTimeout(reset, 100)
    }

    bathit()
    blockHitCheck()
}

function reset() {
    if (life == 0) {
        fullReset()
    }
    else {
        halfReset()
        life--
    }
}

function halfReset() {
    currentPosition = [230, 5]
    bPosition = [270, 25]
    addBat()
    addBall()
    grid.addEventListener('click', game_on)
    document.addEventListener('keydown', user)
}

function fullReset() {
    addBlock()
    halfReset()
    life = 2
}


