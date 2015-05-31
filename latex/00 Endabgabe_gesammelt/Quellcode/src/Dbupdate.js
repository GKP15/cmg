/**
 * saves the highscore
 */
function savescoredata(id, player, score) {

		// count number of entries for new update
		var numb = 0 ;
		var exists = true;
		// Base URL Adress for RDF Database
		apiUrlBase = "http://pcai042.informatik.uni-leipzig.de:1540/sparql?default-graph-uri=pucman&query=";
		
		// ASK if entry already exist and find number for new one
		do {
			// Query for URL
			apiUrlData = "PREFIX%20puchs%3A%20%3Chttp%3A%2F%2Fpcai042.informatik.uni-leipzig.de%3A1540%2Fpm%2Fhighscore%2F%3E%0APREFIX%20pucvoc%3A%20%3Chttp%3A%2F%2Fpcai042.informatik.uni-leipzig.de%3A1540%2Fpm%2Fschema%2F%3E%0A%0AASK%0AWHERE%20%7B%0Apuchs%3A"
			+ id + player + numb + "%20a%20pucvoc%3AHighscore%20.%0A%7D";
			
			// asking Data
			$.ajax({
				url: apiUrlBase + apiUrlData,
				crossDomain: true,
				method: "GET",
				async: false,
				success: function(data) {
					// If Answer true -> Entry already exist; try next higher number
					if (data == "true") {
						numb++;
					// Else: Exit
					} else {
						exists = false;
					}
				}
			});
		}
		while (exists == true);

		//Update Database
		
		// Updatequery for URL
		apiUrlUpData = "PREFIX%20pucvoc%3A%20%3Chttp%3A%2F%2Fpcai042.informatik.uni-leipzig.de%3A1540%2Fpm%2Fschema%2F%3E%20%0APREFIX%20pucgm%3A%20%3Chttp%3A%2F%2Fpcai042.informatik.uni-leipzig.de%3A1540%2Fpm%2Fgamer%2F%3E%0APREFIX%20puchs%3A%20%3Chttp%3A%2F%2Fpcai042.informatik.uni-leipzig.de%3A1540%2Fpm%2Fhighscore%2F%3E%0APREFIX%20foaf%3A%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0AINSERT%20%7B%0A%0Apucgm%3A"
		+ player + "%20a%20pucvoc%3APlayer%20%3B%0Afoaf%3Anick%20%22"
		+ player + "%22%20.%0A%0Apuchs%3A"
		+ id + player + numb + "%20a%20pucvoc%3AHighscore%20%3B%0Apucvoc%3Avalue%20%22"
		+ score + "%22%20%3B%0Apucvoc%3Aplayer%20pucgm%3A"
		+ player + "%20%3B%0Apucvoc%3Acity%20%20%20%22"
		+ id + "%22%20.%0A%7D%0AWHERE%20%7B%7D";
		// Post Data
			$.ajax({
				url: apiUrlBase + apiUrlUpData,
				crossDomain: true,
				method: "POST",
				async: false,
				success: function(data) {
				}
			});		
};
