import request from 'superagent';

const anyOriginsProxyURL = 'https://api.allorigins.win/raw?url='

const getAnyOriginURL = (url) => `${anyOriginsProxyURL}${url}`

class SteamService {
    async initAllApps() {
        const url = getAnyOriginURL('https://api.steampowered.com/ISteamApps/GetAppList/v2')
        const response = await request.get(url)
        this.apps = response.body.applist.apps;
    }

    getAppScreenshots(appId) {
        console.log(this.apps)
    }
}

export default new SteamService()