//constructor class for the user
class player {
    constructor(username,hand,balance,bet,totalWinnings,totalLosses,games){
        this.username = username;
        this.hand = hand;
        this.balance = balance;
        this.bet = bet;
        this.totalWinnings = totalWinnings;
        this.totalLosses = totalLosses;
        this.games = games;
    }
    getSummary(){
        return `${this.username} over ${this.games} games has won £${this.totalWinnings} and lost £${this.totalLosses}. Current Balance is £${this.balance}`;
    }
};
//Container class for all the players
class Players{
    constructor(){
        this.players = [];
        this.leaders = [];
    }
    checkPlayerExists(username){
    }
    newPlayer(username){
    }
    loadPlayer(username){
    }
    playerID(username){
    }
    leaderBoard(){
    }
}