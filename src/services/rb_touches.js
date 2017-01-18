var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var getRbTouchesForWeek = function(weekNumber){
	return new Promise(function(resolve, reject){
		// use thehuddle.com stats tables
		var finalUrl = 'http://thehuddle.com/stats/2016/plays_weekly.php?pos=RB&week=' + weekNumber + '&ccs=1';

		request(finalUrl, function(err, response, body) {
			// console.log('in request - ', body);
			if (err){
				console.log('error - ', err);
			}
			console.log('getRbTouchesForWeek status - ', response.statusCode);
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

				var touches = parseInt(children.eq(2).text().trim());
				var carries = parseInt(children.eq(4).text().trim());
				var catches = parseInt(children.eq(8).text().trim());
				
				// var targets = parseInt(children.eq(7).text().trim());
				// var catches = parseInt(children.eq(8).text().trim());
				var fantasyPts = parseInt(children.eq(3).text().trim());
				var pointsPerTouch = (fantasyPts / touches);
				// var ptsPerTarget = (fantasyPts / targets);
				
				var playerObj = {};
				playerObj['playerName'] = playerName;
				playerObj['rank'] = rank;
				playerObj['team'] = team;
				playerObj['touches'] = touches;
				playerObj['carries'] = carries;
				playerObj['catches'] = catches;
				playerObj['fantasyPoints'] = fantasyPts;
				playerObj['pointsPerTouch'] = pointsPerTouch;

				objectOfPlayers[playerName] = playerObj;

				arrayOfPlayers.push(playerObj);

				finalObj['objectOfPlayers'] = objectOfPlayers;
				finalObj['arrayOfPlayers'] = arrayOfPlayers;
			});
			// console.log('arrayOfPlayers - ', arrayOfPlayers[0]);
			// console.log('objectOfPlayers - ', objectOfPlayers['David Johnson']);
			// console.log('finalObj - ', finalObj.objectOfPlayers['David Johnson']);
			resolve(finalObj);
		});
	})
};

getRbTouchesForWeek(6)
	.then(function(data){
		console.log('RB touches - ', data);
	});
