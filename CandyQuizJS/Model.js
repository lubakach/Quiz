const db = firebase.firestore();

export default {
    async getGames(){
        const snapshot = await db.collection("games").get();
        const games = [];
        snapshot.forEach((game) => {
            games.push(game.data());
        })
        return games;
    },
    async getGamesDic(){
        const snapshot = await db.collection("games").get();
        const games = {};
        snapshot.forEach((game) => {
            games[game.id] = game.data();
        })
        return games;
    },
    async putNewGame(data){
        const games = JSON.parse(localStorage.games);
        const date = new Date();
        const id = date.getFullYear().toString() +
            date.getMonth().toString() + date.getDate().toString() +
            date.getHours().toString() + date.getMinutes().toString();
        const game = {
            game_name: data.game_name,
            game_id: id,
            questions: []
        }
        games[id] = game;
        await db.collection("games").doc(id).set(game);
        localStorage.setItem('games', JSON.stringify(games));
        return id
    },
    async getQuestions(gameId){
        const games = await this.getGamesDic();
        return games[gameId].questions;
    },
    async putQuestions(gameId, questions){
        const games = this.getGamesDic()
        const game = games[gameId];
        game.questions = questions;
        await db.collection("games").doc(gameId).set(game);
        return games[gameId].questions.length;
    },
}