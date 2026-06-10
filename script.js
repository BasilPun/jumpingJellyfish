let gameScreen;
let screenWidth = 360;
let screenHeight = 640;
let context;

//jellyFish info
let jellyFishIMG;
let jwidth = 34;
let jheight = 24;

let spawnx = screenWidth / 8;
let spawny = screenHeight / 2;

let jellyFish = {
    x : spawnx,
    y : spawny,
    width : jwidth,
    height : jheight
}

//spikes
let spikes = []
let spikeWidth = 64
let spikeHeight = 512
let spikex = screenWidth
let spikey = 0

let topSpikeIMG;
let bottomSpikeIMG;

//game phys
let velocityX = -2;
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function() {
    const screen = document.querySelector('#gameScreen');
    screen.height = screenHeight;
    screen.width = screenWidth;
    context = screen.getContext("2d");
    //context.fillRect(jellyFish.x, jellyFish.y, jellyFish.width, jellyFish.height);
    jellyFishIMG = new Image();
    jellyFishIMG.src = "imgs/newJellyFish.png";
    jellyFishIMG.onload = function(){
        context.drawImage(jellyFishIMG, jellyFish.x, jellyFish.y, jellyFish.width, jellyFish.height);
    }

    topSpikeIMG = new Image();
    topSpikeIMG.src = "imgs/newTopSpike.png";

    bottomSpikeIMG = new Image();
    bottomSpikeIMG.src = "imgs/newBotSpike.png";

    setInterval(placeSpikes,1500); //every 1.5 sec place spikes


    requestAnimationFrame(update);

    document.addEventListener("keydown", moveJF);
    
}

//main game loop
function update(){
    requestAnimationFrame(update);
    if (gameOver === true){
        return;
    }
    context.clearRect(0, 0, screenWidth, screenHeight)

    //jellyFish
    velocityY = velocityY + gravity;

    if ((jellyFish.y + velocityY) >= 0){
        jellyFish.y = jellyFish.y + velocityY;
    }
    else{
        jellyFish.y = 0 //no jumping beyond top of the screen.
    }
    context.drawImage(jellyFishIMG, jellyFish.x, jellyFish.y, jellyFish.width, jellyFish.height);

    if (jellyFish.y > screenHeight){
        gameOver = true;
    }

    //spikes
    for(let i = 0; i < spikes.length; i ++){
        let spike = spikes[i];
        spike.x = spike.x + velocityX;
        context.drawImage(spike.img, spike.x, spike.y, spike.width, spike.height);

        //check if it passed the pipe succesfully
        if (spike.passed === false && jellyFish.x > spike.x + spike.width){
            score = score + 0.5; //2 pipes. 0.5 * 2 = 1
            spike.passed = true;
        }


        if (detectCollision(jellyFish, spike)){
            gameOver = true;
        }
    }

    //clear spikes that are off the screen
    while(spikes.length > 0 && spikes[0].x < -spikeWidth){
        spikes.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px pixel";
    context.fillText(score, 4, 55);

    if (gameOver){
        context.fillText("GAMEOVER", 4, 115);
    }

}

function placeSpikes() {

    //spike will be between 1/4 and 3/4 of spike height
    let randomy = spikey - spikeHeight/4 - Math.random()*(spikeHeight/2);

    let topSpike = {
        img: topSpikeIMG,
        x : spikex,
        y : randomy,
        width : spikeWidth,
        height : spikeHeight,
        passed : false
    }

    spikes.push(topSpike);

    let openingSpace = screenHeight/8 + 20;
    
    let bottomSpike = {
        img: bottomSpikeIMG,
        x : spikex,
        y : randomy + spikeHeight + openingSpace,
        width : spikeWidth,
        height : spikeHeight,
        passed : false
    }

    spikes.push(bottomSpike);
}

function moveJF(e){
    if (e.code == "Space"){
        //jump
        velocityY = -6
    }

    if (gameOver){
        jellyFish.y = spawny
        score = 0
        spikes = [];
        gameOver = false;
    }
}

function detectCollision(a, b){
    // all have to be satisfied to be a collision
    // will not all be true unless they are overlapping (colliding)
    return a.x < b.x + b.width &&
            a.x + a.width > b.x && 
            a.y < b.y + b.height && 
            a.y + a.height > b.y;


}