(function() {  
    var canvas = document.getElementById("court-container"); //DOM node in html
    var context = canvas.getContext("2d"); //object with methods & properties used to render graphics in canvas element.
    var context_height = 400;
    var context_width = 600;
    var context_x = 325;
    var context_y = 75;
    var midcourt_x = context_x + context_width/2;
    var midcourt_y = context_y + context_height/2;
    var player = new Player();
    var computer = new Computer();
    var ball = new Ball(600, 300);
    var radius = 5;
    var keysDown = {};
    var computerScore = 0;
    var playerScore = 0;

    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {window.setTimeout(callback, 1000/60)};
   
    var render = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#11B1FF";
        context.fillRect(context_x, context_y, context_width, context_height);
        player.render();
        computer.render();
        ball.render();
    };
    
    var update = function() {
        computer.update(ball);
        player.update();
        ball.update(computer.paddle, player.paddle);
    }     
    
    var restart_game = function() {
        location.reload;
    }
        
    function step() { //
        update();
        render();
        animate(step);  //callback passed to animate will perform actions at each repaint
    };
    
    function Paddle(x, y, width, height) {
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height;
       this.x_speed = 0;
       this.y_speed = 0;
    };
    
    Paddle.prototype.render = function() {
        context.fillStyle = "purple";
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    
    Paddle.prototype.move = function(x, y) {
        this.x += x;
        this.y += y;
        this.x_speed += x;
        this.y_speed += y;
        if(this.y < context_y) {
            this.y = context_y;
            this.y_speed = 0;
        } else if (this.y + this.height > context_y + context_height) {
            this.y = context_y + context_height - this.height;
            this.y_speed = 0;
        };
    };
    

    function Player() {
       this.paddle =  new Paddle(865, 240, 10, 70);
    };
    
    Player.prototype.render = function() {
        this.paddle.render();
    };
      
    Player.prototype.update = function() {
        for (var key in keysDown) {
            var value = Number(key);
            if(value == 38) {              // up arrow
                this.paddle.move(0,-4);
            } else if (value == 40) {     //down arrow
                this.paddle.move(0,4);
            } else {
                this.paddle.move(0,0);
            }
        }
    };
    
    function Computer() {
        this.paddle = new Paddle(375, 240, 10, 70);
    };
    
    Computer.prototype.render = function() {
        this.paddle.render();
    };
    
    Computer.prototype.update = function(ball) {
        var diff = -((this.paddle.y + this.paddle.height/2) - ball.y);
        if (diff < 0 && diff < -4) {
            diff = -5;
        } else if (diff > 0 && diff > 4) {
            diff = 5;
        }
        this.paddle.move(0, diff);
        
        if (this.paddle.y < 0) {
            this.paddle.y = 0;
        } else if (this.paddle.y + this.paddle.height > 500) {
            this.paddle.y = 400 - this.paddle.height;
        }
    };

    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.x_speed = 2 + Math.random();
        this.y_speed = 1 + Math.random() ;
    };
   
    Ball.prototype.render = function() {
        context.beginPath();
        context.arc(this.x, this.y, radius, 0, 2 * Math.PI, false); //arc (x,y, radius, startAngle, anticlockwise?)
        context.fillStyle = 'yellow';
        context.fill();
    };
    
    Ball.prototype.update = function(paddle1, paddle2) {
        this.x += this.x_speed;
        this.y += this.y_speed;
 
        if (this.y - radius < context_y) { // hitting top wall
            this.y = context_y + radius;
            this.y_speed = - this.y_speed;
        } else if (this.y + radius > context_y + context_height) { // hitting bottom wall
            this.y = context_y + context_height - radius;
            this.y_speed = - this.y_speed;
        }
        
        if (this.x < context_x) {  // player scores
            this.x = midcourt_x;
            this.y = midcourt_y;
            this.x_speed = -2 + Math.random();
            this.y_speed = 1 + Math.random();
            playerScore ++;
            document.getElementById("playerScore").innerHTML = playerScore;
            
            if (playerScore >= 11) {
                document.getElementById("player-wins").style.display = "block";
                playerScore = 0;
                computerScore = 0;
                this.x_speed = 0;
                this.y_speed = 0;
                player.paddle.x = 865;
                player.paddle.y = 240;
                computer.paddle.x = 375;
                computer.paddle.y = 240;
                document.getElementById("playerScore").innerHTML = playerScore;
                document.getElementById("computerScore").innerHTML = playerScore;
            }
        }
        
        if (this.x > context_x + context_width) { // computer scores
            this.x = midcourt_x;
            this.y = midcourt_y;
            this.x_speed = 2 + Math.random();
            this.y_speed = 1 + Math.random();
            computerScore ++;
            document.getElementById("computerScore").innerHTML = computerScore;
            
            if (computerScore >= 11) {
                document.getElementById("computer-wins").style.display = "block";
                playerScore = 0;
                computerScore = 0;
                this.x_speed = 0;
                this.y_speed = 0;
                player.paddle.x = 865;
                player.paddle.y = 240;
                computer.paddle.x = 375;
                computer.paddle.y = 240;
                document.getElementById("playerScore").innerHTML = playerScore;
                document.getElementById("computerScore").innerHTML = playerScore;
            }
        }
        
         if (this.x - radius > midcourt_x) {
            if (this.x + radius > paddle2.x && (this.y + radius < paddle2.y + paddle2.height) && (this.y - radius > paddle2.y )) {  // hitting player paddle
                this.x_speed = - 3;
                this.y_speed = -2;
            }  
        } else {
            if (this.x - radius < (paddle1.x + paddle1.width)
                && (this.y - radius > paddle1.y)
                && (this.y + radius < paddle1.y + paddle1.height)) {
                    this.x_speed = 3;
                    this.y_speed = -1;
            }
        }
    };
    
    window.addEventListener("keydown", function(event) {
       keysDown[event.keyCode] = true;
    });
    
    window.addEventListener("keyup", function(event) {
        delete keysDown[event.keyCode];
    });
    
    window.onload = step();

    
})(); 