const startTime = 30e3;
document.bgColor = "white";

class Particle {
  constructor(c, s, x, y) {
    this.c = c;
    this.s = s;
    this.x = x;
    this.y = y;
  }
}

function preload() {
  soundFormats("mp3", "ogg");

  correctSound = loadSound("assets/Move.mp3");
  wrongSound = loadSound("assets/Error.mp3");
  timeUpSound = loadSound("assets/energy3.mp3");

  font = loadFont("assets/Roboto-Light.ttf");
}

function windowResized() {
  R = floor(min(window.innerWidth / 22, window.innerHeight / 34));
  D = 2 * R;
  sizes = [R, R, R, R];
  resizeCanvas(D * 11 - 1, D * 17 - 1);
}

function setup() {
  cnv = createCanvas(0, 0);
  cnv.mousePressed(clickHandler);
  windowResized();
  textAlign(CENTER, CENTER);
  textFont(font);
  boards = shuffle(allBoards);
  board = boards.pop();

  points = 0;

  highscore = getItem("statusGameHighscore") || 0;

  timerRunning = false;
  timer = startTime;

  particles = [];
}

function draw() {
  background("white");

  if (timerRunning) {
    timer -= deltaTime;
    if (timer < 0) {
      timeUpSound.play();
      timer = 0;
      timerRunning = false;

      if (points > highscore) {
        storeItem("statusGameHighscore", points);
      }
    }
  }

  fill("black");

  textSize(0.6 * R);
  text("Time", width / 6, 2.7 * R);
  text("Score", (3 * width) / 6, 2.7 * R);
  text("Best", (5 * width) / 6, 2.7 * R);

  textSize(D);
  text((0.001 * timer).toFixed(1), width / 6, 2 * D);
  text(points, (3 * width) / 6, 2 * D);
  text(highscore, (5 * width) / 6, 2 * D);

  translate(0, 3 * D);
  board.draw();
  if (timer == 0) {
    noStroke();
    fill(255, 255, 255, 200);
    rect(0, -1, 11 * D, 11 * D + 1);
    fill("black");
    textSize(D);
    text("Game over", 11 * R, 10.8 * R);
  }
  translate(0, D * 12 - 1);

  for (let i in sizes) {
    sizes[i] -= 2;
    if (sizes[i] < R) sizes[i] = R;
  }

  fill("black");

  translate(width / 6, 0);
  push();
  textSize(sizes[1]);
  text("Dead", 0, 0);
  translate(width / 3, 0);
  textSize(sizes[3]);
  text("Unsettled", 0, 0);
  translate(width / 3, 0);
  textSize(sizes[2]);
  text("Alive", 0, 0);

  pop();

  textSize(R);

  for (let p of particles) {
    fill(p.c);
    text(p.s, p.x, p.y);
    p.y++;
  }

  particles = particles.filter((p) => p.y < 500);
}

function submit(status) {
  if (timer == 0) return;

  sizes[status] = 0.8 * D;
  let x = [0, 0, (2 * width) / 3, width / 3][status];
  if (status == board.status) {
    if (timer == startTime) {
      timerRunning = true;
    }
    correctSound.play();
    points += 1;
    let p = new Particle("lime", "+1", x, R);
    particles.push(p);
    if (!boards.length) {
      boards = shuffle(allBoards);
    }
    board = boards.pop();
  } else {
    wrongSound.play();
    points -= 1;
    if (points < 0) points = 0;
    let p = new Particle("red", "-1", x, R);
    particles.push(p);
  }
}

function clickHandler() {
  if (mouseY < 14 * D && timer == 0) {
    setup();
  }
  if (mouseY > 14 * D) {
    if (mouseX < width / 3) {
      submit(1);
    } else if (mouseX < (2 * width) / 3) {
      submit(3);
    } else {
      submit(2);
    }
  }
}

function keyPressed() {
  if (key == "ArrowLeft") {
    submit(1);
  } else if (key == "ArrowDown" || key == "ArrowUp") {
    submit(3);
  } else if (key == "ArrowRight") {
    submit(2);
  } else if (key == "Enter") {
    setup();
  }
}
