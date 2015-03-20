var geocoder;
var map;
var infoWindow;
var mapDiv; 

//speichert pacman daten
var pacmanIcon;

var pacmanIconLeft;
var pacmanIconRight;
var pacmanIconUp;
var pacmanIconDown;
var pacmanIconClose;

var pacman;

//boolean für die speicherung ob pacman den mund auf hat
var open;

//speichert die daten für den Geist
var ghostIcon;
var ghost;
var newGhostPosition;

//speichert den Zoomfaktor
var zoom;


//Die Schrittweite auf der Karte		
		
//Leipzig Halle
//var step = 0.01;
		
//Leipzig Innenstadt
var step = 0.0001;

//eine Variable die die neue Position vom pacman speichert
var newPosition;

//eine Variable für die Tatstatureingabe
var key = null;

//eine varibalen für eine audiodateien
var welcome;
var pushStart;
var audio;
var ouch;

//eine zahl die man für einen zufallsgenerator braucht
var number;
	

//Gameloop
//frame
var ONE_FRAME_TIME = 1000 / 2 ;
    

var mainloop = function() {	
        updateGame();
        drawGame();
	
    };


setInterval( mainloop, ONE_FRAME_TIME );

function updateGame() {
	goPacman(key);
	//goGhost();

	checkCollision(pacman,ghost);
	
}

function drawGame() {
	//pacman.setMap(null);
	
	pacman.setPosition(newPosition);	
	pacman.setMap(map);

	//ghost.setPosition(newGhostPosition);
	//ghost.setMap(map);
}

function checkCollision(playerOne,playerTwo) {
	if (playerOne.getPosition().lat() == playerTwo.getPosition().lat() && playerOne.getPosition().lng() == playerTwo.getPosition().lng()) {
		
		ouch.play();
	}
}



//eine funktion die den geist bewegen soll...., funzt nicht....
function goGhost() {
	number = Math.floor( Math.random() * 3 );
	
	switch (number) {
		case 0: //left
			moveLeft(ghost); 
			break; 
		case 1: //right
			moveRight(ghost);
			break;
		case 2: //up
			moveUp(ghost);
			break;		
		case 3: //down
			moveDown(ghost);
			break;		
	}
}


function goPacman(key) {
	if (key != null) {
		if (pacman == null) {
			pacman = new google.maps.Marker({
		    		position: map.getCenter(),
		    		map: map,
		    		title: 'HERO',
				icon: pacmanIconRight,
				draggable: true
		  	});
			open = true;
		} 
		//welche Taste wurde gedrückt?		
			//var pressedKey = key.keyCode; 
			var pressedKey = key.charCode;


			//jenachdem was gedrueckt wurde die neuen koordinaten setzen
			switch (pressedKey) {
	    			case 97: //left        			
					moveLeft(pacman);       			
					break;
	    			case 100: //right
					moveRight(pacman);
					break;
				case 119: //up
					moveUp(pacman);
					break;
	    			case 115: //down
					moveDown(pacman);
					break;  
				default: //was anderes gedrückt
					key = null;
					//newPosition = pacman.getPosition();
					break;
			}
		}
		
}



//bewegung nach links
function moveLeft(player){
		
		if (player == pacman) {
			newPosition = new google.maps.LatLng(player.getPosition().lat(), player.getPosition().lng() - step);
			if (open) {
				pacman.setIcon(pacmanIconClose);
				open = false;
			} else {
				pacman.setIcon(pacmanIconLeft);
				open = true;
			}
		}
		if (player == ghost) {
			newGhostPosition = new google.maps.LatLng(player.getPosition().lat(), player.getPosition().lng() - step);
		}
}

function moveRight(player){
		if (player == pacman) {
			newPosition = new google.maps.LatLng(player.getPosition().lat(), player.getPosition().lng() + step);			
			if (open) {
				pacman.setIcon(pacmanIconClose);
				open = false;
			} else {
				pacman.setIcon(pacmanIconRight);
				open = true;
			}
		}
		if (player == ghost) {
			newGhostPosition = new google.maps.LatLng(player.getPosition().lat(), player.getPosition().lng() + step);
		}
}

function moveUp(player){
		
		if (player == pacman) {		
			newPosition = new google.maps.LatLng(player.getPosition().lat() + step, player.getPosition().lng());			
			if (open) {
				pacman.setIcon(pacmanIconClose);
				open = false;
			} else {
				pacman.setIcon(pacmanIconUp);
				open = true;
			}
		}
		if (player == ghost) {
			newGhostPosition = new google.maps.LatLng(player.getPosition().lat() + step, player.getPosition().lng());
		}
}

function moveDown(player){
		if (player == pacman) {			
			newPosition = new google.maps.LatLng(player.getPosition().lat() - step, player.getPosition().lng());			
			if (open) {
				pacman.setIcon(pacmanIconClose);
				open = false;
			} else {
				pacman.setIcon(pacmanIconDown);
				open = true;
			}
		}
		if (player == ghost) {
			newGhostPosition = new google.maps.LatLng(player.getPosition().lat() - step, player.getPosition().lng());
		}
}



