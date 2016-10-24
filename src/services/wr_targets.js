var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var getWRTargetsForWeek = function(weekNumber){
	return new Promise(function(resolve, reject){
		// use thehuddle.com stats tables
		var finalUrl = 'http://thehuddle.com/stats/2016/plays_weekly.php?week=' + weekNumber + '&pos=wr&col=FPTS&ccs=1';
		request(finalUrl, function(err, response, body) {
			// console.log('in request - ', body);
			if (err){
				console.log('error - ', err);
			}
			console.log('getWRTargetsForWeek status - ', response.statusCode);
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
				var targets = parseInt(children.eq(7).text().trim());
				var catches = parseInt(children.eq(8).text().trim());
				var fantasyPts = parseInt(children.eq(3).text().trim());
				var pointsPerTarget = (fantasyPts / targets);
				
				var playerObj = {};
				playerObj['playerName'] = playerName;
				playerObj['rank'] = rank;
				playerObj['team'] = team;
				playerObj['targets'] = targets;
				playerObj['catches'] = catches;
				playerObj['fantasyPoints'] = fantasyPts;
				playerObj['pointsPerTarget'] = pointsPerTarget;

				objectOfPlayers[playerName] = playerObj;

				arrayOfPlayers.push(playerObj);

				finalObj['objectOfPlayers'] = objectOfPlayers;
				finalObj['arrayOfPlayers'] = arrayOfPlayers;
			});
			// console.log('arrayOfPlayers - ', arrayOfPlayers[0]);
			resolve(arrayOfPlayers);
		});
	})
};

getWRTargetsForWeek(1)
	.then(function(data){
		console.log('wr targets - ', data);
	});
