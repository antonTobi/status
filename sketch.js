const startTime = 60e3
const increment = 1e3
document.bgColor = "white"

// TODO Show problem(s) to learn from after game over
// Last problem (either you got it incorrect or you timed out on it) + maybe slowest solved problem

document.addEventListener('mousedown', function (event) {
    if (event.detail > 1) {
        event.preventDefault()
    }
}, false)

class Particle {
    constructor(c, s, x, y) {
        this.c = c
        this.s = s
        this.x = x
        this.y = y
    }
}

function preload() {
    soundFormats("mp3", "ogg")

    correctSound = loadSound("assets/Move.mp3")
    wrongSound = loadSound("assets/Error.mp3")
    timeUpSound = loadSound("assets/energy3.mp3")

    font = loadFont("assets/Roboto-Light.ttf")
}

function windowResized() {
    R = floor(min(window.innerWidth / 22, window.innerHeight / 34))
    D = 2 * R
    sizes = [R, R, R, R]
    resizeCanvas(D * 11 - 1, D * 16 - 1)
}

function updateBoard() {
    let i = round(difficultyLevel)
    if (!boards[i].length) {
        boards[i] = shuffle(boardsOfDifficulty[i].filter(b => b != board))
    }
    board = boards[i].pop()
}

function setup() {
    cnv = createCanvas(0, 0)
    cnv.mousePressed(clickHandler)
    windowResized()
    textAlign(CENTER, CENTER)
    textFont(font)
    difficultyLevel = 1
    boards = new Array(6)
    for (let i = 1; i <= 5; i ++) {
        boards[i] = shuffle(boardsOfDifficulty[i])
    }
    updateBoard()
    lastSolveTimeStamp = -Infinity

    points = 0

    highscore = getItem("statusGameHighscore") || 0
    longestStreak = getItem("statusGameLongestStreak") || 0
    timer = getItem("infiniteMode") ? Infinity : startTime

    timerRunning = false
    gameOver = false
    

    particles = []
}

function draw() {
    background("white")

    if (timerRunning) {
        timer -= deltaTime
        if (timer < 0) {
            timeUpSound.play()
            timer = 0
            timerRunning = false
            gameOver = true

            if (points > highscore) {
                storeItem("statusGameHighscore", points)
            }
        }
    }

    fill("black")

    let endless = timer == Infinity

    textSize(0.8 * R)
    text("Time", width / 6, 0.7 * R)
    if (endless) {
        text("Difficulty", 3 * width / 6, 0.7 * R)
    } else {
        text("Score", 3 * width / 6, 0.7 * R)
        text("Best", 5 * width / 6, 0.7 * R)
    }
    

    textSize(D)
    let displayTime = endless ? "∞" : (0.001 * timer).toFixed(1)
    text(displayTime, width / 6, D)
    if (endless) {
        text(difficultyLevel, 3 * width / 6, D)
    } else {
        text(points, 3 * width / 6, D)
        text(highscore, 5 * width / 6, D)
    }


    translate(0, 2 * D)
    board.draw()
    if (gameOver) {
        noStroke()
        fill(255, 255, 255, 200)
        rect(5*R, 1*R-1, 6*D, 3*D, R)
        // rect(0, -1, 11 * D, 11 * D + 1)
        fill("black")
        textSize(D)
        text(timer == 0 ? "Time's up!" : "Wrong!", 11 * R, 2.8 * R)
        textSize(R)
        text("This group is " + ["dead", "alive", "unsettled"][board.status-1] + ".", 11 * R, 4.9 * R)
        textSize(0.6*R)
        fill(0, 100)
        text(board.hash(), 21*R, 21.5*R)
    }
    translate(0, D * 12 - 1)
    textSize(R)

    fill("black")
    if (gameOver) {
        let s = "Click on the board (or press Enter)\nto start a new game."
        if (points > highscore) {
            if (timer == 0) {
                s = "Well done, you beat your personal best!"
            } else {
                s = "Only runs without mistakes\ncount for your personal best!"
            }
        }
        text(s, width/2, 0)
    } else {
        for (let i in sizes) {
            sizes[i] -= 2
            if (sizes[i] < R) sizes[i] = R
        }
        push()
        
    
        translate(width / 6, 0)
        
        textSize(sizes[1])
        text("Dead", 0, 0)
        translate(width / 3, 0)
        textSize(sizes[3])
        text("Unsettled", 0, 0)
        translate(width / 3, 0)
        textSize(sizes[2])
        text("Alive", 0, 0)

        pop()
    }

    textSize(R)
    
    for (let p of particles) {
        fill(p.c)
        text(p.s, p.x, p.y)
        p.y++
    }

    particles = particles.filter((p) => p.y < 500)

}

function submit(status) {
    if (gameOver) return

    sizes[status] = 0.8 * D
    let x = [0, width/6, (5 * width) / 6, 3*width / 6][status]
    if (status == board.status) {
        correctSound.play()    
        if (timer != Infinity) {
            timerRunning = true
            let solveTime = (millis() - lastSolveTimeStamp)/1000
            difficultyLevel -= 0.5*atan((solveTime-3)/TAU)
            difficultyLevel = constrain(difficultyLevel, 1, 4) // change to 5 once there is enough difficulty 5 problems
            lastSolveTimeStamp = millis()
            timer += increment
            points += board.difficulty
        }
        let s = timer == Infinity ? "Correct!" : "+" + board.difficulty
        let p = new Particle("lime", s, x, R)
        particles.push(p)
        updateBoard()
    } else {
        wrongSound.play()
        if (timer == Infinity) {
            wrongSound.play()
            let p = new Particle("red", "Wrong!", x, R)
            particles.push(p)
        } else {
            timerRunning = false
            gameOver = true
        }
        
    }
}

function toggleGameMode() {
    if (!timerRunning) {
        storeItem("infiniteMode", timer != Infinity)
        setup()
    }
}

function clickHandler() {
    if (mouseY < 2 * D) {
        if (mouseX < width / 3) {
            toggleGameMode()
        } else if (mouseX < 2 * width / 3) {
            if (timer == Infinity) {
                difficultyLevel += 1
                if (difficultyLevel == 5) difficultyLevel = 1
                updateBoard()
            }
        } else {
            if (timer != Infinity && !timerRunning) {
                if (confirm("Reset highscore?")) {
                    storeItem("statusGameHighscore", 0)
                    setup()
                }
            }
        }
    }
    if (mouseY > 2 * D && mouseY < 13 * D && gameOver) {
        setup()
    }
    if (mouseY > 13 * D) {
        if (mouseX < width / 3) {
            submit(1)
        } else if (mouseX < (2 * width) / 3) {
            submit(3)
        } else {
            submit(2)
        }
    }
    // return false
}

function doubleClicked() {
    return false
}

function keyPressed() {
    if (key == "ArrowLeft") {
        submit(1)
    } else if (key == "ArrowDown" || key == "ArrowUp") {
        submit(3)
    } else if (key == "ArrowRight") {
        submit(2)
    } else if (key == "Enter" && timer != Infinity) {
        setup()
    }
}
