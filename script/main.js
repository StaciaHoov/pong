(function() {  
    var canvas = document.getElementById("pongTable"); //DOM node in html
    var context = canvas.getContext("2d"); //object with methods & properties used to render graphics in canvas element.
    
    var player = new Player();
    var computer = new Computer();
    var ball = new Ball(600, 500);
    var keysDown = {};
    
    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {window.setTimeout(callback, 1000/60)};
   
    var render = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#11B1FF";
        context.fillRect(300,300,600,400);
        player.render();
        computer.render();
        ball.render();
    };
    
    var update = function() {
        player.update();
        ball.update();
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
        if(this.y < 300) {
            this.y = 300;
            this.y_speed = 0;
        } else if (this.y + this.height > 700) {
            this.y = 700 - this.height;
            this.y_speed = 0;
        };
        console.log(this.x,this.y)
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

    function Player() {
       this.paddle =  new Paddle(850, 465, 10, 70);
    };
    
    Player.prototype.render = function() {
        this.paddle.render();
    };
        
    function Computer() {
        this.paddle = new Paddle(350, 465, 10, 70);
    };
    
    Computer.prototype.render = function() {
        this.paddle.render();
    };

    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 7;
        this.x_speed = Math.random()*2 ;
        this.y_speed = Math.random()*3 ;
    };
   
    Ball.prototype.render = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); //arc (x,y, radius, startAngle, anticlockwise?)
        context.fillStyle = 'yellow';
        context.fill();
    };
    
    Ball.prototype.update = function() {
        this.x += this.x_speed;
        this.y += this.y_speed;
        this.x_left = this.x - 3.5;
        this.x_right = this.x + 3.5;
        this.y_top = this.y - 3.5;
        this.y_bottom = this.y + 3.5;
        
        if (this.x < 300 || this.x > 900) {
            this.x = 600;
            this.y = 500;
            this.x_speed = 2;
            this.y_speed = 0;
        }
        
        if (this.y - 3.5 < 300) {
            this.y = 303.5;
            this.y_speed = -this.y_speed;
        } else if (this.y + 3.5 > 700) {
            this.y = 696.5;
            this.y_speed = - this.y_speed;
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