import { firebasedb } from '../utils/config.js';
import Themes from '../utils/themes.js';
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
    teamAssign: false,
    roundWinner: {team2: {winner: 'no-winner'}, team1: {winner: 'nothing'}},
    teamPoints: {team2: {point: 0}, team1: {point: 0}},
    themeActive: 1,
    themePast: { past : -2},
    playerAmount: 0,
    turnAmount : 0,
    play: 'waiting',
    startTime: 0
  };
  //get random keyId
  const key = firebasedb.ref().child('games').push().key;
  let updates = {};
  updates['/games/' + key] = gameData;
  return firebasedb.ref().update(updates);


}
export function themeInfo (id, themeLength) {

  const position = getRandomArbitrary(0, themeLength);
  const pastspots = firebasedb.ref(`games/${id}/themePast`).once('value').then((snapshot) => {
    const items = snapshot.val()
    for(var key in items){
      if(items[key] === position){
        themeInfo(id, themeLength)
      } else {
        console.log('good')
      }
    }
    let updates = {};
    updates[`games/${id}/themeActive`] = position;
    firebasedb.ref().update(updates);
    let updates2 = {};
    updates2[`games/${id}/themePast`] = {position: position};
    firebasedb.ref().update(updates2)
  })

}

export function getGameList () {
  return fakeFirebaseDatabase
}

export function getGame (id) {
  return fakeFirebaseDatabase[id]
}

export function saveUserName (id, name) {
  //firebasedb.ref(`games/${id}/players`).push(name)
  var players = firebasedb.ref(`games/${id}/playerAmount`).once('value').then(function(snapshot1){
    const amount = snapshot1.val() + 1;
    const updates1 = {};
    updates1[`games/${id}/playerAmount`] = amount;
    firebasedb.ref().update(updates1)
  })

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
    console.log('player1 should be here:' + team)
    //console.log('this is the team' + JSON.stringify(team));
    let stillPlaying: true
    let count = 0;
    for(var key in team){
      if(count <= 0){
        if(team[key]['turn'] !== 'played'){
           const person = [key]
           //console.log('p' + person);
           count++;
           //changed the person to be 'playing
           var updates = {};
           updates[`games/${id}/teams/team1/${person}/turn`] = 'playing';
           //console.log(updates[`games/${id}/teams/team1/${person}/name`])
           return firebasedb.ref().update(updates)
        }
      }
    }
    //count === 0 ? endGame(id) : console.log('should still playing')
  })
  const team2Values = firebasedb.ref(`games/${id}/teams/team2`).once('value').then(function(snapshot){
    const team = snapshot.val();
    //console.log('this is the team' + JSON.stringify(team));
    console.log('player2 should be here:' + team)
    var count = 0;
    for(let key in team){
      if(count <= 0){
        if(team[key]['turn'] !== 'played'){
           const person = [key]
           //console.log('p' + person);
           count++;
           //changed the person to be 'playing
           var updates = {};
           updates[`games/${id}/teams/team2/${person}/turn`] = 'playing';
           //console.log(updates[`games/${id}/teams/team1/${person}/name`])
           return firebasedb.ref().update(updates)
        }

      }
    }
    //count === 0 ? endGame(id) : console.log('should still playing')
  })
  return finalCheck()
}

export function emojiWord (id) {
  const theme = firebasedb.ref(`games/${id}/theme`).once('value').then((snapshot) => {
    const value = snapshot.val();
  })

}

export function postEmoji (emoji, team, id) {
  const updates = {};
  updates[`games/${id}/teamEmoji/${team}`] = {emoji};
  return firebasedb.ref().update(updates);
}

export function addPoint (winner, team, id) {
  var updates = {};
  updates[`games/${id}/roundWinner/${team}`] = {winner};
  firebasedb.ref().update(updates);
  checkPoint(id)
}

export function checkPoint (id) {
  const winnercheck = firebasedb.ref(`games/${id}/roundWinner/`)
  winnercheck.on('value', (snapshot) => {
    const team1 = snapshot.val().team1.winner;
    const team2 = snapshot.val().team2.winner;
    if(team1 === team2){
      const pastPoints = firebasedb.ref(`games/${id}/teamPoints/${team1}/point`).once('value').then((snapshot1) => {
        const currentPoint = snapshot1.val();
        const winUpdate = {};
        const point = currentPoint + 1;
        winUpdate[`games/${id}/teamPoints/${team1}`] = {point}
        firebasedb.ref().update(winUpdate);

        const team1Update = {};
        team1Update[`games/${id}/roundWinner/team1/winner`] = 'nothing'
        firebasedb.ref().update(team1Update);
        const team2Update = {};
        team1Update[`games/${id}/roundWinner/team2/winner`] = 'notsure'
        firebasedb.ref().update(team2Update);

        var playersTurn = firebasedb.ref(`games/${id}/turnAmount`).once('value').then(function(snapshot1){
        const amount1 = snapshot1.val() + 2;
        const updates2 = {};
        updates2[`games/${id}/turnAmount`] = amount1;
        firebasedb.ref().update(updates2)
        })

      const amount = firebasedb.ref(`games/${id}/playerAmount`).once('value').then((snapshot) => {
        const totalAmount = snapshot.val()
        const turnAmount = firebasedb.ref(`games/${id}/turnAmount`).once('value').then((snapshot1) => {
          const totalTurn = snapshot1.val();
          if(totalAmount === totalTurn){
            endGame(id, 'end')
          }
        })
      })


        newMove(id);
      })
    }
  })

}

export function newMove (id) {
  const playerStatus = firebasedb.ref(`games/${id}/teams/team1`).once('value').then((snapshot) => {
    const items = snapshot.val();
    for(let key in items){
      if(items[key]['turn'] === 'playing'){
        const player = [key]
        console.log(player)
        const updates = {};
        updates[`games/${id}/teams/team1/${player}/turn`] = 'played'
        firebasedb.ref().update(updates);

      } else {
        console.log('not playing' + items[key].name)
      }
    }
  })
    const player2Status = firebasedb.ref(`games/${id}/teams/team2`).once('value').then((snapshot) => {

    const items = snapshot.val();
    for(let key in items){
      if(items[key]['turn'] === 'playing'){
        const player = [key]
        console.log(player)
        const updates = {};
        updates[`games/${id}/teams/team2/${player}/turn`] = 'played'
        firebasedb.ref().update(updates);
        return emojiPickerPlayer(id)
      } else {
        console.log('not playing' + items[key].name)
      }
    }
  })
  console.log('this ran');
}

export function finalCheck (id) {
  return false
}

export function endGame (id) {
  console.log('end game has ran')
  const updates = {};
  updates[`games/${id}/play`] = false;
  firebasedb.ref().update(updates)
}

