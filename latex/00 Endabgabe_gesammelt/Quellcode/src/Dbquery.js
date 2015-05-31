/**
 * gets the highscoredata for the markers
 */
function rdfmarkerget(id) {

		// create array with markers
		var markerlist = [];
		// URL Adress for RDF Database
		apiUrlBase = "http://pcai042.informatik.uni-leipzig.de:1540/sparql?default-graph-uri=pucman&query=";
		apiUrlData = "PREFIX%20pucvoc%3A%20%3Chttp%3A%2F%2Fpcai042.informatik.uni-leipzig.de%3A1540%2Fpm%2Fschema%2F%3E%0APREFIX%20foaf%3A%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0ASELECT%20%3FCity%20%3FPerson%20%3FScore%0AWHERE%20%7B%0A%3Fainstanz%20a%20pucvoc%3AHighscore%20.%0A%3Fainstanz%20pucvoc%3Acity%20%22"
			+ id + "%22%20.%0A%3Fainstanz%20pucvoc%3Acity%20%3FCity%20.%0A%3Fainstanz%20pucvoc%3Aplayer%20%3Faplayer%20.%0A%3Faplayer%20a%20pucvoc%3APlayer%20.%0A%3Faplayer%20foaf%3Anick%20%3FPerson%20.%0A%3Fainstanz%20pucvoc%3Avalue%20%3FScore%20.%0A%7D%0AORDER%20BY%20DESC(%3FScore)%20LIMIT%205&format=json";
		// getting Data
		$.ajax({
			url: apiUrlBase + apiUrlData,
			crossDomain: true,
			method: "GET",
			DataType: 'json',
			async: false,
			success: function(data) {
				// create marker array
				var markerelement = [];
				// get all Data from json body
				var bindings = data.results.bindings;
				if (bindings.length == 0) {
					markerlist = [id, "notplayed", null];
					return markerlist;
				}	else {
				for(var i in bindings) {
					// saves in markerelement: City, Person, Score
					markerelement = [bindings[i].City.value, bindings[i].Person.value, bindings[i].Score.value];
					markerlist.push(markerelement);
					markerelement = null;
				};
				}
				
			}		
		});
	return markerlist;
};
