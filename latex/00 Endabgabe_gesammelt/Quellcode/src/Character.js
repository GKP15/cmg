'use strict';

Pucman.Character = function(game, key, node) {

    Phaser.Sprite.call(this, game, 100, 100, key, 0);
    this.anchor.set(0.5);
    this.position = node.position();
    this.node = node;
    this.lastNode = node;
    this.direction = Phaser.LEFT;
    this.debugCounter = 0;
    this.score = 0;
    this.lives = 3;
    this.invulnerable = false;
    this.stateGame = game.state.getCurrentState();

    this.animations.add('moving', [0, 1, 2, 1], 7, true, true);
    this.animations.add('flashing', [0, 3, 1, 3, 2, 3, 1, 3], 14, true, true);

    this.animations.play('moving');

};

Pucman.Character.prototype = Object.create(Phaser.Sprite.prototype);
Pucman.Character.constructor = Pucman.Character;

/**
 * updates the position and handles eating
 */
Pucman.Character.prototype.update = function() {

    this.move(this.getDir());
	this.rotate();
    this.eatDot();
};

/**
 * gets the direction from keyboard input
 * @return current direction
 */
Pucman.Character.prototype.getDir = function() {
    var pressedKey = null;
    if (this.stateGame.cursors.up.isDown) {
        pressedKey = Phaser.UP;
    }
    if (this.stateGame.cursors.right.isDown) {
        pressedKey = Phaser.RIGHT;
    }
    if (this.stateGame.cursors.down.isDown) {
        pressedKey = Phaser.DOWN;
    }
    if (this.stateGame.cursors.left.isDown) {
        pressedKey = Phaser.LEFT;
    }
    return pressedKey;
};

/**
 * moves pucman
 * @param the key which is pressed
 */
Pucman.Character.prototype.move = function(pressedKey) {
    var nextDir = 0;
    if (this.getNodeInDir(pressedKey) !== undefined) {
        nextDir = pressedKey;
    } else {
        var numCon = this.node.neighborhood('node[id]').length;
        switch (numCon) {
            case 2:
                for (var i = 1; i < 5; i++) {
                    if (this.getNodeInDir(i) !== undefined &&
                        !this.getNodeInDir(i).same(this.lastNode)) {
                        nextDir = i;
                    }
                }
                break;
            case 1:
            case 3:
            case 4:
                if (this.getNodeInDir(this.direction) !== undefined) {
                    nextDir = this.direction;
                }
                break;
        }
    }
    this.lastNode = this.node;
    if (nextDir !== 0) {
        this.node = this.getNodeInDir(nextDir);
        //rotate the sprite to the direction of the next node
        this.direction = nextDir;
        this.position = this.node.position();
    }
};

Pucman.Character.prototype.rotate = function() {
    this.rotation = Math.atan2(this.node.position().y - this.lastNode.position().y, this.node.position().x - this.lastNode.position().x);
}

/**
 * searches for the next node at given direction
 * @param direction
 * @return next node at this direction
 */
Pucman.Character.prototype.getNodeInDir = function(dir) {
    var nodeInDir;
    var neighbors = this.node.neighborhood('node[id]');
    for (var i = 0; i < neighbors.length; i++) {
        if (Pucman.Graph.dirAToB(this.node.position(),
                neighbors[i].position()) === dir) {
            nodeInDir = neighbors[i];
        }
    }
    return nodeInDir;
};

/**
 * pucman eats a dot and get points
 */
Pucman.Character.prototype.eatDot = function() {
    var dot = this.node.data('dot');
    if (dot !== undefined) {
        this.stateGame.dots.remove(dot);
        this.node.removeData();
        this.stateGame.score++;
        Pucman.Interface.eatDot(this.stateGame);
        if(this.stateGame.dots.length == 0) this.stateGame.gameOver(true);
    }
};
