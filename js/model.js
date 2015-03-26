var geocoder;
var map;
var infoWindow;
var mapDiv;

// speichert pacman icon-daten
var pacmanIcon;

// pacmanIcon nach links geoeffnet
var pacmanIconLeft;
// pacmanIcon nach rechts geoeffnet
var pacmanIconRight;
// pacmanIcon nach oben geoeffnet
var pacmanIconUp;
// pacmanIcon nach unten geoeffnet
var pacmanIconDown;
// pacmanIcon nach links geoeffnet
var pacmanIconClose;

// pacmanDaten
var pacman;

// boolean wahr, wenn pacmanS mund offen ist
var open;

// geist icon
var ghostIcon;
// geistDaten
var ghost;
// neue position des Geistes
var newGhostPosition;

// zoomfaktor
var zoom;


/* Die Schrittweite auf der Karte
 * nur fuers vorprojekt, da spaeter nicht direkt auf der googlemap gelaufen wird
 * Leipzig Innenstadt
*/
var step = 0.0001;

// neue position von pacman
var newPosition;

// tatstatureingabe
var key = null;

// eine varibalen fuer eine audiodateien
var welcome;
var pushStart;
var audio;
var ouch;

// zahl fuer zufallsgenerator
var number;

// richtung für Geist ändern
var changeDir = 0;


/* Gameloop
 * frame, zeitabstand zwischen zwei spielbewegungen
*/
var ONE_FRAME_TIME = 1000 / 2 ;

/* mainloop wird alle ONE_FRAME_TIME aufgerufen
 * zuerst werden alle spielveraenderungen berechnet, danach wird gemalt
*/
var mainloop = function() {
        updateGame();
        drawGame();
    };

/* zeitabstand zwischen den aufrufen von mainloop wird auf ONE_FRAME_TIME gesetzt
 *  @param mainloop funktion die wiederholt aufgerufen werden soll
 *  @param ONE_FRAME_TIME intervall zwischen den aufrufen
 */
setInterval( mainloop, ONE_FRAME_TIME );

// berechnet alle veraenderungen im spiel(bewegung von pacman)
function updateGame() {
        goPacman(key);
        goGhost();

        checkCollision(pacman,ghost);

}

// malt das spielgeschehen
function drawGame() {
        //pacman.setMap(null);

        pacman.setPosition(newPosition);
        pacman.setMap(map);

        ghost.setPosition(newGhostPosition);
        ghost.setMap(map);
}

 /* ueberprueft ob sich zwei spieler auf dem selben laengen und breitengrad befinden, wenn ja wird eine "melodie" gespielt
 *  @param playerOne spieler dessen position verglichen werden soll
 *  @param playerTwo spieler dessen position verglichen werden soll
 */
function checkCollision(playerOne,playerTwo) {
        if (playerOne.getPosition().lat() == playerTwo.getPosition().lat() && playerOne.getPosition().lng() == playerTwo.getPosition().lng()) {

                ouch.play();
        }
}



//eine funktion die den geist bewegen soll
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

/* wenn pacman noch nicht gestzt wurde wird er auf die mitte der karte gesetzt
 * ansonsten wird je nach eingabe eine funktion aufgerfuen, die pacman in die
 * entsprechende richtung bewegt
 *  @param key taste die zuletzt gedrueckt wurde, w,a,s,d entsprechen den pfeiltasten alles andere wird auf null gesetzt
 */
function goPacman(key) {
        if (key != null) {
                if (pacman == null) {
                    pacman = new google.maps.Marker({
                                position: map.getCenter(),
                                map: map,
                                title: 'HERO',
                                icon: pacmanIconRight,
                                draggable: false
                          });
                    open = true;
					infoWindow.close();
                }
                //welche Taste wurde gedrueckt?
                        //var pressedKey = key.keyCode; //funktioniert nicht bei firefox
                        //funktioniert bei firefox
                        var pressedKey = key.charCode;


                        //jenachdem was gedrueckt wurde wird die entsprechende funktion aufgerufen
                        switch (pressedKey) {
                                    case 97: //left, a
                                        moveLeft(pacman);
                                        break;
                                    case 100: //right, d
                                        moveRight(pacman);
                                        break;
                                case 119: //up, w
                                        moveUp(pacman);
                                        break;
                                    case 115: //down, s
                                        moveDown(pacman);
                                        break;
                                default: //was anderes gedrückt
                                        key = null;
                                        //newPosition = pacman.getPosition();
                                        break;
                        }
                }

}


/* bewegung nach links
 * laengen und breitengrad werte werden entsprechend veraendert
 * @param player zu bewegendes spielObjekt(pacman oder geist)
 */
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

/* bewegung nach rechts
 * laengen und breitengrad werte werden entsprechend veraendert
 * @param player zu bewegendes spielObjekt(pacman oder geist)
 */
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

/* bewegung nach oben
 * laengen und breitengrad werte werden entsprechend veraendert
 * @param player zu bewegendes spielObjekt(pacman oder geist)
 */
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

/* bewegung nach unten
 * laengen und breitengrad werte werden entsprechend veraendert
 * @param player zu bewegendes spielObjekt(pacman oder geist)
 */
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


/* googleMapsFunktion
 * initialisiert das infofenster
 * initialisiert die map
 * initialisiert die audiodateien
 * initialisiert die pacmanicons
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

        // klm layer
         var ctaLayer = new google.maps.KmlLayer({
                 url: 'http://dopa.lima-city.de/pucMap.kml'
         });
         ctaLayer.setMap(map);

        //init audio
        audio = new Audio('resources/test.mp3');
        welcome = new Audio('resources/welcome.mp3');
        pushStart = new Audio('resources/push_start.mp3');
        ouch = new Audio('resources/ouch.mp3');

        //play welcome
        welcome.play();

        //initialisierung der markerIcons
        pacmanIconLeft = {
                            url: "resources/pacman_open_left.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        pacmanIconRight = {
                            url: "resources/pacman_open_right.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        pacmanIconUp = {
                            url: "resources/pacman_open_up.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        pacmanIconDown = {
                            url: "resources/pacman_open_down.png", // url
                            scaledSize: new google.maps.Size(35, 35), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                };

        pacmanIconClose = {
                            url: "resources/pacman_close.png", // url
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
function resetPlayer(player,position) {
        player.setMap(null);
        player.setPosition(position);
        player.setMap(map);
}


function setVolume(value) {
		audio.volume = value;
		welcome.volume = value;
		pushStart.volume = value;
		ouch.volume = value;
}


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

                //google.maps.event.addDomListener(document, 'keypress', goGhost);

                //soabld die geosuche abgeschlossen ist kann man pacman steuern.
                google.maps.event.addDomListener(document, 'keypress', function(pressedKey){
                key = pressedKey;
                } );

                newGhostPosition = new google.maps.LatLng(map.getCenter().lat() - step, map.getCenter().lng() + step);
                ghost.setPosition(newGhostPosition);
                ghost.setMap(map);
				
				map.set('disableDefaultUI', true);
				map.set('scrollwheel', false);
				map.set('draggable', false);
				map.set('disableDoubleClickZoom', true);

        });




}

google.maps.event.addDomListener(window, 'load', initialize);

        /*
        *        Event Listener dass beim clicken ein pacmansymbol auf der karte erscheint.
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
