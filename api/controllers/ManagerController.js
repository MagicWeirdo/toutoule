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
  }
};
