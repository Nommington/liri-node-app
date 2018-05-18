require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var spotify = require("node-spotify-api");
var twitter = require('twitter');

var operator = process.argv[2];
var param = process.argv[3];
var vanilla = true;
var sptfy = new spotify(keys.spotify);
var client = new twitter(keys.twitter);

//console.log(spotify);
//console.log(client);

switch (operator){
    case "my-tweets":
        //console.log("tweet tweet");
        var params = {screen_name: 'hringtnid'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i=0; i<20; i++){
            console.log(tweets[i].text);
      }
  }
}).Then(boring());
    break;
    case "spotify-this-song":
        //console.log("music");
        sptfy.search({ type: 'track', query: param }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }           
          //console.log(JSON.stringify(data.tracks.items[0], null, 2));
          console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name));
          console.log(JSON.stringify(data.tracks.items[0].album.name));
          console.log(JSON.stringify(data.tracks.items[0].preview_url));
          }).Then(boring());
    break;
    case "movie-this":
        //console.log("motion picture movies!");
        request("http://www.omdbapi.com/?apikey=trilogy&t="+param, function (error, response, body){
            //console.log("error:", error);
            var movie = JSON.parse(body);
            console.log(movie.Title);
            console.log(movie.Year);
            for (i=0; i<movie.Ratings.length; i++){
                console.log(movie.Ratings[i].Source);
                console.log(movie.Ratings[i].Value);
            }
            console.log(movie.Country);
            console.log(movie.Language);
            console.log(movie.Plot);
            console.log(movie.Actors);
        }).Then(boring());
    break;
    case "do-what-it-says":
        console.log("do that thing");
    break;
    }
    function boring(){
        if (vanilla){
            console.log("You did it the boring way.");
            console.log("Try just typing 'node liri'.");
        }
    }

