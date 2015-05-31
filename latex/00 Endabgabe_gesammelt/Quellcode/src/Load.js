//globale PucmanVariable
Pucman = {};

Pucman.Load = function(game, map) {
    this.id = null;
    this.map = null;
    this.graph = null;
    this.graphReady = false;
};

Pucman.Load.prototype = {
    
	/**
	 * initialisation of the state
	 * @param the map from mapstraction
	 */
	init: function(map, id) {
        this.map = map;
        this.graph = Pucman.Graph.getGraph(this);
		this.id = id;

    },
	
	/**
	 * updates the state
	 */
    update: function() {
        if (this.graphReady) {
			document.getElementById("loadText").style.zIndex = "-1";
            this.game.state.start('Game', false, false, this.graph, this.id);
        }
    },

};
