module.exports = {
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
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * history page
  **/
  history: function(req, res) {
    res.render("manager/game_record.html", {});
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
  bulletinRecord: function(req, res) {
    res.render("manager/bulletin_record.html", {});
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
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * score record
  **/
  scoreRecord: function(req, res) {
    res.render("manager/score_record.html", {});
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * create user
  **/
  createUser: function(req, res) {
    res.render("manager/create_user.html", {});
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * user list page
  **/
  userList: function(req, res) {
    res.render("manager/user.html", {});
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * user info
  **/
  userInfo: function(req, res) {
    res.render("manager/user_message.html");
  }
};
