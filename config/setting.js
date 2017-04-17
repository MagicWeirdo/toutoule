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
    { method: "GET", url: "/test", action: "GameController.test" },

    // business logic
    { method: "GET", url: "/", action: "GameController.game" },
    { method: "POST", url: "/admin/login", action: "AdminController.login" },
    { method: "POST", url: "/admin/modifyPassword", action: "AdminController.modifyPassword" },
    { method: "GET", url: "/admin/bulletin/list", action: "AdminController.listBulletins" },
    { method: "POST", url: "/user/login", action: "UserController.login" },
    { method: "POST", url: "/user/modifyPassword", action: "UserController.modifyPassword" },
    { method: "GET", url: "/user/generate", action: "UserController.generateUser" },
    { method: "GET", url: "/user/count", action: "UserController.getUserCount" },
    { method: "GET", url: "/user/list", action: "UserController.listUsers" },
    { method: "POST", url: "/user/extra", action: "UserController.saveUserExtra" }
  ],
  models: [
    "Admin",
    "Bulletin",
    "User"
  ],
  services: [
    "$adminService",
    "$authService",
    "$bulletinService",
    "$userService"
  ],
  files: [

  ]
};
