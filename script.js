// Document elements
const root = document.querySelector(':root')
const numbersGrid = document.querySelector('.numbers-grid')
const verticalSums = document.querySelector('.vertical-sums')
const horizontalSums = document.querySelector('.horizontal-sums')
const deleteButton = document.querySelector('#delete-button')
const circleButton = document.querySelector('#circle-button')
const newGameButton = document.querySelector('#new-game-button')
const livesContainer = document.querySelectorAll('.live')
// const levelContainer = document.querySelector('.level-container > span')
let numbersSquares
let verticalSumsSquares
let HorizontalSumsSquares

// Constants
const columnsCount = randomBetween(3, 6)
const rowsCount = columnsCount
const emptySquaresPercentage = 0.4
const numbersOfEmptySquares = Math.floor(columnsCount * rowsCount * emptySquaresPercentage)
const totalSums = columnsCount + rowsCount

// Variables
let isCircle = true
let lives = 3
let gameOver = false
let totalSumsEqualZero = 0
let emptySquares = 0
let hiddenEmptySquares = 0

// Set No of rows & columns in CSS variables
root.style.setProperty('--columns-count', columnsCount)
root.style.setProperty('--rows-count', rowsCount)

// Functions
function createVerticalSums() {
    verticalSums.innerHTML = ''
    for (let i = 0; i < columnsCount; i++) {
        const div = document.createElement('div')
        div.textContent = `v${i}`
        div.classList.add('square')
        div.classList.add('sum')
        verticalSums.append(div)
    }
}

function createHorizontalSums() {
    horizontalSums.innerHTML = ''
    for (let j = 0; j < rowsCount; j++) {
        const div = document.createElement('div')
        div.textContent = `h${j}`
        div.classList.add('square')
        div.classList.add('sum')
        horizontalSums.append(div)
    }
}

function fillNumbersGrid() {
    numbersGrid.innerHTML = ''
    for (let i = 0; i < rowsCount * columnsCount; i++) {
        const div = document.createElement('div')
        const span = document.createElement('span')
        span.textContent = `${randomBetween(0, 9)}`
        div.classList.add('square', 'number')
        div.setAttribute('data-index', i)
        div.append(span)
        numbersGrid.append(div)
    }
}

function randomBetween(minInterval, maxInterval) {
    return (Math.floor(Math.random() * (maxInterval + 1 - minInterval)) + minInterval)
}

function fillZeroes() {
    numbersSquares = numbersGrid.querySelectorAll('.square > span')
    for (let n = 0; n < numbersOfEmptySquares; n++) {
        let randomIndex = randomBetween(0, (rowsCount * columnsCount) - 1)
        numbersSquares[randomIndex].textContent = 0
    }
}

function calculateVerticalSums() {
    verticalSumsSquares = verticalSums.querySelectorAll('.square')
    for (let i = 0; i < columnsCount; i++) {
        let sum = 0
        for (let j = 0; j < rowsCount; j++) {
            let gridIndex = (j * columnsCount) + i
            sum += Number(numbersSquares[gridIndex].textContent)
        }
        verticalSumsSquares[i].textContent = sum
    }
}

function calculateHorizontalSums() {
    HorizontalSumsSquares = horizontalSums.querySelectorAll('.square')
    for (let i = 0; i < rowsCount; i++) {
        let sum = 0
        for (let j = 0; j < columnsCount; j++) {
            let gridIndex = j + (i * columnsCount)
            sum += Number(numbersSquares[gridIndex].textContent)
        }
        HorizontalSumsSquares[i].textContent = sum
    }
}

function replaceZeroesWithRandomNumbers() {
    numbersSquares.forEach(square => {
        if (square.textContent === '0') {
            square.classList.add('empty')
            emptySquares += 1
            square.textContent = Math.floor(Math.random() * 9 + 1)
        }
    })
}

function updateSums(squareIndex) {
    let columnIndex = (squareIndex % columnsCount)
    let rowIndex = Math.floor(squareIndex / columnsCount)
    // Update vertical sum
    let newVerticalSum = Number(verticalSumsSquares[columnIndex].textContent) - Number(numbersSquares[squareIndex].textContent)
    verticalSumsSquares[columnIndex].textContent = newVerticalSum
    // Update horizontal sum
    let newHorizontalSum = Number(HorizontalSumsSquares[rowIndex].textContent) - Number(numbersSquares[squareIndex].textContent)
    HorizontalSumsSquares[rowIndex].textContent = newHorizontalSum
    updateSumsEqualZero()
}

function updateSumsEqualZero() {
    total = 0
    verticalSumsSquares.forEach(square => {
        if (square.textContent === '0') {
            total += 1
        }
    })
    HorizontalSumsSquares.forEach(square => {
        if (square.textContent === '0') {
            total += 1
        }
    })
    totalSumsEqualZero = total
}

function playGame() {
    numbersGrid.addEventListener('click', (e) => {
        e.preventDefault()
        let clickedGridNumber = e.target
        let clickedGridNumberIndex = clickedGridNumber.parentElement.getAttribute('data-index')
        let clickedGridNumberClassList = Array.from(clickedGridNumber.classList)
        let parentClassList = Array.from(clickedGridNumber.parentElement.classList)
        if (gameOver) {
            console.log('GAME OVER!')
            return
        }
        if (!parentClassList.includes('number')) {
            return
        }
        if (clickedGridNumberClassList.includes('hidden')) {
            return
        }
        if (clickedGridNumberClassList.includes('circled')) {
            return
        }
        if (isCircle) {
            if (!clickedGridNumberClassList.includes('empty')) {
                clickedGridNumber.classList.add('circled')
                updateSums(clickedGridNumberIndex)
            } else {
                removeHeart()
            }
        } else {
            if (clickedGridNumberClassList.includes('empty')) {
                clickedGridNumber.parentElement.classList.add('hidden')
                hiddenEmptySquares += 1
            } else {
                removeHeart()
            }
        }
        checkGameFinished()
    })
}

// Buttons event listeners
deleteButton.addEventListener('click', () => {
    deleteButton.classList.add('selected-button')
    circleButton.classList.remove('selected-button')
    isCircle = false
})

circleButton.addEventListener('click', () => {
    circleButton.classList.add('selected-button')
    deleteButton.classList.remove('selected-button')
    isCircle = true
})

newGameButton.addEventListener('click', () => {
    location.reload()
})

function removeHeart() {
    livesContainer[lives - 1].style.backgroundImage = 'url("heart-empty.png")'
    lives -= 1
    if (lives === 0) {
        console.log('GAME OVER.')
        gameOver = true
    }
}

function checkGameFinished() {
    // console.log(`sums: ${totalSumsEqualZero} / ${totalSums} - empty: ${hiddenEmptySquares} / ${emptySquares}`)
    if (totalSumsEqualZero === totalSums && hiddenEmptySquares === emptySquares) {
        console.log('You Win!')
        // newGame()
    }
}

function resetLevelCounters() {
    lives = 3
    livesContainer.forEach(live => {
        live.style.backgroundImage = 'url("heart-full.png")'
    })
    totalSumsEqualZero = 0
    hiddenEmptySquares = 0
    emptySquares = 0
}

// Game logic
(function newGame() {
    resetLevelCounters()
    fillNumbersGrid()
    createVerticalSums()
    createHorizontalSums()
    fillZeroes()
    calculateVerticalSums()
    calculateHorizontalSums()
    replaceZeroesWithRandomNumbers()
    
    playGame()
})()

// newGame()

// TO DO
// > add game over overlay screen
// > add won game overlay screen
