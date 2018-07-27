(function(){
  
  //Main game script. Object oriented where appropriate. 
  
//Boundary checking constants
R_BOUND = document.width || document.body.clientWidth;
L_BOUND = 0;
TOP_BOUND = 0;
BOTTOM_BOUND = document.height || document.body.clientHeight;
RIGHT = 0;
LEFT = 1;

//Counter Variables
var assetsLoaded = 0; //triggers first call to update.
var callsToUpdate = 0;//used to synch animations and stuff.
var lastCallsToUpdate = 0; //same as above.
var clicks = 0; //For counting mouse clicks in level one.
var numOfBullets = 0;

//Boolean access variables
var canChange = true; //used to provide one time access to lastCallsToUpdate.
var changeToLevelOne = false; //Makes the opening animation possible.
var canRender = false; //used to delay the call to render for non-sprite animations as in level one.
var buttonClicked = false; 
var hunchButtonDepressed = false;
var buttonDown = false; //used for automatic fire in level three.
var canMakeEnemy = true;

//Game states
var LOADING = 0;
var SPLASHSCREEN = 1;
var POEM = 2;
var LEVELONE = 3;
var LEVELTWO = 4;
var LEVELTHREE = 5;
var END = 6; 
var gameState = LOADING; //default is loading.

//Player Variables.
var playerLife = 100; 

//Mouse variables
mouseX = 0;
mouseY = 0;

  
//Canvas. With fullscreen support? From Pro Android Web Game Apps.   
function initFullScreenCanvas(canvasId) {
  var canvas = document.getElementById(canvasId);
  resizeCanvas(canvas);
  window.addEventListener("resize", function() {
    resizeCanvas(canvas);
  });
  return canvas; 
}  

function resizeCanvas(canvas){
  canvas.width = document.width || document.body.clientWidth;
  canvas.height = document.height || document.body.clientHeight;
  resizeSprites(canvas); 
}
  
var canvas = initFullScreenCanvas("canvas");
canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);
 
//Create the drawing surface
var drawingSurface = canvas.getContext("2d");

//Arrays to store the game objects and assets to load
var splashScreenSprites = [];
var poemSprites = [];
var levelOneSprites = [];
var levelTwoSprites = [];
var levelThreeSprites = [];
var bullets = [];
var enemies = [];
//TODO add other mode sprite arrays.

var assetsToLoad = [];

//Create the camera object.
var aCamera = Object.create(camera);

//Create all the sprites. Remember to consider drawing order.
  //splashScreen mode sprites
var splashScreenBackground = Object.create(spriteObject);
splashScreenBackground.width = document.width || document.body.clientWidth;
splashScreenBackground.height = document.height || document.body.clientHeight;
splashScreenSprites.push(splashScreenBackground);

var turret = Object.create(spriteObject);
turret.width = 150;
turret.height = 133;
turret.vx = 1;
turret.vy = 1;
turret.vRot = 1;
turret.rotation = 1;
splashScreenSprites.push(turret);

var title = Object.create(spriteObject);
title.width = 600;
title.height = 100;
title.x = 10;
title.y = 110;
splashScreenSprites.push(title);

var playButton = Object.create(spriteObject);
playButton.width = 100;
playButton.height = 50;
playButton.x = 360;
playButton.y = 210;
splashScreenSprites.push(playButton);

var poemButton = Object.create(spriteObject);
poemButton.width = 100;
poemButton.height = 50;
poemButton.x = 360;
poemButton.y = 260;
splashScreenSprites.push(poemButton);

  //Poem mode sprites.
var poem = Object.create(spriteObject);
poem.width = 620;
poem.height = 480;
poemSprites.push(poem);

var backButton = Object.create(spriteObject);
backButton.width = 100;
backButton.height = 50;
backButton.x = 360;
backButton.y = 210;
poemSprites.push(backButton);

  //level one sprites. 
var fallButton = Object.create(spriteObject);
fallButton.width = 100;
fallButton.height = 50;
fallButton.x = 360;
fallButton.y = 210;
levelOneSprites.push(fallButton);

  //level two sprites.
var lvl2BG = Object.create(spriteObject);
lvl2BG.width = R_BOUND;
lvl2BG.height = BOTTOM_BOUND;
levelTwoSprites.push(lvl2BG);


var turretGunner = Object.create(spriteObject);
turretGunner.width = 255;
turretGunner.height = 255;
turretGunner.x = 0;
turretGunner.y = 0;
turretGunner.vx = 1;
turretGunner.vy = 1;
turretGunner.vRot = 1;
levelTwoSprites.push(turretGunner);

var hunchButton = Object.create(spriteObject);
hunchButton.width = 100;
hunchButton.height = 50;
hunchButton.x = 360;
hunchButton.y = 210;
levelTwoSprites.push(hunchButton);

  //level 3 sprites
var lvl3Background = Object.create(spriteObject);
lvl3Background.sourceWidth = 1240;
lvl3Background.sourceHeight = 960;
lvl3Background.width = 2480;
lvl3Background.height = 1920;
lvl3Background.x = 0;
lvl3Background.y = 0;
levelThreeSprites.push(lvl3Background);

var muzzleFlash = Object.create(spriteObject);
muzzleFlash.width = 620;
muzzleFlash.height = 480;
muzzleFlash.visible = false;
levelThreeSprites.push (muzzleFlash);

function makeBullet(direction)
{
  if (direction === RIGHT)
  {
    //numOfBullets++;
    var rightBullet = Object.create(spriteObject);
    rightBullet.x = 433;
    rightBullet.y = 225;
    rightBullet.width = 12;
    rightBullet.height = 7;
    rightBullet.vx = -10;
    rightBullet.vy = 1;
    rightBullet.visible = true;
    rightBullet.image = rightBulletImg;
    rightBullet.dir = RIGHT;
    bullets.push(rightBullet);
    levelThreeSprites.splice(levelThreeSprites.length - 1, 0, rightBullet);
  }
  if (direction === LEFT)
  {
    //numOfBullets++;
    var leftBullet = Object.create(spriteObject);
    leftBullet.x = 203; 
    leftBullet.y = 225; 
    leftBullet.width = 12;
    leftBullet.height = 7;
    leftBullet.vx = 10;
    leftBullet.vy = 1;
    leftBullet.visible = true;
    leftBullet.image = leftBulletImg;
    leftBullet.dir = LEFT;
    bullets.push(leftBullet);
    levelThreeSprites.splice(levelThreeSprites.length - 1, 0, leftBullet);
  }
  
}

function makeEnemy()
{
  var enemy = Object.create(spriteObject);
  enemy.name = "enemy";
  console.log("Enemy Made");
  enemy.sourceWidth =  317;
  enemy.sourceHeight = 121;
  enemy.width = 317;
  enemy.height = 121;
  enemy.x = 154 - 30;
  enemy.y = 174 - 30;
  enemy.vx = 1;
  enemy.vy = 1;
  enemy.life = 100;
  enemy.image = planeRightImg;
  enemies.push(enemy);
  levelThreeSprites.splice(levelThreeSprites.length - 1, 0, enemy);
}


var reticle = Object.create(spriteObject);
reticle.width = 620;
reticle.height = 480;
levelThreeSprites.push(reticle);
  
function resizeSprites(canvas){ //hopefully will resize every sprite based on the percentage of difference in the resize. 
  var Hpercentage = Math.abs((480.0 - canvas.height)/100.0);
  var Wpercentage = Math.abs((620.0 - canvas.width)/100.0); 
  for (var i = 0; i === splashScreenSprites.length(); i++)
     {
        splashScreenSprites[i].height *= Hpercentage;
        splashScreenSprites[i].width *= Wpercentage; 
     }
}

//used to reset all default values for playing again. 
function reset()
{
  //reset
  canChange = true; //used to provide one time access to lastCallsToUpdate.
  changeToLevelOne = false; //Makes the opening animation possible.
  canRender = false; //used to delay the call to render for non-sprite animations as in level one.
  buttonClicked = false; 
  hunchButtonDepressed = false;
  buttonDown = false; //used for automatic fire in level three.
  canMakeEnemy = true;
  playerLife = 100;
  turret.vx = 1;
  turret.vy = 1;
  turret.vRot = 1;
  turret.rotation = 1;
  turretGunner.x = 0;
  turretGunner.y = 0;
  turretGunner.vx = 1;
  turretGunner.vy = 1;
  turretGunner.vRot = 1;
  turretGunner.image = turretGunnerImg;
  enemies = [];
  muzzleFlash.visible = false;
  clicks = 0; 
  
}

  //fill othermode sprite arrays...

//Load the image assets. TODO consider a sprite sheet for each mode or level. 
var ssBackgroundImage = new Image();
ssBackgroundImage.addEventListener("load", loadHandler, false);
ssBackgroundImage.src = "Images/background.jpg" //TODO change to PNG.
assetsToLoad.push(ssBackgroundImage);
splashScreenBackground.image = ssBackgroundImage;

var turretImage = new Image();
turretImage.addEventListener("load", loadHandler, false);
turretImage.src = "Images/turret.png";
assetsToLoad.push(turretImage);
turret.image = turretImage;

var titleImage = new Image();
titleImage.addEventListener("load", loadHandler, false);
titleImage.src = "Images/title.png";
assetsToLoad.push(titleImage);
title.image = titleImage;

var plyBtnImg = new Image();
plyBtnImg.addEventListener("load", loadHandler, false);
plyBtnImg.src = "Images/playButton.png";
assetsToLoad.push(plyBtnImg);
playButton.image = plyBtnImg;

var pmBtnImg = new Image();
pmBtnImg.addEventListener("load", loadHandler, false);
pmBtnImg.src = "Images/poemButton.png";
assetsToLoad.push(pmBtnImg);
poemButton.image = pmBtnImg;

var btnPshdPlyImg = new Image();
btnPshdPlyImg.addEventListener("load", loadHandler, false);
btnPshdPlyImg.src = "Images/depPlayButton.png";
assetsToLoad.push(btnPshdPlyImg);

var btnPshdPmImg = new Image();
btnPshdPmImg.addEventListener("load", loadHandler, false);
btnPshdPmImg.src = "Images/depPoemButton.png";
assetsToLoad.push(btnPshdPmImg);

var poemImage = new Image();
poemImage.addEventListener("load", loadHandler, false);
poemImage.src = "Images/poem.png";
assetsToLoad.push(poemImage);
poem.image = poemImage;

var backBtnImg = new Image();
backBtnImg.addEventListener("load", loadHandler, false);
backBtnImg.src = "Images/backButton.png";
assetsToLoad.push(backBtnImg);
backButton.image = backBtnImg;

var btnPshdBckImg = new Image();
btnPshdBckImg.addEventListener("load", loadHandler, false);
btnPshdBckImg.src = "Images/depBackButton.png";
assetsToLoad.push(btnPshdBckImg);

var fallBtnImg = new Image();
fallBtnImg.addEventListener("load", loadHandler, false);
fallBtnImg.src = "Images/fallButton.png";
assetsToLoad.push(fallBtnImg);
fallButton.image = fallBtnImg;

var btnPshdFlImg = new Image();
btnPshdFlImg.addEventListener("load", loadHandler, false);
btnPshdFlImg.src = "Images/depFallButton.png";
assetsToLoad.push(btnPshdFlImg);

var lvl2BGImg = new Image();
lvl2BGImg.addEventListener("load", loadHandler, false);
lvl2BGImg.src = "Images/lvl2BG.png"
assetsToLoad.push(lvl2BGImg);
lvl2BG.image = lvl2BGImg;

var turretGunnerImg = new Image();
turretGunnerImg.addEventListener("load", loadHandler, false);
turretGunnerImg.src = "Images/turretResized.png";
assetsToLoad.push(turretGunnerImg);
turretGunner.image = turretGunnerImg;

var fetusImg = new Image();
fetusImg.addEventListener("load", loadHandler, false);
fetusImg.src = "Images/womb.png";
assetsToLoad.push(fetusImg);

var dogFetusImg = new Image();
dogFetusImg.addEventListener("load", loadHandler, false);
dogFetusImg.src = "Images/animalWomb.jpg";
assetsToLoad.push(dogFetusImg);

var hunchButtonImg = new Image();
hunchButtonImg.addEventListener("load", loadHandler, false);
hunchButtonImg.src = "Images/hunchButton.png";
assetsToLoad.push(hunchButtonImg);
hunchButton.image = hunchButtonImg;

var depHunchButtonImg = new Image();
depHunchButtonImg.addEventListener("load", loadHandler, false);
depHunchButtonImg.src = "Images/depHunchButton.png";
assetsToLoad.push(depHunchButtonImg);

var lvl3BackgroundImg = new Image();
lvl3BackgroundImg.addEventListener("load", loadHandler, false);
lvl3BackgroundImg.src = "Images/mainBackground.png";
assetsToLoad.push(lvl3BackgroundImg);
lvl3Background.image = lvl3BackgroundImg;

var reticleImg = new Image();
reticleImg.addEventListener("load", loadHandler, false);
reticleImg.src = "Images/innerTurret.png";
assetsToLoad.push(reticleImg);
reticle.image = reticleImg;

var muzzleFlashImg = new Image();
muzzleFlashImg.addEventListener("load", loadHandler, false);
muzzleFlashImg.src = "Images/muzzleFlash.png";
assetsToLoad.push(muzzleFlashImg);
muzzleFlash.image = muzzleFlashImg;

var leftBulletImg = new Image();
leftBulletImg.addEventListener("load", loadHandler, false);
leftBulletImg.src = "Images/leftBullet.png";
assetsToLoad.push(leftBulletImg);

var rightBulletImg = new Image();
rightBulletImg.addEventListener("load", loadHandler, false);
rightBulletImg.src = "Images/rightBullet.png";
assetsToLoad.push(rightBulletImg);

var planeRightImg = new Image();
planeRightImg.addEventListener("load", loadHandler, false);
planeRightImg.src = "Images/planeRight.png";
assetsToLoad.push(planeRightImg);

var nightmareFighter1 = new Image();
nightmareFighter1.addEventListener("load", loadHandler, false);
nightmareFighter1.src = "Images/nightmareFighter1.png";
assetsToLoad.push(nightmareFighter1);

var nightmareFighter2 = new Image();
nightmareFighter2.addEventListener("load", loadHandler, false);
nightmareFighter2.src = "Images/nightmareFighter2.png";
assetsToLoad.push(nightmareFighter1);

var nightmareFighter3 = new Image();
nightmareFighter3.addEventListener("load", loadHandler, false);
nightmareFighter3.src = "Images/nightmareFighter3.png";
assetsToLoad.push(nightmareFighter3);





//Start the game animation loop
update();

function update() //called by browser, synched with screen refresh rate 30-60fps. HTML5 required. 
{
   //The animation loop
   callsToUpdate++;//so we can implement our own rough timer system. 
   requestAnimationFrame(update, canvas);
   
   //Change what the game is doing based on the game state
   switch(gameState)
  {
    case LOADING:
      console.log("Loading...");
      break;
    
    case SPLASHSCREEN:
      playSplashScreen();
      render(splashScreenSprites);
      break;
    
    case POEM:
      render(poemSprites);
      break;
    
    case LEVELONE:
      playLevelOne();
      if (canRender === true)
      {
        render(levelOneSprites);
      }
      break;
    
    case LEVELTWO:
      playLevelTwo();
      render(levelTwoSprites);
      break;
    
    case LEVELTHREE:
      playLevelThree();
      render(levelThreeSprites);
      break;
    
    case END:
      playEnd();
      break; 
  }
}

//event handlers. 

function loadHandler()
{
  console.log("asset loaded");
  assetsLoaded++;
  if(assetsLoaded === assetsToLoad.length)
  {
     //Remove the load event listener from every image in assets to load
     for (var i = 0; i === assetsToLoad.length; i++)
     {
        assetsToLoad[i].removeEventListener("load", loadHandler, false);
     }

     //Start the game
     gameState = SPLASHSCREEN;
  }
}

function mouseMoveHandler(event)
{
  mouseX = event.pageX - canvas.offsetLeft;
  mouseY = event.pageY - canvas.offsetTop;
}

function mouseDownHandler(event)
{
  switch (gameState)
  {
    case SPLASHSCREEN: //if the mouse is within the bounds of the play button, push the button. 
      if (mouseX >= playButton.x)
      {
        if (mouseX <= playButton.x + playButton.width)
        {
          if (mouseY >= playButton.y)
          {
            if (mouseY <= playButton.y + playButton.height)
            {
              playButton.image = btnPshdPlyImg;
            }
          }
        }
      }
      
      if (mouseX >= poemButton.x)
      {
        if (mouseX <= poemButton.x + poemButton.width)
        {
          if (mouseY >= poemButton.y)
          {
            if (mouseY <= poemButton.y + poemButton.height)
            {
              poemButton.image = btnPshdPmImg;
            }
          }
        }
      }
      
      break;
    
    case POEM:
      if (mouseX >= backButton.x)
      {
        if (mouseX <= backButton.x + backButton.width)
        {
          if (mouseY >= backButton.y)
          {
            if (mouseY <= backButton.y + backButton.height)
            {
              backButton.image = btnPshdBckImg;
            }
          }
        }
      }
      break;
    
    case LEVELONE:
      if (canRender === true)
      {
        if (mouseX >= fallButton.x)
        {
          if (mouseX <= fallButton.x + fallButton.width)
          {
            if (mouseY >= fallButton.y)
            {
              if (mouseY <= fallButton.y + fallButton.height)
              {
                fallButton.image = btnPshdFlImg;
              }
            }
          }
        }
      }
      break;
    
    case LEVELTWO:
      if (mouseX >= hunchButton.x)
      {
        if (mouseX <= hunchButton.x + hunchButton.width)
        {
          if (mouseY >= hunchButton.y)
          {
            if (mouseY <= hunchButton.y + hunchButton.height)
            {
              hunchButton.image = depHunchButtonImg;
              hunchButtonDepressed = true; 
            }
          }
        }
      }
      break;
    
    case LEVELTHREE:
      buttonDown = true;
  }
}

function mouseUpHandler()
{
  switch(gameState)
  {
    case SPLASHSCREEN:
      if (playButton.image === btnPshdPlyImg)//button is pushed.
      {
        playButton.image = plyBtnImg;
        turret.vRot = 20;
        turret.vx = 0;
        turret.vy = 0;
        changeToLevelOne = true;
      }
      
      if (poemButton.image === btnPshdPmImg)//button is pushed
      {
        poemButton.image = pmBtnImg;
        if (!changeToLevelOne)
        {
          gameState = POEM;
        }
      }
      break;
    
    case POEM:
      if (backButton.image === btnPshdBckImg)
      {
        backButton.image = backBtnImg;
        gameState = SPLASHSCREEN;
      }
      break;
    
    case LEVELONE:
      clicks++;
      console.log("Playing sloshing sound.")
      if (clicks === 3)
      {
        canRender = true;
      }
      
      if (canRender === true)
      {
        if (fallButton.image === btnPshdFlImg)
        {
          fallButton.image = fallBtnImg;
          canRender = false;
          buttonClicked = true; 
        }
      }
      break;
    
    case LEVELTWO:
      clicks++;
      if (hunchButton.image === depHunchButtonImg)
      {
        hunchButton.image = hunchButtonImg;
        hunchButtonDepressed = false;
        buttonClicked = true; 
      }
      break;
    
    case LEVELTHREE:
      clicks++;
      buttonDown = false;
      muzzleFlash.visible = false;
      break;
  }

}

//Gameplay Functions

function playSplashScreen()
{
  if (turret.x + turret.width >= R_BOUND)
  {
    turret.vx = -turret.vx;
  }
  else if (turret.x < L_BOUND)
  {
    turret.vx = -turret.vx;
  }
  else if (turret.y + turret.height > BOTTOM_BOUND)
  {
    turret.vy = -turret.vy;
  }
  else if (turret.y < TOP_BOUND)
  {
    turret.vy = -turret.vy;
  }
            
  turret.x = turret.x + turret.vx;
  turret.y = turret.y + turret.vy;
  turret.rotation += turret.vRot;
  
  if (changeToLevelOne === true)
  {
    if (canChange === true)
    {
      lastCallsToUpdate = callsToUpdate;
      canChange = false;
    }
  }
  
  if (changeToLevelOne === true)
  {
    if (callsToUpdate - lastCallsToUpdate >= 100)
    {
      turret.visible = false;
    }
    
    if (callsToUpdate - lastCallsToUpdate >= 150)
    {
      gameState = LEVELONE;
      canChange = true; 
    }
  }
}

function playLevelOne()
{
  console.log("Playing womb sounds.");
  
  if (canRender === false)//Don't draw sprites right now. 
  {
    drawingSurface.clearRect(0,0,canvas.width, canvas.height);//fill the screen with black. 
  }
  
  if (clicks > 3)//Player has solved the puzzle.
  {
    if (buttonClicked)
    {
      canRender = false; //don't draw sprites right now.
    }
     
  }
  
  if (buttonClicked)//Change this to a function that polls an array of events? 
  {
    if (canChange) {
      lastCallsToUpdate = callsToUpdate;
      canChange = false;
    }
    var radius = callsToUpdate - lastCallsToUpdate;
    if (radius <= canvas.height)
    {
      renderCircle(canvas.width / 2, canvas.height / 2, radius,  "white");
    }
    else
    {
      gameState = LEVELTWO;
      //reset game variables.
      canChange = true;
      buttonClicked = false;
      clicks = 0;
    }
  }
}

function playLevelTwo()
{
  console.log("level two. Playing cold wind sound.");
  canRender = true;
  if (turretGunner.x + turretGunner.width >= R_BOUND)
  {
    turretGunner.vx = -turretGunner.vx;
  }
  else if (turretGunner.x < L_BOUND)
  {
    turretGunner.vx = -turretGunner.vx;
  }
  else if (turretGunner.y + turretGunner.height > BOTTOM_BOUND)
  {
    turretGunner.vy = -turretGunner.vy;
  }
  else if (turretGunner.y < TOP_BOUND)
  {
    turretGunner.vy = -turretGunner.vy;
  }
            
  turretGunner.x = turretGunner.x + turretGunner.vx;
  turretGunner.y = turretGunner.y + turretGunner.vy;
  turretGunner.rotation += turretGunner.vRot;
  
  if (hunchButtonDepressed === true)
  {
    switch (turretGunner.image)
    {
      case  turretGunnerImg:
        turretGunner.image = fetusImg;
        break;
    
      case fetusImg:
        turretGunner.image = dogFetusImg;
        break;
    
      case dogFetusImg:
        turretGunner.image = turretGunnerImg;
        break;
    }
  }
  
  if (buttonClicked)
  {
    if (clicks > 3)
    {
      buttonClicked = false;
      canChange = true;
      clicks = 0;
      gameState = LEVELTHREE;
    }
  }
}

function playLevelThree()
{
  if (playerLife <= 0) //end the game if we have reached zero life
  {
    gameState = END;
  }
  
  if (canMakeEnemy)
  {
    makeEnemy();
    canMakeEnemy = false;
  }
  if (buttonDown === true)//Firing!!
  {
    muzzleFlash.visible = true;
    if (canChange) {
      lastCallsToUpdate = callsToUpdate;//get a timer. 
      canChange = false;
    }
    var timeSinceShot = callsToUpdate - lastCallsToUpdate;
    if (timeSinceShot >= 15)//fire the cannon periodically 
    {
      muzzleFlash.visible = false;//This makes the flashing effect at the nose of the gun. 
      makeBullet(RIGHT); //Loose! 
      makeBullet(LEFT);
      canChange = true;
    }
  }
  
  for (var i = 0; i < enemies.length; i++) //check colissions kill enemies. 
  {
    for(var j = 0; j < bullets.length; j++)
    {
      if (j === (bullets.length - 1))//we only want the first bullet checked.
      {
        var collided = detectCollisions(enemies[i], bullets[j]);
        if (collided)
        {
          if (enemies[i].image === planeRightImg)
          {
            enemies[i].image = nightmareFighter1;
            playerLife -= 1; 
          }
          else if (enemies[i].image === nightmareFighter3) {
            enemies[i].image = nightmareFighter1;
            playerLife -= 1;
          }
          else if (enemies[i].image === nightmareFighter1)
          {
            enemies[i].image = nightmareFighter2;
            playerLife -= 2;
          }
          else if (enemies[i].image === nightmareFighter2)
          {
            enemies[i].image = nightmareFighter3;
            playerLife -= 3; 
          }
        }
      }
      
    }
  }
  
  if (mouseX >= aCamera.x -10 + aCamera.width)//Right Side
  {
    if (mouseX < aCamera.x + aCamera.width)//if we can scroll
    {
      for (var i = 0; i < enemies.length; i++)
      {
        enemies[i].vx = -1;
      }
      lvl3Background.x -= 2;//scroll
      if (Math.abs(lvl3Background.x) > lvl3BackgroundImg.width)
      {
        lvl3Background.x = 0;
      }
    }
  }
  else
  {
    for (var i = 0; i < enemies.length; i++)
    {
      enemies[i].vx = 1;
    }
  }
  
  if (mouseX < aCamera.x +10)//Left  
  {
    if (mouseX > aCamera.x)
    {
      lvl3Background.x += 2;
      if (lvl3Background.x > 0)
      {
        lvl3Background.x = -lvl3BackgroundImg.width;
        //change velocity of all enemy/bullet sprites.
      }
    } 
  }
  else
  {
    for (var i = 0; i < enemies.length; i++)
    {
      
    }
  }
  
  if (mouseY < aCamera.y + 10)//Go Up
  {
    if (mouseY > aCamera.y)
    {
      for (var i = 0; i < enemies.length; i++)
      {
        enemies[i].vy = 1;
      }
      lvl3Background.y += 2;
      if (lvl3Background.y > 0)
      {
        lvl3Background.y = -lvl3BackgroundImg.height;
      }
    }
  }
  else
  {
    for (var i = 0; i < enemies.length; i++)
      {
        enemies[i].vy = -1;
      }
  }
  
  if (mouseY > (aCamera.y + aCamera.height - 10))//Go Down
  {
    for (var i = 0; i < enemies.length; i++)
    {
      enemies[i].vy = -1;
    }
    lvl3Background.y -= 2;
    if (Math.abs(lvl3Background.y) > lvl3BackgroundImg.height)
    {
      lvl3Background.y = 0;
    }
  }
  else
  {
    for (var i = 0; i < enemies.length; i++)
      {
        enemies[i].vy = 1;
      }
  }
  
  
  for(var i = 0; i < bullets.length; i++)
  {
    if (bullets[i].visible === false)//remove invisible bullets and javascript will eat them.
    {
      bullets.splice[i-1, 1];
    }
      
    if (bullets[i].dir === LEFT) //past the center of the reticle means you don't exist, bullet. 
    {
      if (bullets[i].x >= 310)
      {
        bullets[i].visible = false;
      }
    }
      
    if (bullets[i].dir === RIGHT)
    {
      if (bullets[i].x <= 325)
      {
        bullets[i].visible = false;  
      }
    }
      
   bullets[i].x += bullets[i].vx;
   bullets[i].y += bullets[i].vy;
  }
  
  for(var i = 0; i < enemies.length; i++)
  {
    enemies[i].x += enemies[i].vx;
    enemies[i].y += enemies[i].vy;
    
    if (enemies[i].x  > R_BOUND)
    {
      enemies[i].visible = false;
      enemies.splice(i - 1, 1);
      canMakeEnemy = true;
    }
  }
}

function playEnd()
{
  if (canChange) {
      lastCallsToUpdate = callsToUpdate;
      canChange = false;
    }
    var radius = canvas.height - (callsToUpdate - lastCallsToUpdate); //circle fading in. 
    if (radius >= 0)
    {
      renderCircle(canvas.width / 2, canvas.height / 2, radius,  "blue");
    }
    else
    {
      endGame(); 
    }  
}

function endGame()
{
  reset();
  for (var i = 0; i <levelThreeSprites.length; i++)
  {
    if (levelThreeSprites[i].name === "enemy")
    {
      levelThreeSprites[i].visible = false; 
    }
  }
  for (var i = 0; i < splashScreenSprites.length; i++)
  {
    splashScreenSprites[i].visible = true; 
  } 
  gameState = SPLASHSCREEN;
}

//Thank you to the mysterious internet! DO NOT TOUCH THIS FUNCTION
function drawImageRot(img,x,y,width,height,deg,alpha)
{

  //Convert degrees to radian 
  var rad = deg * Math.PI / 180;

  //Set the origin to the center of the image
  drawingSurface.translate(x + width / 2, y + height / 2);

  //Rotate the canvas around the origin
  drawingSurface.rotate(rad);

  //draw the image
  drawingSurface.drawImage(img, width / 2 * (-1),height / 2 * (-1),width,height);
  
  //reset the canvas  
  drawingSurface.rotate(rad * ( -1 ) );
  drawingSurface.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}


function render(spritesIn)
{
  
  var sprites = spritesIn;
   
  //clear the screen
  drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
           
  //render those sprites!
  if (sprites.length != 0)
  {
    for (var i = 0; i < sprites.length; i++)
    {
      var sprite = sprites[i];
    
      if (sprite.visible === true)
      {
        if (sprite.rotation > 0)
        {
          drawImageRot(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height, sprite.rotation, sprite.alpha);
        }
        else if (sprite.image === lvl3BackgroundImg)
        {
          renderBackground(sprite.image, sprite.x, sprite.y);
        }
        else
        {
          drawingSurface.drawImage
          (
            sprite.image,
            sprite.x,
            sprite.y
          );
        }  
      }    
    }
  }  
}

function renderCircle(centerX, centerY, radius, color)
{
  drawingSurface.clearRect(0,0,canvas.width, canvas.height);
  drawingSurface.beginPath();
  drawingSurface.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  drawingSurface.stroke();
  drawingSurface.fillStyle = color;
  drawingSurface.fill();
}

function renderBackground(image, x, y)//for scrolling background
{
  drawingSurface.drawImage(image, x, y);
  drawingSurface.drawImage(image, image.width-Math.abs(x), y);
  drawingSurface.drawImage(image, x, image.height-Math.abs(y));
  drawingSurface.drawImage(image, image.width-Math.abs(x), image.height - Math.abs(y));
}

function detectCollisions(c1, c2)
{
  //Calculate the vector between the circles' center points
  var vx = c1.centerX() - c2.centerX();
  var vy = c1.centerY() - c2.centerY();

  //Find the distance between the circles by calculating
  //the vector's magnitude (how long the vector is)
  var magnitude = Math.sqrt(vx * vx + vy * vy);

  //Add together the circles' total radii
  var totalRadii = c1.halfWidth() + c2.halfWidth();

  //Set hit to true if the distance between the circles is
  //less than their totalRadii
  var hit = magnitude < totalRadii;

  return hit;
}



}());
