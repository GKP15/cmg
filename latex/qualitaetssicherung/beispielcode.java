/*
* Kommentarblock für Klassenname, Versionsinfo, Copyright Informationen, Autorschaft
* @author xyz
*/

//der Block für package declarations und Importierte Java-Klassen
package a;

import x;
import y;


/**
* class oder interface statement
*/
public class klassenName{
    /*
    * Instanzvariablen: werden innerhalb der Klasse aber ausserhalb aller Methoden bzw. Funktionen deklariert
    * ein Kommentar, der mit /* (nur einem Stern beginnt) wird nicht per JavaDoc exportiert)
    * ein Kommentag der mit /** beginnt wird mit JavaDoc exportiert
    * Instanzvariablen, Methoden und Funktionen müssen mit /** kommentiert werden
    * mehrzeilige Kommentarbblöcke sollten in jeder Zeile mit * beginnen
    * der Block wird in einer eigenen Zeile mit */ geschlossen
    */

    //einzeilige Kommentare werden mit zwei fuehrenden // begonnen

    //einzeilige Kommentare bekommen eine eigene Zeile und eine führende Leerzeile
   
    /**
    * Instanzvariable wird deklariert. es wird immer nur eine Variable pro Zeile deklariert.
    */
    DatenTyp variablenName;

    /**
    * Dokumentation der folgenden Methode bzw Funktion
    * @param eingabeDaten
    * @result funktionsErgebnis
    */
    public void methodenName(datentyp eingabeDaten){

        //nach öffnender Klammer eingerückt
        methodenAufruf(); //ganz kurzer Kommentar - ausnahmsweise nicht in eigener Zeile
        Datentyp zurückGegebeneDaten = funktionsAufruf(); //jede Zeile enthält nur EIN Statement
        if(wahrheitsWert){
            //wenn wahrheitsWert
        } else if (andererWahrheitsWert) {
            //wenn nicht wahrheitsWert aber andererWahrheisWert
        } else {
            //wenn kein wahrheistWert
        }

    // die schliessende Klammer kommt in eine eigene Zeile und wird nicht mehr mit eingerückt (8 Zeichen weiter links als der Anweisungsblock)
    }
}


