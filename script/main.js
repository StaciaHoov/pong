(function() {  
    var canvas = document.getElementById("pongTable"); //DOM node in html
    var context = canvas.getContext("2d"); //object with methods & properties used to render graphics in canvas element.
    context.fillStyle = "blue";
    context.fillRect(300,300,600,400);
    
    var player = new Player();
    var computer = new Computer();
    var ball = new Ball(500, 500);
    
    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {window.setTimeout(callback, 1000/60)};
   
    var render = function() {
        player.render();
        computer.render();
        ball.render();
    };
    
    var update = function() {
        player.update();
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
       this.speed = 0;
    };

    function Player() {
       this.paddle =  new Paddle(850, 465, 10, 70);
    };
    
    function Computer() {
        this.paddle = new Paddle(350, 465, 10, 70);
    };
    
    function Ball(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = 7;
        this.x_speed = 0;
        this.y_speed = 0;
    };
   
    Ball.prototype.render = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); //arc (x,y, radius, startAngle, anticlockwise?)
        context.fillStyle = 'yellow';
        context.fill();
        context.lineWidth =2;
        context.strokeStyle = '#003300';
        context.stroke();
    };
    
    Paddle.prototype.move = function(x, y) {
        this.x += x;
        this.y += y;
        this.speed += y
        if(this.y < 300) {
            this.y = 300;
            this.speed = 0;
        } else if ((this.y + this.height) > 700) {
            this.y = 700 - this.height;
            this.speed = 0;
        };
        console.log(this.x,this.y)
    };
    
    Paddle.prototype.render = function() {
        context.beginPath();
        context.fillStyle = "purple";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.lineWidth = 7;
        context.strokeStyle = 'black';
        context.stroke();
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
        
    Computer.prototype.render = function() {
        this.paddle.render();
    };
    
    
    var keysDown = {};

    window.addEventListener("keydown", function(event) {
       keysDown[event.keyCode] = true;
    });
    
    window.addEventListener("keyup", function(event) {
        delete keysDown[event.keyCode];
    });
    
    window.onload = step();
    
})(); 