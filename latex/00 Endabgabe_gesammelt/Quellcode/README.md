## Installation
1. npm installieren. Unter Windows einfach die MSI-Datei ausführen.   
   Steht alles auf der Website: https://www.npmjs.com/package/npm  
2. Repro clonen. Kann man auch davor machen.  
3. Kommandozeile/Terminal öffnen und folgendes eingeben: `npm install http-server -g`  
   Damit installiert ihr einen lokalen Webserver, der zum ausführen des Spiels benötigt wird.  
   Sollte der Befehl npm nicht erkannt werden, liegts wahrscheinlich an der PATH-Variable.  
   Da müsst ihr dann manuell den Pfad zu npm einfügen. Google --> npm path windows --> erstes Ergebnis  
4. Per Kommandozeile/Terminal in das lokale Repro navigieren (in den Ordner wo die index.html liegt)  
   Dann per `http-server` den Webserver starten. Der übernimmt dann gleich alle Dateien und Ordner im aktuellen  
   Verzeichnis auf. Die IP ist zwar 0.0.0.0:8080 aber am Besten ihr ruft im Browser 127.0.0.1:8080 auf.  
5. Jetzt sollte das Spiel starten. Den Sourcecode könnt ihr live editieren.   
   Wenn ihr ihn abspeichert wird er direkt auf den Server geladen und ihr müsst nur die Website aktualisieren.  


## Begriffserläuterung bzgl. Game Development & Phaser
* **GameState**:
   
   Ein bestimmter Abschnitt des Spiels, zB: Hauptmenü, Pausemenü, GameOverScreen und das eigentliche Spiel.  
   Enthält alle für den jeweiligen Zustand relevanten Daten.
* **Sprite**:
   
   Grafik eines bestimmtem Spielobjekts, welche im Spiel angezeigt wird.  
* **Animation**:
   
   Aneinanderreihung mehrerer Sprites, welche hintereinander angezeigt werden.   
   Hat bestimmte Länge und kann sich wiederholen.
* **Spritesheet**:
   
   Grafikdatei aus mehreren Sprites eines Objekts. Zum Beispiel Charakter schaut nach links, rechts, oben, unten.   
   Die Sprites einer Animation stammen meistens aus einem Spritesheet.
* **Tile**: 
   
   Ein (meist quadratisches) Rechteck, welches eine Art Kachel auf der Spielkarte repräsentiert.  
   Einem Tile ist meist ein Sprite zugeordnet, welcher angezeigt wird.   
   Der Spieler bewegt sich sozusagen über die Tiles hinweg.
* **Tilemap**:
   
   Darstellung der Spielkarte als Raster aus mehreren Tiles. Die Tilemap legt fest an welcher stelle welches Tile liegt.  
   Solche Spieler heißen tilebased, gridbased oder kachelbasiert.
* **Tileset**:
   
   Grafikdatei aus mehreren Sprites. Jeder Tilemap ist ein Tileset zugeordnet, welches die Sprites enthält,   
   die den Tiles zugeordnet werden können.
* **Collision Detection**:
   
   Kollisionserkennung zwischen verschiedenen Spielobjekten. Mehrere Möglichkeiten:  
      1. Tilebased Collision: Entweder Objekt kann ein Tile betreten oder nicht.  
      2. Collision Box: Jedes Objekt besitzt eine Collision Box (Rechteck). Wenn sich die Rechtecke von zwei Objekten                                schneiden, gibt es eine Kollision.  
      3. Pixelbased Collision: Pixelgenaue Kollision, also nur dann, wenn sich die Sprites wirklich überlappen.  
* **Game Loop**:
   
   Schleife die währen des Spielablaufs immer wieder durchlaufen wird.  
   Dabei werden im wesentlichen zwei Dinge ausgeführt:  
      1. Die Update-Methode, enthält: Tastatur- und Mauseingabe, Bewegung, Kollisionserkennung, ...  
      2. Die Render-Methode, enthält: Anzeige aller Sprites an den neuen Positionen, Hintergrund animieren, ...  
   Die Game Loop wird abgebrochen, wenn das Spiel beendet wird.
