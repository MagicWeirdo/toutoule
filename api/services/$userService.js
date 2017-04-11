module.exports = {
  scope: "singleton",
  name: "$userService",
  factory: function($date, $orm2, $authService) {
    return {
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * normal user login
      **/
      login: function(option, callback) {
        var username = option.username;
        var password = option.password;

        $orm2.query(function(models) {
          var User = models.User;

          // find the user
          User.one({
            username: username,
            password: password,
            type: "normal"
          }, function(err, user) {
            if(err) {
              throw err;
            }

            // check if the user exists
            if(user === null) {
              callback("用户名或密码错误");
            }else {
              // create a new token
              $authService.createToken({
                username: username,
                type: "normal"
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
       * modify user password
      **/
      modifyPassword: function(option, callback) {
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

            // check old password
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
          });
        });
      },
      /**
       * @public
       * @param {Function} callback
       * @desc
       * generate a new user
      **/
      generateUser: function(callback) {
        // get current date
        var now = $date.now();
        var year = now.getYear();
        var month = now.getMonth();
        var day = now.getDay();

        $orm2.rawQuery(function(db) {
          db.driver.execQuery(
            "SELECT COUNT(*) AS count FROM gamble.user " +
            "WHERE username  LIKE ?",
            [ year + "" + month + "" + day + "%" ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              $orm2.query(function(models) {
                var User = models.User;

                // create a new user
                User.create({
                  username: year + "" + month + "" + day + "" + rows[0].count,
                  password: "123456789",
                  type: "normal",
                  date: $date.now().getAsMilliseconds()
                }, function(err, user) {
                  if(err) {
                    throw err;
                  }

                  // send info back
                  callback({
                    username: user.username,
                    password: user.password,
                    type: user.type,
                    date: user.date
                  });
                });
              });
            }
          );
        });
      }
    };
  }
};
