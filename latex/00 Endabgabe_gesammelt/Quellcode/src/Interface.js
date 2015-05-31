Pucman.Interface = (function() {
    return {
		
		/**
		 * preloads data for the interface
		 * @param game state
		 */
        preloadInterface: function(that) {
            that.load.image('homePageButtonPic', 'resources/homePageButton.png');
            that.load.image('plusButtonPic', 'resources/plusButton.png');
            that.load.image('minusButtonPic', 'resources/minusButton.png');
			that.load.image('pauseButtonPic', 'resources/pauseButton.png');
			that.load.image('textFieldPic', 'resources/textField.png')

            // music
            that.load.audio('music', 'resources/test.mp3');
            that.load.audio('ouch', 'resources/ouch.mp3');
        },
		
		/**
		 * creates the interface
		 * @param gane state
		 */
        createInterface: function(game) {
			var state = game.state.getCurrentState();
            //button to got to homepage
            homepageButton = game.add.button(((game.width / 20) * 17), (game.height - 64), 'homePageButtonPic', function() {
                window.location.href = 'http://pcai042.informatik.uni-leipzig.de/~swp15-gkp/';
            }, state);
            //button to increase volume
            plusButton = game.add.button(((game.width / 20) * 18), (homepageButton.y - ((game.cache.getImage('plusButtonPic').height + 32) * 2)), 'plusButtonPic', function() {
                state.backGroundMusic.volume = Math.min(1, state.backGroundMusic.volume + 0.05);
            }, state);
            //button to  decrease volume
            minusButton = game.add.button(((game.width / 20) * 18), (homepageButton.y - (game.cache.getImage('plusButtonPic').height + 32)), 'minusButtonPic', function() {
                state.backGroundMusic.volume = Math.max(0, state.backGroundMusic.volume - 0.05);
            }, state);
			//button to pause the game
			pauseButton = game.add.button(((game.width / 20) * 14), (game.height - 64), 'pauseButtonPic', function() {
                game.paused = true;
				pauseLabel = game.add.text(game.width/2, game.height/2, 'Click anywhere to continue', {
					fontSize: '48px',
					fill: '#DC0F0F'
				});
				pauseLabel.anchor.setTo(0.5);
            }, state);
			
            //return from pause menu
			game.input.onDown.add(function() {
				if(game.paused && typeof pauseLabel != 'undefined') {
					pauseLabel.destroy();
					game.paused = false;
				}
			}, self);

            //  Lives
            state.livesText = state.add.text((game.width / 20), (game.height - 64), 'Lives: 3', {
                fontSize: '32px',
                fill: '#280FDC'
            });
            //  Score
            state.scoreText = state.add.text((game.width / 2), (game.height - 64), 'Score: 0', {
                fontSize: '32px',
                fill: '#280FDC'
            });


            // music
            state.backGroundMusic = game.add.audio('music', 0.2, true);
            state.backGroundMusic.play();
        },
		
        /**
         * shows a message on the screen
         * @param game is the Phaser.Game object
         * @param text is the message to display
         */
		showMessage: function(game, text) {
			var state = game.state.getCurrentState();
			
			state.msgLabel = state.add.text(game.width/2, game.height/2, text, {
					fontSize: '48px',
					fill: '#DC0F0F'
				});
			state.msgLabel.anchor.setTo(0.5);
		},
		
		/**
		 * updates the score after eating a dot
		 * @param game state
		 */
        eatDot: function(game) {
            // Score
            game.scoreText.text = 'Score: ' + game.score;
        }

    };
})();
