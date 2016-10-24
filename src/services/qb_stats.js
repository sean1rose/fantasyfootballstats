var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var getQBStatsForWeek = function(weekNumber){
	return new Promise(function(resolve, reject){
		// use thehuddle.com stats tables
		var finalUrl = 'http://thehuddle.com/stats/2016/plays_weekly.php?pos=QB&week=' + weekNumber + '&ccs=1';

		request(finalUrl, function(err, response, body) {
			// console.log('in request - ', body);
			if (err){
				console.log('error - ', err);
			}
			console.log('getQBStatsForWeek status - ', response.statusCode);
			var $ = cheerio.load(body);
			var arrayOfPlayers = [];
			var objectOfPlayers = {};
			var finalObj = {};


				$('div.mod-table > table > tbody > tr').each(function( index ) {
				var player = $(this).find('td.t_std_left.align-left > a').text().trim();
				var children = $(this).children();
				var rank = parseInt(index) + 1;
				var playerName = children.find('a').text().trim();
				var team = children.eq(1).text().trim();

				var fantasyPts = parseInt(children.eq(3).text().trim());
				var attempts = parseInt(children.eq(7).text().trim());
				var completions = parseInt(children.eq(8).text().trim());
				var passYards = parseInt(children.eq(9).text().trim());
				var passTouchdowns = parseInt(children.eq(10).text().trim());

				var rushAttempts = parseInt(children.eq(4).text().trim());
				var rushYards = parseInt(children.eq(5).text().trim());
				var rushTouchdowns = parseInt(children.eq(6).text().trim());

				var pointsPerPlay = (fantasyPts / (rushAttempts + attempts) );				
				
				var playerObj = {};
				playerObj['playerName'] = playerName;
				playerObj['rank'] = rank;
				playerObj['team'] = team;
				playerObj['completions'] = completions;
				playerObj['attempts'] = attempts;
				playerObj['passYards'] = passYards;
				playerObj['passTouchdowns'] = passTouchdowns;
				playerObj['rushAttempts'] = rushAttempts;
				playerObj['rushYards'] = rushYards;
				playerObj['rushTouchdowns'] = rushTouchdowns;
				playerObj['pointsPerPlay'] = pointsPerPlay;
				playerObj['fantasyPoints'] = fantasyPts;

				objectOfPlayers[playerName] = playerObj;

				arrayOfPlayers.push(playerObj);

				finalObj['objectOfPlayers'] = objectOfPlayers;
				finalObj['arrayOfPlayers'] = arrayOfPlayers;
			});
			// console.log('arrayOfPlayers - ', arrayOfPlayers[0]);
			// console.log('objectOfPlayers - ', objectOfPlayers['David Johnson']);
			console.log('finalObj - ', finalObj.objectOfPlayers['Tom Brady']);
			resolve(arrayOfPlayers);
		});
	})
};

getQBStatsForWeek(6)
	.then(function(data){
		// console.log('RB touches - ', data);
	});
