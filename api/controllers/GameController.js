module.exports = {
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * get the game page
  **/
  game: function(req, res) {
    res.render("index.html", {});
  },
  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * get the test page
  **/
  test: function(req, res) {
    res.render("test.html", {});
  }
};
