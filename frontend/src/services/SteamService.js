import request from 'superagent';

class SteamService {
    async initAllApps() {
        const response = await request.get('/api/apps')
        this.apps = response.body;
    }

    getAppScreenshots(appId) {
        console.log(this.apps, appId)
    }
}

export default new SteamService()
