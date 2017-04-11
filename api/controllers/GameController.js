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
  }
};
