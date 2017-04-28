module.exports = {
  scope: "singleton",
  name: "$adminService",
  factory: function($orm2, $date, $authService) {
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
          var Admin = models.Admin;

          // do count
          Admin.count(function(err, adminCount) {
            if(adminCount === 0) {
              // create an original admin account
              Admin.create({
                username: "admin",
                password: "admin",
                date: $date.now().getAsMilliseconds()
              }, function(err, admin) {
                if(err) {
                  throw err;
                }

                // do match
                if(username !== admin.username || password !== admin.password) {
                  callback("用户名或密码错误");
                }else {
                  // create a new token
                  $authService.createToken({
                    username: username,
                    type: "admin"
                  }, function(token) {
                    // send info back
                    callback(null, token);
                  });
                }
              });
            }else {
              // find the admin
              Admin.one({
                username: username,
                password: password
              }, function(err, admin) {
                if(err) {
                  throw err;
                }

                // check if the admin exists
                if(admin === null) {
                  callback("用户名或密码错误");
                }else {
                  // 检查是否已登录
                  if(admin.isOnline) {
                    callback("管理员已经登陆");
                  }else {
                    // create a new token
                    $authService.createToken({
                      username: username,
                      type: "admin"
                    }, function(token) {
                      // send info back
                      callback(null, token);
                    });
                  }
                }
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
       * mark the admin as logged in
      **/
      markAsLoggedIn: function(option, callback) {
        var username = option.username;

        $orm2.query(function(models) {
          var Admin = models.Admin;

          // 查找管理员
          Admin.one({
            username: username
          }, function(err, admin) {
            if(err) {
              throw err;
            }

            // 修改管理员状态
            admin.isOnline = true;
            admin.save(function(err) {
              if(err) {
                throw err;
              }

              callback();
            });
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * logout the admin
      **/
      logout: function(option, callback) {
        var username = option.username;

        $orm2.query(function(models) {
          var Admin = models.Admin;

          // 查找管理员
          Admin.one({
            username: username
          }, function(err, admin) {
            if(err) {
              throw err;
            }

            // 修改管理员状态
            admin.isOnline = false;
            admin.save(function(err) {
              if(err) {
                throw err;
              }

              callback();
            });
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
          var Admin = models.Admin;

          // find the admin
          Admin.one({
            username: username
          }, function(err, admin) {
            if(err) {
              throw err;
            }

            // check old password
            if(oldPassword !== admin.password) {
              callback("旧密码不正确");
            }else {
              // change password
              admin.password = newPassword;
              admin.save(function(err) {
                if(err) {
                  callback(err.msg);
                }else {
                  callback();
                }
              });
            }
          });
        });
      }
    };
  }
};
