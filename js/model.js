//map + Grafiken
/** api zur Auflösung der Koordinaten  */
var geocoder;
/** in dieser Variablen werden die Daten der Map gespeichert */
var map;
/** Sprechblase */
var infoWindow;
/** Cannvas der Karte */
var mapDiv;
/** zoomfaktor */
var zoom;
/** Die Schrittweite auf der Karte fuer Leipzig Innenstadt */
var step = 0.0001;
/** neue Position von pucman */
var newPosition;
/** aktuelle Tatstatureingabe */
var key = null;
/** zahl fuer zufallsgenerator */
var number;

//pucman
/** pucmanDaten */
var pucman;
/** speichert pucman icon-daten */
var pucmanIcon;
/** pucmanIcon nach links geoeffnet */
var pucmanIconLeft;
/** pucmanIcon nach rechts geoeffnet */
var pucmanIconRight;
/** pucmanIcon nach oben geoeffnet */
var pucmanIconUp;
/** pucmanIcon nach unten geoeffnet */
var pucmanIconDown;
/** pucmanIcon nach links geoeffnet */
var pucmanIconClose;
/** boolean wahr, wenn pucmanS mund offen ist */
var pucmanMouthOpen;

//ghost
/** geistDaten */
var ghost;
/** geist icon */
var ghostIcon;
/** neue position des Geistes */
var newGhostPosition;
/** richtung für Geist ändern */
var changeDir = 0;

//audio
/** audio datei - initialisiert das Abspielen von Audiodateien */
var audio;
/** audiodatei welcome-sound */
var audioWelcome;
/** audiodatei, wird abgespielt bei druecken von Start */
var audioPushStart;
/** audiodatei wird abgespielt wenn pucman gefressen wird */
var audioOuch;



/**
 * Gameloop
 * frame, zeitabstand zwischen zwei spielbewegungen
*/
var ONE_FRAME_TIME = 1000 / 2 ;

/** 
 * mainloop wird alle ONE_FRAME_TIME aufgerufen
 * zuerst werden alle spielveraenderungen berechnet, danach wird gemalt
*/
var mainloop = function() {
        updateGame();
        drawGame();
    };

/** 
 * zeitabstand zwischen den aufrufen von mainloop wird auf ONE_FRAME_TIME gesetzt
 *  @param mainloop funktion die wiederholt aufgerufen werden soll
 *  @param ONE_FRAME_TIME intervall zwischen den aufrufen
 */
setInterval( mainloop, ONE_FRAME_TIME );

/** berechnet alle veraenderungen im spiel(bewegung von pucman) */
function updateGame() {
        goPucman(key);
        goGhost();
        checkCollision(pucman,ghost);
}

/** 
 * malt das spielgeschehen 
 */
function drawGame() {
        pucman.setPosition(newPosition);		
		ghost.setPosition(newGhostPosition);
}

 /**
  *  ueberprueft ob sich zwei spieler auf dem selben laengen und breitengrad befinden, wenn ja wird eine "melodie" gespielt
 *  @param playerOne: spieler dessen position verglichen werden soll
 *  @param playerTwo: spieler dessen position verglichen werden soll
 */
function checkCollision(playerOne,playerTwo) {
        if (playerOne.getPosition().lat() == playerTwo.getPosition().lat() 
        		&& playerOne.getPosition().lng() == playerTwo.getPosition().lng()) {
                	audioOuch.play();
        }
}

/**
 * eine funktion die den geist bewegen soll
 */
