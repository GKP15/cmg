/** sprite of the textfield */
var bgSprite = null;
/** value of the textfield */
var textData = null;
/** stores the input-text */
var myText = null;
/** current state of textfield */
var selected = null;
/** length of the textfield */
var length = null;
/** true if enter was pressed */
var pressedEnter = null;

/**
 * builds a new TextField
 * @param game is the game state
 * @param x is the horizontal coordinate
 * @param y is the vertical coordinate
 * @param length is the length of the textfield
 * @param sprite is the sprite of the textfield
 */
function TextField(game, x, y, length, sprite, defaultText) {
    this.length = length;
    this.bgSprite = game.add.sprite(x, y, sprite);
    this.bgSprite.inputEnabled = true;
    this.textData = "";
    this.myText = game.add.text(x + 5, y + 5, defaultText);
    this.myText.fontSize = 32;
    this.myText.fill = '#000';
    this.selected = false;
    game.input.keyboard.addCallbacks(this, null, this.keyPress, null);
    this.pressedEnter = false;

    this.bgSprite.events.onInputDown.add(this.selector, this);
};

TextField.prototype = {
    /** 
	 * handles pressed keys 
	 */
    keyPress : function(data) {
	    if(this.selected) {
            switch(data.keyCode) {
                case 8:
                    this.textData = this.textData.substring(0, this.textData.length - 1);
                    this.myText.text = this.textData;
					return false;
                	break;
                case 13:
                	this.pressedEnter = true;
                	break;
                default:
                    if ((this.textData.length + 1) <= this.length) {
                        var char = String.fromCharCode(data.keyCode).toString();
                        if (char.length > 0) {
						    if(!data.shiftKey) char = char.toLowerCase();
                            this.textData += char;
                            this.myText.text = this.textData;
                        }
                    }
            	break;
            }
        }
    },

    /**
     * switch selection on/off
     */
    selector : function() {
        this.selected = !this.selected;
        if(this.selected) {
            if(this.myText.text == this.defaultText) this.myText.text = '';
            else this.myText.fill = '#000';
        }
        else this.myText.fill = '#808080';
    }
};
