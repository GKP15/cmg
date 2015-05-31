Pucman.Ghost = function(game, key, node) {

    Phaser.Sprite.call(this, game, 100, 100, key, 0);
    this.anchor.set(0.5);
    this.position = node.position();
    this.node = node;
    this.lastNode = node;
    this.direction = Phaser.LEFT;
    this.stateGame = game.state.getCurrentState();
};

Pucman.Ghost.prototype = Object.create(Pucman.Character.prototype);
Pucman.Ghost.constructor = Pucman.Ghost;

/**
 * updates the position
 */
Pucman.Ghost.prototype.update = function() {

    if ((new Date()).getTime() % 3 != 0) {
        this.move(this.getDir());
    }
};

/**
 * gets the direction (random)
 * @return next direction
 */
Pucman.Ghost.prototype.getDir = function() {

    if (this.node.neighborhood('node[id]').length > 2) {
        
        // if pucman has a distance of more than sqrt(15000) the ghost targets him
        function calcDir(ghostPos, pucmanPos) {
            if ((ghostPos.x - pucmanPos.x) * (ghostPos.x - pucmanPos.x) + (ghostPos.y - pucmanPos.y) * (ghostPos.y - pucmanPos.y) > 15000) {
                return Pucman.Graph.dirAToB(ghostPos, pucmanPos);
            }

            return Math.floor(Math.random() * 4);
        };

        var newDir = calcDir(this.node.position(), this.stateGame.getPucmanNode().position());
        //if the ghost runs against a wall, change direction
        while (typeof this.getNodeInDir(newDir) == 'undefined') {
            newDir = Math.floor(Math.random() * 4);
        };

        return newDir;

    }

    return this.direction;

};
