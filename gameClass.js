
class Game {
    /*#################################################################
    Create a game container to locally store the players, balance, avatars etc
    Also will be used to make a local leaderboard
    #################################################################*/
    constructor(){
        this.players = [];
        this.leaders = [];
    }
    setupDealer(balance){
        this.players.push(new Player("computer","Dealer",balance));
    }
    loadPlayer(username){
    /*#################################################################
    Check if the username exists in the array of players, if not, create a 
    new player,If the player does exist, retrieve the playerObj
    #################################################################*/
        let currentPlayer;
        if (this.checkPlayerExists(username)){
            currentPlayer = this.player(username);
        } else{
            currentPlayer = this.createPlayer(username);
        }
        return currentPlayer;
    }
    checkPlayerExists(username){
        return this.players.some(player => player.username === username);//true or false
    }
    createPlayer(username){
        let newPlayer = new Player("player",username,5000);
        this.players.push(newPlayer);
        return newPlayer;
    }
    player(username){
        return this.players.find(player => player.username === username);
    }
    generateLeaderBoard(){
        this.leaders = [];
        for (let i = 1; i <this.players.length; i++){
            this.leaders.push([this.players[i].username, this.players[i].balance]);
        }
        return this.leaders.sort((a,b)=> b[1]-a[1]);
    }
}