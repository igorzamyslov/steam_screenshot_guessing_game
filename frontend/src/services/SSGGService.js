import request from "superagent";

class SSGGService {
  static getRandomAppData = () => request.get("/api/app/random");
  static getQuizRandomAppData = () => request.get("/api/quiz/random");
  static getLeaderboard = () => request.get("/api/leaderboard");
  // temporary, until backend is smarter
  static updateLeaderboard = (user, score) =>
    request.post(`/api/update_leaderboard?name=${user}&score=${score}`);
}

export default SSGGService;
