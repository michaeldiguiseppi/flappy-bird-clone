// create our 'main' state that will contain the game
var mainState = {
  preload: function() {
    // executed at the beginning
    // load images and sounds here
    game.load.image('bird', 'assets/frame-2.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.image('pipe-top', 'assets/pipe-top.png');
  },
  create: function() {
    // called after the preload function
    // set up the game, display sprites, etc.
    // if this is not a desktop (so it's a mobile device)
    if (game.device.desktop == false) {
      // set the scaling mode to SHOW_ALL to show all the game
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      // set a minimum and maximum size for the game
      // here the minimum is half the game size
      // and the maximum is the original game size
      game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);

    }

    // center the game horizontally and vertically
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    // change the background color of the game to blue.
    game.stage.backgroundColor = '#71c5cf';

    // set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // display the bird at the position x=100 and y=245.
    this.bird = game.add.sprite(100, 245, 'bird');
    this.bird.width = 50;
    this.bird.height = 50;

    // add physics to the bird
    // needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.bird);

    // add gravity to the bird to make it fall
    this.bird.body.gravity.y = 1000;

    // call the 'jump' function when the spacebar is hit.
    var spaceKey = game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR
    );
    spaceKey.onDown.add(this.jump, this);
    // call the jump function when we tap/click the screen
    game.input.onDown.add(this.jump, this);
    // create an empty group
    this.pipes = game.add.group();
    // add new row of pipes every 1.5 seconds
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    // add score
    this.score = -1;
    this.labelScore = game.add.text(20, 20, "0",
      { font: "30px Arial", fill: "#ffffff"});

    // move the anchor point to the left and downward
    this.bird.anchor.setTo(-0.2, 0.5);
  },
  update: function() {
    // this function is called 60 times per second
    // it contains the game's logic.
    // if the bird is out of the screen (too high or too low)
    // call the 'restartGame' function
    if (this.bird.y < 0 || this.bird.y > 490) {
      this.restartGame();
    }
    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

    if (this.bird.angle < 20) {
      this.bird.angle += 1;
    }
  },
  // make the bird jump
  jump: function() {
    // check if bird is dead first
    if (this.bird.alive == false) {
      return;
    }
    // add a vertical velocity to the bird.
    this.bird.body.velocity.y = -350;
    // create an animation on the bird
    var animation = game.add.tween(this.bird);
    // change the angle of the bird to -20 degrees in 100 milliseconds
    animation.to({angle: -20}, 100);

    // start the animation
    animation.start();

  },

  // restart the game
  restartGame: function() {
    // start the 'main' state, which restarts the game.
    game.state.start('main');
  },
  addOnePipe: function(x, y) {
    // create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    // add the pipe to our previously created group
    this.pipes.add(pipe);


    // enable physics on the pipe
    game.physics.arcade.enable(pipe);

    // add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200;


    // automatically kill the pipe when it's no longer visible.
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;

  },
  addPipeTop: function(x, y) {

    var pipeTop = game.add.sprite(x, y, 'pipe-top');

    this.pipes.add(pipeTop);

    game.physics.arcade.enable(pipeTop);

    pipeTop.body.velocity.x = -200;
    var topPipe = pipeTop.body.rotate.x = 180;

    pipeTop.checkWorldBounds = true;
    pipeTop.outOfBoundsKill = true;
  },
  addPipeBottom: function(x, y) {

    var pipeBottom = game.add.sprite(x, y, 'pipe-top');

    this.pipes.add(pipeBottom);

    game.physics.arcade.enable(pipeBottom);

    pipeBottom.body.velocity.x = -200;

    pipeBottom.checkWorldBounds = true;
    pipeBottom.outOfBoundsKill = true;
  },
  addRowOfPipes: function() {
    // randomly pick a number between 1 and 5
    // this will be the hold position
    var hole = Math.floor(Math.random() * 5) + 1;

    // increase score by 1 each time new pipes are created
    this.score += 1;
    this.labelScore.text = this.score;
    // add the 6 pipes
    // with one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        if (i == hole - 1) {
          this.addPipeTop(400, i * 60 + 10);
        } else if (i == hole + 2) {
          this.addPipeBottom(400, i * 60 + 10);
        } else {
          this.addOnePipe(400, i * 60 + 10);
        }
      }
    }
  },
  hitPipe: function() {
    // if the bird has already hit a pipe, do nothing.
    // it means the bird is already falling off the screen
    if (this.bird.alive == false) {
      return;
    }
    // set the alive property of the bird to false
    this.bird.alive = false;
    // prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // go through the pipes and stop their movement.
    this.pipes.forEach(function(pipe) {
      pipe.body.velocity.x = 0;
    }, this);
  }
};





// initialize phaser and create a 400px by 490px game
var game = new Phaser.Game(400, 490, 'gameArea');

// add and start the 'main' state to start the game
game.state.add('main', mainState, true);
