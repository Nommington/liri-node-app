require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var spotify = require("node-spotify-api");
var twitter = require('twitter');
var inquirer = require("inquirer");
var fs = require("fs");
var empty = false;
var input = process.argv;
var boringOper = input[2];
//construct boringParam
var boringParam = "";
for (i = 3; i < input.length; i++) {
    boringParam = boringParam + " " + input[i];
}

var sptfy = new spotify(keys.spotify);
var client = new twitter(keys.twitter);


function boring() {
    console.log("");
    console.log("You did it the boring way.");
    console.log("Try just typing 'node liri'.");
    console.log("");
}

function interesting() {
    console.log("Welcome to LIRI!");
    console.log("");
    console.log("LIRI is a Language Interpretation and Recognition Interface using NodeJS.");
    console.log("");
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which of LIRI's functions would you like to utilize?",
                choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
                name: "oper"
            },
            {
                type: "input",
                message: "Please type the Twitter handle/movie/song you would like LIRI to search.",
                name: "param"
            }
        ]).then(function (inquirerResponse) {
            var interestingOper = inquirerResponse.oper;
            var interestingParam = inquirerResponse.param;
            if (interestingParam == ""){
                empty = true;
            }
            doTheThing(interestingOper, interestingParam);
        });
}

function doTheThing(oper, param) {
    fs.appendFile("log.txt", oper + " - " + param, function(err){
        if (err) throw err;
        console.log(oper + param);
    })
    switch (oper) {
        case "my-tweets":
            if (empty) {
                console.log("Since you didn't specify, please enjoy some stupid old tweets from LIRI's creator's old account.");
                console.log("He is very sorry.");
                console.log("");
                param = "hringtnid";
            }
            var handle = { screen_name: param };
            console.log("Here are the 20 most recent tweets by @" + param + ":");
            console.log("");
            client.get('statuses/user_timeline', handle, function (error, tweets, response) {
                if (!error) {
                    for (i = 0; i < 20; i++) {
                        console.log(tweets[i].text);
                    }
                }
            });
            break;
        case "spotify-this-song":
            if (empty) {
                console.log("Since you didn't specify, per assignment instructions, here is info on a catchy song written by a band who were likely actual Nazis. Look it up.");
                console.log("LIRI is very sorry.");
                console.log("");
                param = "I saw the sign";
            }
            sptfy.search({ type: 'track', query: param }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                //console.log(JSON.stringify(data.tracks.items[0], null, 2));
                console.log("Song Name: " + JSON.stringify(data.tracks.items[0].name));
                console.log("Artist: " + JSON.stringify(data.tracks.items[0].album.artists[0].name));
                console.log("Album of Origin: " + JSON.stringify(data.tracks.items[0].album.name));
                console.log("Preview URL: " + JSON.stringify(data.tracks.items[0].preview_url));
            });
            break;
        case "movie-this":
            if (empty) {
                console.log("Since you didn't specify, here is info for a movie about somebody who is nobody. LIRI's creator hasn't seen it.");
                console.log("He is very sorry.");
                console.log("");
                param = "mr nobody";
            }
            request("http://www.omdbapi.com/?apikey=trilogy&t=" + param, function (error, response, body) {
                //console.log("error:", error);
                var movie = JSON.parse(body);
                console.log("Movie Title: " + movie.Title);
                console.log("Year of Release: " + movie.Year);
                for (i = 0; i < movie.Ratings.length; i++) {
                    console.log("Rating on " + movie.Ratings[i].Source + ": " + movie.Ratings[i].Value);
                }
                console.log("Country of Origin: " + movie.Country);
                console.log("Language: " + movie.Language);
                console.log("");
                console.log("Plot Synopsis:");
                console.log(movie.Plot);
                console.log("");
                console.log("Principle Cast:");
                console.log(movie.Actors);
            });
            break;
        case "do-what-it-says":
            console.log("You've ceded control to LIRI. Was that wise?");
            console.log("Your search parameters, if you entered any, are irrelevant.");
            console.log("LIRI will display information about one of LIRI creator's favorite movies.");
            console.log("");
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (!error) {
                    var inputArr = data.split(",");
                    empty = false;
                    doTheThing(inputArr[0], inputArr[1]);
                }
            });
            break;
    }
}

if (input.length > 2) {
    boring();
    if (input.length == 3) {
        empty = true;
    }
    doTheThing(boringOper, boringParam);
}
else if (input.length == 2) {
    interesting();
}

