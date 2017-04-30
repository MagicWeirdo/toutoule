module.exports = {
  /**
   * @public
   * @param {$validator} $validator
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * search user
  **/
  searchUser: function($validator, $userService, req, res) {
    req.doAuth("admin", function(username) {
      req.readAsJson(function(data) {
        // register validations
        $validator.required("keyword", "keyword不能为空");
        $validator.notEmptyString("keyword", "keyword不能为空");

        // do validation
        $validator.validate(data, function(err) {
          if(err) {
            res.sendAsJson(400, {
              isError: true,
              errorMessage: err.msg,
              result: ""
            });
          }else {
            $userService.searchUser(data, function(usernames) {
              res.sendAsJson(200, {
                isError: false,
                errorMessage: "",
                result: {
                  list: usernames
                }
              });
            });
          }
        });
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
   * search game records
  **/
  searchGameRecords: function($validator, $gameService, req, res) {
    req.doAuth("admin", function(username) {
      req.readAsJson(function(data) {
        // register validation
        $validator.required("keyword", "keyword不能为空");
        $validator.notEmptyString("keyword", "keyword不能为空");

        // do validation
        $validator.validate(data, function(err) {
          if(err) {
            res.sendAsJson(400, {
              isError: true,
              errorMessage: err.msg,
              result: ""
            });
          }else {
            $gameService.searchGameRecords(data, function(records) {
              res.sendAsJson(200, {
                isError: true,
                errorMessage: "",
                result: {
                  list: records
                }
              });
            });
          }
        });
      });
    });
  }
};
