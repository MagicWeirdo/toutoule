module.exports = {
  debug: true,
  hostname: "0.0.0.0",
  port: 8080,
  static_root: "/static/",
  enable_websocket: true,
  database: {
    driver: "mysql",
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "wamysys5054362",
    database: "gamble"
  },
  middlewares: [
    "$authMiddleware"
  ],
  actions: [
    // game side
    { method: "GET", url: "/", action: "GameController.game" },
    { method: "GET", url: "/manager", action: "AdminController.getPage" },
    { method: "POST", url: "/admin/login", action: "AdminController.login" },
    { method: "POST", url: "/admin/verify", action: "AdminController.verify" },
    { method: "POST", url: "/admin/modifyPassword", action: "AdminController.modifyPassword" },
    { method: "GET", url: "/admin/bulletin/list", action: "AdminController.listBulletins" },
    { method: "POST", url: "/user/login", action: "UserController.login" },
    { method: "POST", url: "/user/modifyPassword", action: "UserController.modifyPassword" },
    { method: "GET", url: "/user/generate", action: "UserController.generateUser" },
    { method: "GET", url: "/user/count", action: "UserController.getUserCount" },
    { method: "GET", url: "/user/list", action: "UserController.listUsers" },
    { method: "GET", url: "/user/info", action: "UserController.getUserInfo" },
    { method: "POST", url: "/user/extra", action: "UserController.saveUserExtra" },
    { method: "POST", url: "/user/coin/topup", action: "UserController.topUpCoin" },
    { method: "GET", url: "/user/coin/amount", action: "UserController.getUserCoinAmount" },

    // management
    { method: "GET", url: "/manager/login", action: "ManagerController.login" },
    { method: "GET", url: "/manager/modifyPassword", action: "ManagerController.modifyPassword" },
    { method: "GET", url: "/manager/main", action: "ManagerController.index" }
  ],
  models: [
    "Admin",
    "Bulletin",
    "GameRecord",
    "GameRound",
    "User"
  ],
  services: [
    "$adminService",
    "$authService",
    "$bulletinService",
    "$dateUtils",
    "$gameService",
    "$stateMachine",
    "$userService"
  ],
  files: [

  ]
};
