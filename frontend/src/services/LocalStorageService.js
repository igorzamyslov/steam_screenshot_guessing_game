class LocalStorageService {
  static saveUsersNick = (usersNick) => {
    console.log("save nick");
    localStorage.setItem("usersNick", !!usersNick ? usersNick : "");
  };
  static getUsersNick = () => {
    const usersNick = localStorage.getItem("usersNick");
    if (!usersNick) {
      return "";
    }
    return usersNick;
  };
}

export default LocalStorageService;
