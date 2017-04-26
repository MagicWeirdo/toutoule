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
   * count game records
  **/
  countGameRecords: function($gameService, req, res) {
    req.doAuth("admin", function(username) {
      $gameService.countGameRecords(function(count) {
        res.sendAsJson(200, {
          isError: false,
          errorMessage: "",
          result: {
            count: count
          }
        });
      });
    });
  },
  /**
   * @public
   * @param {$validator} $validator
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * list game records
  **/
  listGameRecords: function($validator, $gameService, req, res) {
    req.doAuth("admin", function(username) {
      var data = {
        start: Number.parseInt(req.queryParams.start),
        end: Number.parseInt(req.queryParams.end)
      };

      // register validations
      $validator.required("start", "start不能为空");
      $validator.required("end", "end不能为空");

      // do validation
      $validator.validate(data, function(err) {
        if(err) {
          res.sendAsJson(400, {
            isError: true,
            errorMessage: err.msg,
            result: ""
          });
        }else {
          $gameService.listGameRecords(data, function(records) {
            res.sendAsJson(200, {
              isError: false,
              errorMessage: "",
              result: {
                list: records
              }
            });
          });
        }
      });
    });
  },
  /**
   * @public
   * @param {$validator} $validator
   * @param {$gameService} $gameService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * list game records of an user
  **/
  listUserGameRecords: function($validator, $gameService, req, res) {
    req.doAuth("admin", function(username) {
      var data = {
        username: req.queryParams.username,
        start: Number.parseInt(req.queryParams.start),
        end: Number.parseInt(req.queryParams.end)
      };

      // register validations
      $validator.required("username", "username不能为空");
      $validator.notEmptyString("username", "username不能为空");
      $validator.required("start", "start不能为空");
      $validator.required("end", "end不能为空");

      // do validation
      $validator.validate(data, function(err) {
        if(err) {
          res.sendAsJson(400, {
            isError: true,
            errorMessage: err.msg,
            result: ""
          });
        }else {
          $gameService.listUserGameRecords(data, function(records) {
            res.sendAsJson(200, {
              isError: false,
              errorMessage: "",
              result: {
                list: records
              }
            });
          });
        }
      });
    });
  },
  /**
   * @public
   * @param {$validator} $validator
   * @param {$coinService} $coinService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * list game records of an user
  **/
  listCoinRecords: function($validator, $coinService, req, res) {
    req.doAuth("admin", function(username) {
      var data = {
        start: Number.parseInt(req.queryParams.start),
        end: Number.parseInt(req.queryParams.end)
      };

      // register validations
      $validator.required("start", "start不能为空");
      $validator.required("end", "end不能为空");

      // do validation
      $validator.validate(data, function(err) {
        if(err) {
          res.sendAsJson(400, {
            isError: true,
            errorMessage: err.msg,
            result: ""
          });
        }else {
          $coinService.listCoinRecords(data, function(records) {
            res.sendAsJson(200, {
              isError: false,
              errorMessage: "",
              result: {
                list: records
              }
            });
          });
        }
      });
    });
  }
};
