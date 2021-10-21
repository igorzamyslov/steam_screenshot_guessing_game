import request from 'superagent';

class SteamService {
  async initAllApps () {
    const response = await request.get('/apps');
    // const response = await request.get('/api/apps');
    if (Array.isArray(response.body)) {
      this.apps = response.body;
    } else {
      this.apps = [];
    }
  }

  getAppData = (appId) => request.get(`/app/${appId}`);
}

export default new SteamService();
