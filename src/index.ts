//types
import { CanvasView } from "./view/CanvasView";
import { Ball } from "./sprites/Ball";
import { Brick } from "./sprites/Brick";
import { Paddle } from "./sprites/Paddle";
import { Collision } from "./Collision";

//images
import PADDLE_IMAGE from "./images/paddle.png";
import BALL_IMAGE from "./images/ball.png";

//level and colors
import {
    PADDLE_SPEED,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_STARTX,
    BALL_SPEED,
    BALL_SIZE,
    BALL_STARTX,
    BALL_STARTY
} from "./setup";
// Helpers
import { createBricks } from "./helper";

let gameOver = false;
let score = 0;

function setGameOver(view: CanvasView): void {
    view.drawInfo('Game Over!');
    gameOver = false;
}

function setGameWin(view: CanvasView): void {
    view.drawInfo('Game Won!');
    gameOver = false;
}

function gameLoop(
    view: CanvasView,
    bricks: Brick[],
    paddle: Paddle,
    ball: Ball,
    collision: Collision
){
    view.clear();
    view.drawBricks(bricks);
    view.drawSprite(paddle);
    view.drawSprite(ball);

    // Move Ball
    ball.moveBall();

    collision.checkBallCollision(ball, paddle, view);
    var colliding = collision.isCollidingBricks(ball, bricks); 

    if(colliding)
    {
        score += 1;
        view.drawScore(score);
    }

    console.log("ball pos y : " + ball.pos.y + " > " + view.canvas.height + " = " + (ball.pos.y  > view.canvas.height))
    // Game Over when ball leaves playField
    if (ball.pos.y > view.canvas.height) gameOver = true;
    // If game won, set gameOver and display win
    if (bricks.length === 0) return setGameWin(view);
    // Return if gameover and don't run the requestAnimationFrame
    if (gameOver) return setGameOver(view); 

    // move paddle and check so it won't exit the playfield
    if(
        (paddle.isMovingLeft && paddle.pos.x > 0) || 
        (paddle.isMovingRight && paddle.pos.x < view.canvas.width - paddle.width)
    ){
        paddle.movePaddle();
    }

    requestAnimationFrame(() => gameLoop(view, bricks, paddle, ball, collision));
}

function startGame(view: CanvasView) {
    // reset display
    score = 0;
    view.drawInfo('');
    view.drawScore(0);
    // create a collision instance
    const collision = new Collision();

    // create all bricks
    const bricks = createBricks();

    // create a ball
    const ball = new Ball(
        BALL_SPEED,
        BALL_SIZE,
        {
            x: BALL_STARTX,
            y: BALL_STARTY
        },
        BALL_IMAGE
    )    

    // create a paddle
    const paddle = new Paddle(
        PADDLE_SPEED,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        {
            x: PADDLE_STARTX,
            y: view.canvas.height - PADDLE_HEIGHT - 5
        },
        PADDLE_IMAGE
    );

    gameLoop(view, bricks, paddle, ball, collision);
}

//Create a new view

const view = new CanvasView('#playField');
view.initStartButton(startGame);