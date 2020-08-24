//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg,restartImg,gameOver,restart;
var checkpoint,jump,die;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage,cloudsGroup;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,obstaclesGroup;
var count = 0
function preload(){
 checkpoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3");
   die = loadSound("die.mp3");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide_trex",trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group ();
  obstaclesGroup = new Group ();
  
   gameOver = createSprite(300,100);
   restart = createSprite(300,140);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
restart.addImage(restartImg);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;
}

function draw() {
  background(180);
   //display score
  text("Score: "+ count, 500, 50);
  
  if(gameState === PLAY) {
    ground.velocityX = -6;
    count = count + Math.round(getFrameRate()/60);
  if(keyDown("space")&&trex.y>=159) {
    trex.velocityY = -12;
    jump.play();
  }
  if (count>0 && count%100 === 0){
      checkpoint.play();
    }
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
   //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
    die.play();
      gameState = END;
   
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collide_trex",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles();
  drawSprites();
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(650,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 700/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
 
function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameOver.visible=false;
  restart.visible=false;
  trex.changeAnimation("running", trex_running);
  count=0
} 
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(650,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
            break;
      case 2:obstacle.addImage(obstacle2);
            break;
      case 3:obstacle.addImage(obstacle3);
            break;
      case 4:obstacle.addImage(obstacle4);
            break;
      case 5:obstacle.addImage(obstacle5);
            break;
      case 6:obstacle.addImage(obstacle6);
            break;
    }
    //obstacle.setAnimation("obstacle" + rand);
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 150;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}