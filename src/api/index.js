import { firebasedb } from '../utils/config.js';

const fakeFirebaseDatabase = {
  3296: {gameName : 'McGinnis Family', selectedTheme:'Elf', players: ['stacey','shawn','jordyn','tyler'], emoji : { team1 : '😂', team2: '😂'}},
  4567: {gameName : 'santa', selectedTheme:'christmasSongs', players: [], emoji : { team1 : '', team2: ''}},
}

//new game
function getRandomArbitrary(min, max) {
  return Math.floor( Math.random() * (max - min) + min);
}

export function createGame (theme, name) {
  //const gameId = getRandomArbitrary(1000, 5000);
  //fakeFirebaseDatabase[gameId] = { selectedTheme: theme, gameName: name, players : []}
  const gameData = {
    name : name,
    theme: theme,
    teamAssign: false
  };
  //get random keyId
  const key = firebasedb.ref().child('games').push().key;
  var updates = {};
  updates['/games/' + key] = gameData;
  return firebasedb.ref().update(updates);


}

export function getGameList () {
  return fakeFirebaseDatabase
}

export function getGame (id) {
  return fakeFirebaseDatabase[id]
}

export function saveUserName (id, name) {
  //firebasedb.ref(`games/${id}/players`).push(name)
  const myName = name;
  const turn = { turn: false, name: myName }
  var checkvalue = firebasedb.ref(`games/${id}/teamAssign`).once('value').then(function(snapshot){
    const team1 = (snapshot.val())

    if(team1 === false){

      firebasedb.ref(`games/${id}/teams/team2`).push(turn);
      var updates = {};
      updates[`games/${id}/teamAssign`] = true;
      return firebasedb.ref().update(updates)
    } else {
      firebasedb.ref(`games/${id}/teams/team1`).push(turn);
      var updates = {};
      updates[`games/${id}/teamAssign`] = false;
      return firebasedb.ref().update(updates)
    }
  })
}

export function getTeamList (id) {
  /*
  const playersList = fakeFirebaseDatabase[id].players;
  let team1 = [];
  let team2 = [];
  let currentTeam = 'team1';
  for(var i = 0; i < playersList.length; i++){
    if(currentTeam === 'team1'){
      team1.push(playersList[i]);
      currentTeam = 'team2'
    } else {
      team2.push(playersList[i]);
      currentTeam = 'team1'
    }
  }

  const teamList = fakeFirebaseDatabase[id]['teams'] = { team1: team1, team2: team2};
  return teamList */
}

export function emojiPickerPlayer (id) {
  //this will return the 2 names of the pickedPlayers
  //passes in the team they are in...
  const team1Values = firebasedb.ref(`games/${id}/teams/team1`).once('value').then(function(snapshot){
    const team = snapshot.val();
    console.log('this is the team' + JSON.stringify(team));
    var count = 0;
    for(var key in team){
      if(count <= 0){
        if(team[key]['turn'] !== 'played'){
           const person = [key]
           console.log('p' + person);
           count++;
           //changed the person to be 'playing
           var updates = {};
           updates[`games/${id}/teams/team1/${person}/turn`] = 'playing';
           //console.log(updates[`games/${id}/teams/team1/${person}/name`])
           return firebasedb.ref().update(updates)
        }

      }
    }
  })
}

export function emojiWord () {
  return 'Santa Baby'
}

export function postEmoji (emoji1, team) {
  fakeFirebaseDatabase[3296]['emoji'][team] = emoji1
}

export function getEmoji (team) {
  return fakeFirebaseDatabase[3296]['emoji'][team]
}

export function addPoint (team) {
  console.log(team + ' gets a point!')
}