function goGhost() {
        if(changeDir == 0) {
			number = Math.floor( Math.random() * 4 );
			changeDir = 1 + Math.floor(Math.random() * 4);
		}
		changeDir--;
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

/**
 *  wenn pucman noch nicht gesetzt wurde wird er auf die Mitte der karte gesetzt
 * ansonsten wird je nach eingabe eine funktion aufgerufen, die pucman in die
 * entsprechende richtung bewegt
 *  @param key: taste die zuletzt gedrueckt wurde, w,a,s,d entsprechen den pfeiltasten alles andere wird auf null gesetzt
 */
function goPucman(key) {
	if (key != null) {
		if (pucman == null) {
			pucman = new google.maps.Marker({
			            position: map.getCenter(),
			            map: map,
			            title: 'HERO',
			            icon: pucmanIconRight,
			            draggable: false
			});
			pucmanMouthOpen = true;
			infoWindow.close();
		}
		//welche Taste wurde gedrueckt?
			//mit keycode funktionieren die pfeiltasten, funktioniert aber nicht im firefox
			//var pressedKey = key.keyCode; 
			//funktioniert bei firefox
		var pressedKey = key.charCode;
		//jenachdem was gedrueckt wurde wird die entsprechende funktion aufgerufen
		// ist das jetzt noch WASD oder cursortasten?
		switch (pressedKey) {
			case 97: // a
			    moveLeft(pucman);
			    break;
			case 100: // d
			    moveRight(pucman);
			    break;
			case 119: // w
			    moveUp(pucman);
			    break;
			case 115: // s
			    moveDown(pucman);
			    break;
			default: 
				// falls andere Taste gedrueckt, passiert nichts
				break;
		}
	}
}

/**
 * bewegung nach links
 * laengen und breitengrad werte werden entsprechend veraendert
 * @param player: zu bewegendes spielObjekt(pucman oder geist)
 */
function moveLeft(player){
		if (player == pucman) {
		        newPosition = new google.maps.LatLng(player.getPosition().lat(), player.getPosition().lng() - step);
		        if (pucmanMouthOpen) {
		                pucman.setIcon(pucmanIconClose);
		                pucmanMouthOpen = false;
		        } else {
		                pucman.setIcon(pucmanIconLeft);
		                pucmanMouthOpen = true;
		        }
		}
		if (player == ghost) {
		        newGhostPosition = new google.maps.LatLng(player.getPosition().lat(), player.getPosition().lng() - step);
		}
}

/**
 * bewegung nach rechts
 * laengen und breitengrad werte werden entsprechend veraendert
 * @param player: zu bewegendes spielObjekt(pucman oder geist)
 */
function moveRight(player){
		if (player == pucman) {
		        newPosition = new google.maps.LatLng(player.getPosition().lat(), player.getPosition().lng() + step);
		        if (pucmanMouthOpen) {
		                pucman.setIcon(pucmanIconClose);
		                pucmanMouthOpen = false;
		        } else {
		                pucman.setIcon(pucmanIconRight);
		                pucmanMouthOpen = true;
		        }
		}
		if (player == ghost) {
		        newGhostPosition = new google.maps.LatLng(player.getPosition().lat(), player.getPosition().lng() + step);
		}
}

/**
 * bewegung nach oben
 * laengen und breitengrad werte werden entsprechend veraendert
 * @param player zu bewegendes spielObjekt(pucman oder geist)
 */
function moveUp(player){
		if (player == pucman) {
		        newPosition = new google.maps.LatLng(player.getPosition().lat() + step, player.getPosition().lng());
		        if (pucmanMouthOpen) {
		        		pucman.setIcon(pucmanIconClose);
		        		pucmanMouthOpen = false;
		        } else {
		                pucman.setIcon(pucmanIconUp);
		                pucmanMouthOpen = true;
		        }
		}
		if (player == ghost) {
		        newGhostPosition = new google.maps.LatLng(player.getPosition().lat() + step, player.getPosition().lng());
		}
}

/**
 * bewegung nach unten
 * laengen und breitengrad werte werden entsprechend veraendert
 * @param player zu bewegendes spielObjekt(pucman oder geist)
 */
function moveDown(player){
		if (player == pucman) {
		        newPosition = new google.maps.LatLng(player.getPosition().lat() - step, player.getPosition().lng());
		        if (pucmanMouthOpen) {
		                pucman.setIcon(pucmanIconClose);
		                pucmanMouthOpen = false;
		        } else {
		                pucman.setIcon(pucmanIconDown);
		                pucmanMouthOpen = true;
		        }
		}
		if (player == ghost) {
		        newGhostPosition = new google.maps.LatLng(player.getPosition().lat() - step, player.getPosition().lng());
		}
}


/**
 * googleMapsFunktion
 * initialisiert das infofenster, die map, die audiodateien und die pucmanicons
 */
function initialize() {
        geocoder = new google.maps.Geocoder();

        // Define an info window on the map.
        infoWindow = new google.maps.InfoWindow();
        zoom = 8;

        var latlng = new google.maps.LatLng(51.339852, 12.368916);
        var mapOptions = {
                zoom: zoom,
                center: latlng,
				streetViewControl: false
        };
        mapDiv = document.getElementById('map-canvas');
        map = new google.maps.Map(mapDiv, mapOptions);

        //init audio
        audio = new Audio('resources/test.mp3');
		audio.loop = true;
        audioWelcome = new Audio('resources/welcome.mp3');
        audioPushStart = new Audio('resources/push_start.mp3');
        audioOuch = new Audio('resources/ouch.mp3');
		
		setVolume(document.getElementById('sldVolume').value);

        //play welcome
        audioWelcome.play();

        //initialisierung der markerIcons
        pucmanIconLeft = {
                            url: "resources/pucman_open_left.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        pucmanIconRight = {
                            url: "resources/pucman_open_right.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        pucmanIconUp = {
                            url: "resources/pucman_open_up.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        pucmanIconDown = {
                            url: "resources/pucman_open_down.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        pucmanIconClose = {
                            url: "resources/pucman_close.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        ghostIcon = {
                    url: "resources/ghost.png", // url
                    scaledSize: new google.maps.Size(35, 35), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
        };

        ghost = new google.maps.Marker({
                                    title: 'ENEMY',
                                icon: ghostIcon,
                                draggable: false
                          });

        // Setzt ein Info Window am Startpunkt
        infoWindow.setContent("Suche erstmal einen Ort <br> an dem du Spielen willst <br> in dem Suchfenster");
        //infoWindow.setPosition(home);
        infoWindow.setPosition(map.getCenter());
        infoWindow.open(map);
        mainloop();
}

/**
 * Hilfsfunktion: reset des Spielers
 */
function resetPlayer(player,position) {
        player.setMap(null);
        player.setPosition(position);
        player.setMap(map);
}

/**
 * Hilfsfunktion: steuert die Lautstärke
 */
function setVolume(value) {
		audio.volume = value;
		audioWelcome.volume = value;
		audioPushStart.volume = value;
		audioOuch.volume = value;
}

/**
 * sucht geo-koordinaten zu eingegebener Adresse
 */
function codeAddress() {
        //speichert die Geodaten des Eingebenen Ortes
        var home;
        var address = document.getElementById('address').value;
		if(address == document.getElementById('address').defaultValue) address = 'Leipzig';
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
                //soabld die geosuche abgeschlossen ist kann man pucman steuern.
                google.maps.event.addDomListener(
                		document, 'keypress', function(pressedKey){key = pressedKey;}
                );
                newGhostPosition = new google.maps.LatLng(map.getCenter().lat() - step, map.getCenter().lng() + step);
                ghost.setPosition(newGhostPosition);
                ghost.setMap(map);
				map.set('disableDefaultUI', true);
				map.set('scrollwheel', false);
				map.set('draggable', false);
				map.set('disableDoubleClickZoom', true);
        });
}

/**
 * initialer Aufruf des Event-Listeners
 */
google.maps.event.addDomListener(window, 'load', initialize);
