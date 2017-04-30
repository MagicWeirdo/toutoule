module.exports = {
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * manager page
  **/
  manager: function(req, res) {
    // 重定向
    res.writeHead(302, {
      "Location": "/manager/login"
    });

    res.end();
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * login page
  **/
  login: function(req, res) {
    res.render("/manager/login.html", {});
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * modify password page
  **/
  modifyPassword: function(req, res) {
    res.render("/manager/password.html", {});
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * index page
  **/
  index: function(req, res) {
    res.render("manager/index.html", {});
  },
  /**
   * @public
   * @param {$gameService} $gameService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * history page
  **/
  history: function($gameService, req, res) {
    $gameService.countGameRounds(function(count) {
      res.render("manager/game_record.html", { count: Math.ceil(count / 5) });
    });
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * bulletin publish page
  **/
  bulletinPublish: function(req, res) {
    res.render("manager/bulletin_publish.html", {});
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * bulletin record page
  **/
  bulletinRecord: function($bulletinService, req, res) {
    $bulletinService.countBulletins(function(count) {
      res.render("manager/bulletin_record.html", { count : Math.ceil(count / 15) });
    });
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * score page
  **/
  score: function(req, res) {
    res.render("manager/score.html", {});
  },
  /**
   * @public
   * @param {$coinService} $coinService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * score record
  **/
  scoreRecord: function($coinService, req, res) {
    $coinService.countCoinRecords(function(count) {
      res.render("manager/score_record.html", { count: Math.ceil(count / 15) });
    });
  },
  /**
   * @public
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * create user
  **/
  createUser: function($userService, req, res) {
    $userService.getUserCount(function(count) {
      res.render("manager/create_user.html", { count : Math.ceil(count / 15) });
    });
  },
  /**
   * @public
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * user list page
  **/
  userList: function($userService, req, res) {
    $userService.getUserCount(function(count) {
      res.render("manager/user.html", { count: Math.ceil(count / 15) });
    });
  },
  /**
   * @public
   * @param {$gameService} $gameService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * user info
  **/
  userInfo: function($gameService, req, res) {
    $gameService.countUserGameRecords({
      username: req.queryParams.username
    }, function(count) {
      res.render("manager/user_message.html", { count: Math.ceil(count / 15) });
    });
  }
};
