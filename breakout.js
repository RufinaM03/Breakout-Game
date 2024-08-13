const grid = document.querySelector('.grid')
const boardHeight = 400
const boardWidth = 560
const blockWidth = 100
const blockHeight = 20
const ballSize = 20
const batStart = [230, 5]
let currentPosition = batStart
const ballStart = [270, 25]
let bPosition = ballStart
let timerId
let speedControl = 10

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight],
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = [
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

function addBlock() {
    for (let i=0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block') 
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)
    }
}

addBlock()

const bat = document.createElement('div')
bat.classList.add('bat')
drawBat()
grid.appendChild(bat)

function drawBat() {
    bat.style.left = currentPosition[0] + 'px'
    bat.style.bottom = currentPosition[1] + 'px'
}

function user(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0)
                currentPosition[0] -= 10
            drawBat()
            break
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth)
                currentPosition[0] += 10
            drawBat()
            break
    }
}

document.addEventListener('keydown', user)

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

function drawBall() {
    ball.style.left = bPosition[0] + 'px'
    ball.style.bottom = bPosition[1] + 'px'
}

function moveBall_right_upward() {
    bPosition[0] += 1
    bPosition[1] += 1
    drawBall()
}

function moveBall_left_upward() {
    bPosition[0] -= 1
    bPosition[1] += 1
    drawBall()
}

function moveBall_upward() {
    bPosition[1] += 1
    drawBall()
}

function moveBall_left_downward() {
    bPosition[0] -= 1
    bPosition[1] -= 1
    drawBall()
}

function moveBall_right_downward() {
    bPosition[0] += 1
    bPosition[1] -= 1
    drawBall()
}

function moveBall_downward() {
    bPosition[1] -= 1
    drawBall()
}

let num
let directions
function rand() {
    num = Math.ceil(Math.random()*directions)
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
            moveBall_left_upward()
            break;
        case 3:
            moveBall_left_downward()
            break;
    }
}


function moveBall_leftborder() {
    switch(num) {
        case 1:
            moveBall_downward()
            break;
        case 2:
            moveBall_right_upward()
            break;
        case 3:
            moveBall_right_downward()
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

grid.addEventListener('click', game_on)

function game_on() {
    grid.removeEventListener('click', game_on)
    bathit()
}

function bathit() {

    let leftHit = currentPosition[0] - ballSize
    let rightHit = currentPosition[0] + blockWidth
    let batTop = currentPosition[1] + blockHeight

    if ((bPosition[0] > leftHit && bPosition[0] < rightHit) && (bPosition[1] == batTop)) {
        clearInterval(timerId)
        rand()
        timerId = setInterval(() => {
            moveBall_default()
            checkForCollisions()
        }, speedControl)
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

            removeBlock(i)

            clearInterval(timerId)
            rand()

            if(bPosition[0] === x_start) {
                timerId = setInterval(() => {
                    moveBall_rightborder()
                    checkForCollisions()
                }, speedControl)
            }
            if (bPosition[0] === x_end) {
                timerId = setInterval(() => {
                    moveBall_leftborder()
                    checkForCollisions()
                }, speedControl)
            }
            if (bPosition[0] > x_start && bPosition[0] < x_end) {
                if (bPosition[1] === y_start) {
                    timerId = setInterval(() => {
                        moveBall_upperborder()
                        checkForCollisions()
                    }, speedControl)
                }
                if (bPosition[1] === y_end) {
                    timerId = setInterval(() => {
                        moveBall_default()
                        checkForCollisions()
                    }, speedControl)
                }  
            }
        }
    }
}

function checkForCollisions() {

    if (bPosition[0] > boardWidth - ballSize) {
        clearInterval(timerId)
        rand()
        timerId = setInterval(() => {
            moveBall_rightborder()
            checkForCollisions()
        }, speedControl)
    }
    else if (bPosition[0] < 0) {
        clearInterval(timerId)
        rand()
        timerId = setInterval(() => {
            moveBall_leftborder()
            checkForCollisions()
        }, speedControl)
    }
    else if (bPosition[1] > boardHeight - ballSize) {
        clearInterval(timerId)
        rand()
        timerId = setInterval(() => {
            moveBall_upperborder()
            checkForCollisions()
        }, speedControl)
    }
    else if (bPosition[1] < 0) {
        clearInterval(timerId)
    }

    bathit()
    blockHitCheck()
}


