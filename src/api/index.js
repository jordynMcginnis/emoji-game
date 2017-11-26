const fakeFirebaseDatabase = {
  3296: {gameName : 'McGinnis Family', selectedTheme:'Elf', players: ['stacey','shawn','jordyn','tyler']},
  4567: {gameName : 'santa', selectedTheme:'christmasSongs', players: []},
}

//new game
function getRandomArbitrary(min, max) {
  return Math.floor( Math.random() * (max - min) + min);
}

export function createGame (theme, name) {
  const gameId = getRandomArbitrary(1000, 5000);
  fakeFirebaseDatabase[gameId] = { selectedTheme: theme, gameName: name, players : []}
}

export function getGameList () {
  return fakeFirebaseDatabase
}

export function getGame (id) {
  return fakeFirebaseDatabase[id]
}

export function saveUserName (id,name) {
  fakeFirebaseDatabase[id].players.push(name);
  //getTeamList(id);
}

export function getTeamList (id) {
    const playersList = fakeFirebaseDatabase[id].players;
    const team1 = [];
    const team2 = [];
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
    return teamList
}

export function emojiPickerPlayer (team) {
  //this will return the 2 names of the pickedPlayers
  //passes in the team they are in...
  return 'jordyn'
}

export function emojiWord () {
  return 'Santa Baby'
}

export function postEmoji (emoji) {

}