function initialize() {
	geocoder = new google.maps.Geocoder();
	
	// Define an info window on the map.
	infoWindow = new google.maps.InfoWindow();
	zoom = 8;

	var latlng = new google.maps.LatLng(51.339852, 12.368916);
	var mapOptions = {
		zoom: zoom,
		center: latlng
	}
	mapDiv = document.getElementById('map-canvas');
	map = new google.maps.Map(mapDiv, mapOptions);
	
	//init audio
	audio = new Audio('test.mp3');
	welcome = new Audio('welcome.mp3');
	pushStart = new Audio('push_start.mp3');
	ouch = new Audio('ouch.mp3');

        //play 	welcome
	welcome.play();	

	//initialisierung der markerIcons
	pacmanIconLeft = {
	    		url: "pacman_open_left.png", // url
	    		scaledSize: new google.maps.Size(35, 35), // scaled size
	    		origin: new google.maps.Point(0,0), // origin
	    		anchor: new google.maps.Point(0, 0) // anchor
		};

	pacmanIconRight = {
	    		url: "pacman_open_right.png", // url
	    		scaledSize: new google.maps.Size(35, 35), // scaled size
	    		origin: new google.maps.Point(0,0), // origin
	    		anchor: new google.maps.Point(0, 0) // anchor
		};
	
	pacmanIconUp = {
	    		url: "pacman_open_up.png", // url
	    		scaledSize: new google.maps.Size(35, 35), // scaled size
	    		origin: new google.maps.Point(0,0), // origin
	    		anchor: new google.maps.Point(0, 0) // anchor
		};

	pacmanIconDown = {
	    		url: "pacman_open_down.png", // url
	    		scaledSize: new google.maps.Size(35, 35), // scaled size
	    		origin: new google.maps.Point(0,0), // origin
	    		anchor: new google.maps.Point(0, 0) // anchor
		};

	pacmanIconClose = {
	    		url: "pacman_close.png", // url
	    		scaledSize: new google.maps.Size(35, 35), // scaled size
	    		origin: new google.maps.Point(0,0), // origin
	    		anchor: new google.maps.Point(0, 0) // anchor
		};

	ghostIcon = {
    		url: "ghost.png", // url
    		scaledSize: new google.maps.Size(35, 35), // scaled size
    		origin: new google.maps.Point(0,0), // origin
    		anchor: new google.maps.Point(0, 0) // anchor
	};



	/*
	*	Event Listener dass beim clicken ein pacmansymbol auf der karte erscheint.
	*
	*/
		
	/*google.maps.event.addListener(map, "click", function(event) {
    		var lat = event.latLng.lat();
    		var lng = event.latLng.lng();
    	
		
	  	
		var pacmanII = new google.maps.Marker({
	    		position: event.latLng,
	    		map: map,
	    		title: lat + ' ' + lng,
			icon: pacmanIcon
	  	});
		
	});
	*/

	
	
	ghost = new google.maps.Marker({
		    		title: 'ENEMY',
				icon: ghostIcon,
				draggable: true
		  	});	


	// Setzt ein Info Window am Startpunkt
	infoWindow.setContent("Suche erstmal einen Ort <br> an dem du Spielen willst <br> in dem Suchfenster");
	//infoWindow.setPosition(home);
	infoWindow.setPosition(map.getCenter());		
	infoWindow.open(map);

	mainloop();
	
	
	
		
}
function resetPlayer(player,position) {
	player.setMap(null);
	player.setPosition(position);
	player.setMap(map);
}





function codeAddress() {
	
	//speichert die Geodaten des Eingebenen Ortes	
	var home;
	
	var address = document.getElementById('address').value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			map.setCenter(results[0].geometry.location);
			//setzt den Zoomfaktor nach der Eingabe eines Ortes			
			zoom = 18;			
			map.setZoom(zoom);

			//speichert die geodaten des ergebnisses in die variable home
			home = google.maps.LatLng(results[0].geometry.location);

						
			// Set the info window's content and position.
			infoWindow.setContent("Wenn du eine beliebige Taste drückst, <br> kannst den Geist mit awds steuern.");
			//infoWindow.setPosition(home);
			infoWindow.setPosition(map.getCenter());
			
			infoWindow.open(map);
			
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
		

		audio.play();


		//google.maps.event.addDomListener(document, 'keypress', goGhost);

		//soabld die geosuche abgeschlossen ist kann man pacman steuern.
		google.maps.event.addDomListener(document, 'keypress', function(pressedKey){
		key = pressedKey;
		} );

		newGhostPosition = new google.maps.LatLng(map.getCenter().lat() - step, map.getCenter().lng() + step);
		ghost.setPosition(newGhostPosition);		
		ghost.setMap(map);


		



	});
	
	


}

google.maps.event.addDomListener(window, 'load', initialize);
