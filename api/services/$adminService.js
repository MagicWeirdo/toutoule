module.exports = {
  scope: "singleton",
  name: "$adminService",
  factory: function($orm2, $authService) {
    return {
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * admin login
      **/
      login: function(option, callback) {
        var username = option.username;
        var password = option.password;

        $orm2.query(function(models) {
          var User = models.User;

          // find the admin
          User.one({
            username: username,
            password: password,
            type: "admin"
          }, function(err, admin) {
            if(err) {
              throw err;
            }

            // check if the admin exists or not
            if(admin === null) {
              callback("用户名或密码错误");
            }else {
              // create a new token
              $authService.createToken({
                username: username,
                type: "admin"
              }, function(apiToken) {
                callback(null, apiToken);
              });
            }
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * modify admin password
      **/
      modifyPasword: function(option, callback) {
        var username = option.username;
        var oldPassword = option.oldPassword;
        var newPassword = option.newPassword;

        $orm2.query(function(models) {
          var User = models.User;

          // find the user
          User.one({
            username: username
          }, function(err, user) {
            if(err) {
              throw err;
            }

            // check if the user exists
            if(user === null) {
              callback("用户不存在");
            }else {
              // check the old password
              if(oldPassword !== user.password) {
                callback("旧密码不正确");
              }else {
                user.password = newPassword;
                user.save(function(err) {
                  if(err) {
                    callback(err.msg);
                  }else {
                    callback();
                  }
                });
              }
            }
          });
        });
      }
    };
  }
};
