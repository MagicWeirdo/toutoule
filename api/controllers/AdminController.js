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
          res.sendAsJson(400, {
            isError: true,
            errorMessage: err.msg,
            result: ""
          });
        }else {
          $adminService.login(data, function(err, apiToken) {
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
                result: apiToken
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
            res.sendAsJson(400, {
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
  }
};
