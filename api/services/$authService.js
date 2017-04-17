module.exports = {
  scope: "singleton",
  name: "$authService",
  factory: function($orm2, $date, $tokenGenerator) {
    return {
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * create a new token
      **/
      createToken: function(option, callback) {
        var username = option.username;
        var type = option.type;

        $orm2.query(function(models) {
          // generate token
          var token = $tokenGenerator.random(username, $date.now().getAsMilliseconds());

          // check type
          if(type === "admin") {
            var Admin = models.Admin;

            // find the admin
            Admin.one({
              username: username
            }, function(err, admin) {
              if(err) {
                throw err;
              }

              // save the token
              admin.token = token;
              admin.save(function(err) {
                if(err) {
                  throw err;
                }

                // send info back
                callback(token);
              });
            });
          }else if(type === "normal") {
            var User = models.User;

            // find the user
            User.one({
              username: username
            }, function(err, user) {
              if(err) {
                throw err;
              }

              // save the token
              user.token = token;
              user.save(function(err) {
                if(err) {
                  throw err;
                }

                // send info back
                callback(token);
              });
            });
          }
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * verify the given apiToken
      **/
      verify: function(option, callback) {
        var token = option.token;
        var type = option.type;

        $orm2.query(function(models) {
          // check the type
          if(type === "admin") {
            var Admin = models.Admin;

            // find the token
            Admin.one({
              token: token
            }, function(err, admin) {
              if(err) {
                throw err;
              }

              // check if the admin is found
              if(admin === null) {
                callback("密匙不存在");
              }else {
                // send info back
                callback(null, admin.username);
              }
            });
          }else if(type === "normal") {
            var User = models.User;

            // find the token
            User.one({
              token: token
            }, function(err, user) {
              if(err) {
                throw err;
              }

              // check if user is found
              if(user === null) {
                callback("密匙不存在");
              }else {
                // send info back
                callback(null, user.username);
              }
            });
          }
        });
      }
    };
  }
};
