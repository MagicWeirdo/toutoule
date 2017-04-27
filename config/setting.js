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
    // test
    { method: "GET", url: "/test", action: "TestController.test" },

    // game side
    { method: "GET", url: "/", action: "GameController.game" },
    { method: "POST", url: "/admin/login", action: "AdminController.login" },
    { method: "POST", url: "/admin/verify", action: "AdminController.verify" },
    { method: "POST", url: "/admin/modifyPassword", action: "AdminController.modifyPassword" },
    { method: "GET", url: "/admin/bulletin/list", action: "AdminController.listBulletins" },
    { method: "POST", url: "/user/login", action: "UserController.login" },
    { method: "POST", url: "/user/modifyPassword", action: "UserController.modifyPassword" },
    { method: "GET", url: "/user/generate", action: "UserController.generateUser" },
    { method: "GET", url: "/user/count", action: "UserController.getUserCount" },
    { method: "GET", url: "/user/list", action: "UserController.listUsers" },
    { method: "GET", url: "/user/list/simple", action: "UserController.listUserSimple" },
    { method: "GET", url: "/user/info", action: "UserController.getUserInfo" },
    { method: "POST", url: "/user/extra", action: "UserController.saveUserExtra" },
    { method: "POST", url: "/user/coin/topup", action: "UserController.topUpCoin" },
    { method: "POST", url: "/user/coin/bottomdown", action: "UserController.bottomDown" },
    { method: "GET", url: "/user/coin/amount", action: "UserController.getUserCoinAmount" },
    { method: "POST", url: "/user/state/activate", action: "UserController.activateUser" },
    { method: "POST", url: "/user/state/deactivate", action: "UserController.deactivateUser" },
    { method: "GET", url: "/game/history/user/list", action: "GameController.listUserGameRecords" },
    { method: "GET", url: "/game/history/list/count", action: "GameController.countGameRecords" },
    { method: "GET", url: "/game/history/list", action: "GameController.listGameRecords" },
    { method: "GET", url: "/coin/history/list", action: "GameController.listCoinRecords" },

    // management
    { method: "GET", url: "/manager/login", action: "ManagerController.login" },
    { method: "GET", url: "/manager/modifyPassword", action: "ManagerController.modifyPassword" },
    { method: "GET", url: "/manager/main", action: "ManagerController.index" },
    { method: "GET", url: "/manager/history", action: "ManagerController.history" },
    { method: "GET", url: "/manager/bulletin/publish", action: "ManagerController.bulletinPublish" },
    { method: "GET", url: "/manager/bulletin/record", action: "ManagerController.bulletinRecord" },
    { method: "GET", url: "/manager/score", action: "ManagerController.score" },
    { method: "GET", url: "/manager/score/record", action: "ManagerController.scoreRecord" },
    { method: "GET", url: "/manager/user/create", action: "ManagerController.createUser" },
    { method: "GET", url: "/manager/user/list", action: "ManagerController.userList" },
    { method: "GET", url: "/manager/user/info", action: "ManagerController.userInfo" }
  ],
  models: [
    "Admin",
    "Bulletin",
    "CoinRecord",
    "GameRecord",
    "GameRound",
    "User"
  ],
  services: [
    "$adminService",
    "$authService",
    "$bulletinService",
    "$coinService",
    "$gameService",
    "$stateMachine",
    "$userService",
    "$utils"
  ],
  files: [

  ]
};
