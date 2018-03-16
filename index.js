const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

// load values from the .env file in this directory into process.env
dotenv.load();

// configure firebase
firebase.initializeApp({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const db = firebase.database();

// configure algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);
 var teams = {"teams": []};
 var players = {"players" : []};
var ref = db.ref("/users/");
ref.on("child_removed", deleteIndexRecord);


  ref.on("child_added", function (userss) {
  var userkey = userss.key;
  var teamref = db.ref("/users/" + userkey + "/teams");
    teamref.on("child_added", function(teamss) {
      var teamkey = teamss.key;
      var teamdata = teamss.val();
	    var fullreference = "/users/" + userkey + "/teams/" + teamkey;
      var teamobj = { 
          "name" : teamdata.name,
          "location" : teamdata.location,
          "school" : teamdata.school,
		      "reference" : fullreference
      };
    
      teamobj.objectID = teamkey;
      teams.teams.push(teamobj);
      var seasonref = db.ref("/users/" + userkey + "/teams/" + teamkey);
      seasonref.on("child_added", function(seasonss) {
        if (seasonss.key.includes("season_")) {
          var seasonkey = seasonss.key;
          var playerref = db.ref("/users/" + userkey + "/teams/" + teamkey + "/" + seasonkey + "/players/");
          playerref.on("child_added", function(playerss) {
            playerkey = playerss.key;
            playerdata = playerss.val();
		        fullreference = "/users/" + userkey + "/teams/" + teamkey + "/" + seasonkey + "/players/" + playerkey;
            var playerobj = {
              "name" : playerdata.firstname + " " + playerdata.lastname,
              "number" : playerdata.number,
              "school" : teamdata.school,
              "location" : teamdata.location,
	             "reference" : fullreference
            };
            playerobj.objectID = playerkey;
            players.players.push(playerobj);
          });
        }
      });
    });

//You MUST use objectID in order to push it to Algolio. the objectID takes the key and  push it there.
// ObjectID should be: objectID = teamkey, objectID = playerskey
// below is the the json you created. then attatched the objectID that push the first node of userkey.
// Essentially, we should have multiple push for eahc objectID for team & players, but we need to add the the location
// and the school displaying too.

// Add or update new objects
//console.log(teams);
//console.log(players);
  index
    .saveObjects(teams.teams)
    .then(() => {
      console.log('Team/Players imported into Algolia');
    })
    .catch(error => {
      console.error('Error when importing contact into Algolia', error);
      process.exit(1);
    });


  index
    .saveObjects(players.players)
    .then(() => {
      console.log('Team/Players imported into Algolia');
    })
    .catch(error => {
      console.error('Error when importing contact into Algolia', error);
      process.exit(1);
    });
});


function deleteIndexRecord(contact) {
  const objectID = contact.key;
index
    .deleteObject(objectID)
    .then(() => {
      console.log('Firebase object deleted from Algolia', objectID);
    })
    .catch(error => {
      console.error('Error when deleting contact from Algolia', error);
      process.exit(1);
    });

}