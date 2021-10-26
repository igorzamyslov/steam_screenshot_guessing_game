import request from "superagent";

class SteamService {
  static getAppData = (appId) => request.get(`/api/app/${appId}`);
  static getRandomAppData = () => request.get(`/api/app/random`);
}

export default SteamService;
