module.exports = {
  /**
   * @public
   * @param {$validator} $validator
   * @param {$adminService} $adminService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * admin login
  **/
  login: function($validator, $adminService, req, res) {
    req.readAsJson(function(data) {
      // register validations
      $validator.required("username", "用户名不能为空");
      $validator.notEmptyString("username", "用户名不能为空");
      $validator.required("password", "密码不能为空");
      $validator.notEmptyString("password", "密码不能为空");

      // do validation
      $validator.validate(data, function(err) {
        if(err) {
          res.sendAsJson(200, {
            isError: true,
            errorMessage: err.msg,
            result: ""
          });
        }else {
          $adminService.login(data, function(err, token) {
            if(err) {
              res.sendAsJson(200, {
                isError: true,
                errorMessage: err,
                result: ""
              });
            }else {
              res.sendAsJson(200, {
                isError: false,
                errorMessage: "",
                result: {
                  token: token
                }
              });
            }
          });
        }
      });
    });
  },
  /**
   * @public
   * @param {$validator} $validator
   * @param {$authService} $authService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * verify token
  **/
  verify: function($validator, $authService, req, res) {
    req.readAsJson(function(data) {
      // register validations
      $validator.required("token", "密匙不能为空");
      $validator.notEmptyString("token", "密匙不能为空");

      // do validation
      $validator.validate(data, function(err) {
        if(err) {
          res.sendAsJson(400, {
            isError: true,
            errorMessage: err.msg,
            result: ""
          });
        }else {
          $authService.verify({
            token: data.token,
            type: "admin"
          }, function(err, username) {
            if(err) {
              res.sendAsJson(200, {
                isError: true,
                errorMessage: err,
                result: ""
              });
            }else {
              res.sendAsJson(200, {
                isError: false,
                errorMessage: "",
                result: ""
              });
            }
          });
        }
      });
    });
  },
  /**
   * @public
   * @param {$validator} $validator
   * @param {$adminService} $adminService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * modify admin password
  **/
  modifyPassword: function($validator, $adminService, req, res) {
    req.doAuth("admin", function(username) {
      req.readAsJson(function(data) {
        // register validations
        $validator.required("oldPassword", "旧密码不能为空");
        $validator.notEmptyString("oldPassword", "旧密码不能为空");
        $validator.required("newPassword", "新密码不能为空");
        $validator.notEmptyString("newPassword", "新密码不能为空");

        // do validation
        $validator.validate(data, function(err) {
          if(err) {
            res.sendAsJson(200, {
              isError: true,
              errorMessage: err.msg,
              result: ""
            });
          }else {
            $adminService.modifyPasword({
              username: username,
              oldPassword: data.oldPassword,
              newPassword: data.newPassword
            }, function(err) {
              if(err) {
                res.sendAsJson(200, {
                  isError: true,
                  errorMessage: err,
                  result: ""
                });
              }else {
                res.sendAsJson(200, {
                  isError: false,
                  errorMessage: "",
                  result: ""
                });
              }
            });
          }
        });
      });
    });
  },
  /**
   * @public
   * @param {$validator} $validator
   * @param {$bulletinService} $bulletinService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * list bulletins
  **/
  listBulletins: function($validator, $bulletinService, req, res) {
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
          res.sendAsJson(200, {
            isError: true,
            errorMessage: err.msg,
            result: ""
          });
        }else {
          $bulletinService.listBulletinsFormated(data, function(bulletins) {
            res.sendAsJson(200, {
              isError: false,
              errorMessage: "",
              result: {
                list: bulletins
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
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * remove a bulletin
  **/
  removeBulletin: function($validator, $bulletinService, req, res) {
    req.doAuth("admin", function(username) {
      req.readAsJson(function(data) {
        // register validations
        $validator.required("bulletinId", "bulletinId不能为空");

        // do validation
        $validator.validate(data, function(err) {
          if(err) {
            res.sendAsJson(400, {
              isError: true,
              errorMessage: err.msg,
              result: ""
            });
          }else {
            $bulletinService.removeBulletin(data, function(err) {
              if(err) {
                res.sendAsJson(200, {
                  isError: true,
                  errorMessage: err,
                  result: ""
                });
              }else {
                res.sendAsJson(200, {
                  isError: false,
                  errorMessage: "",
                  result: ""
                });
              }
            });
          }
        });
      });
    });
  }
};
