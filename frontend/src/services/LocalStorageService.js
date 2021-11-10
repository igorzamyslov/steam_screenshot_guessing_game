

class LocalStorageService {
  static saveUserInfo = (userInfo) => {
    localStorage.setItem("userInfo", userInfo)
  }
  static getUserInfo = () => {
    const userInfo =  localStorage.getItem("userInfo")
    if(!userInfo){
      return {}
    }
    return localStorage.getItem("userInfo")
  }

}

export default LocalStorageService;
