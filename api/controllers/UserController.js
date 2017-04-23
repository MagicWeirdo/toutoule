module.exports = {
  /**
   * @public
   * @param {$validator} $validator
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * login
  **/
  login: function($validator, $userService, req, res) {
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
          $userService.login(data, function(err, token) {
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
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * modify password
  **/
  modifyPassword: function($validator, $userService, req, res) {
    req.readAsJson(function(data) {
      // register validations
      $validator.required("username", "用户名不能为空");
      $validator.notEmptyString("username", "用户名不能为空");
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
          $userService.modifyPassword(data, function(err) {
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
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * generate a new user
  **/
  generateUser: function($userService, req, res) {
    req.doAuth("admin", function(username) {
      $userService.generateUser(function(userInfo) {
        res.sendAsJson(200, {
          isError: false,
          errorMessage: "",
          result: userInfo
        });
      });
    });
  },
  /**
   * @public
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * get the count of users
  **/
  getUserCount: function($userService, req, res) {
    req.doAuth("admin", function(username) {
      $userService.getUserCount(function(userCount) {
        res.sendAsJson(200, {
          isError: false,
          errorMessage: "",
          result: {
            count: userCount
          }
        });
      });
    });
  },
  /**
   * @public
   * @param {$validator} $validator
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * list users
  **/
  listUsers: function($validator, $userService, req, res) {
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
          $userService.listUsers(data, function(users) {
            res.sendAsJson(200, {
              isError: false,
              errorMessage: "",
              result: {
                list: users
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
   * get user
  **/
  getUserInfo: function($validator, $userService, req, res) {
    req.doAuth("admin", function(username) {
      var data = {
        username: req.queryParams.username
      };

      // register validations
      $validator.required("username", "username不能为空");
      $validator.notEmptyString("username", "username不能为空");

      // do validation
      $validator.validate(data, function(err) {
        if(err) {
          res.sendAsJson(200, {
            isError: true,
            errorMessage: err.msg,
            result: ""
          });
        }else {
          $userService.getUserInfo(data, function(err, userInfo) {
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
                result: userInfo
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
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * save user extra
  **/
  saveUserExtra: function($validator, $userService, req, res) {
    req.doAuth("admin", function(username) {
      req.readAsJson(function(data) {
        // register validations
        $validator.required("userId", "userId不能为空");
        $validator.required("extra", "extra不能为空");

        // do validation
        $validator.validate(data, function(err) {
          if(err) {
            res.sendAsJson(200, {
              isError: true,
              errorMessage: err.msg,
              result: ""
            });
          }else {
            $userService.saveUserExtra(data, function(err) {
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
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * top up coin
  **/
  topUpCoin: function($validator, $userService, req, res) {
    req.doAuth("admin", function(username) {
      req.readAsJson(function(data) {
        // register validations
        $validator.required("username", "用户名不能为空");
        $validator.notEmptyString("username", "用户名不能为空");
        $validator.required("amount", "金额不能为空");

        // do validation
        $validator.validate(data, function(err) {
          if(err) {
            res.sendAsJson(200, {
              isError: true,
              errorMessage: err.msg,
              result: ""
            });
          }else {
            $userService.topUpCoin(data, function(err) {
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
   * @param {$userService} $userService
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @desc
   * get user coin amount
  **/
  getUserCoinAmount: function($userService, req, res) {
    req.doAuth("normal", function(username) {
      $userService.getUserCoinAmount({
        username: username
      }, function(err, coin) {
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
              coin: coin
            }
          });
        }
      });
    });
  }
};
