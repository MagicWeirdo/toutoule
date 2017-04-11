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
          // generate date & expiration
          var date = $date.now();
          var expiration = $date.now();
          expiration.setMonth(date.getMonth() + 1);

          // generate token
          var token = $tokenGenerator.random(username, date.getAsMilliseconds());

          // insert a new row
          var ApiToken = models.ApiToken;
          ApiToken.create({
            token: token,
            type: type,
            date: date.getAsMilliseconds(),
            expiration: expiration.getAsMilliseconds()
          }, function(err, apiToken) {
            if(err) {
              throw err;
            }

            var User = models.User;

            // find the user
            User.one({
              username: username
            }, function(err, user) {
              if(err) {
                throw err;
              }

              // set user
              apiToken.setUser(user, function(err) {
                if(err) {
                  throw err;
                }

                // send info back
                callback({
                  token: apiToken.token,
                  type: apiToken.type,
                  expiration: apiToken.expiration
                });
              });
            });
          });
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
          var ApiToken = models.ApiToken;

          // find the apiToken
          ApiToken.one({
            token: token,
            type: type
          }, function(err, apiToken) {
            if(err) {
              throw err;
            }

            // check if the apiToken exists
            if(apiToken === null) {
              callback("密匙不存在");
            }else {
              // get expiration
              var expiration = $date.millisecondsToDate(apiToken.expiration);

              // compare to now
              if($date.compare($date.now(), expiration) !== -1) {
                callback("密匙已过期");
              }else {
                callback();
              }
            }
          });
        });
      },
      /**
       * @public
       * @param {String} token
       * @param {Function} callback
       * @desc
       * get the user of the token
      **/
      getUser: function(token, callback) {
        $orm2.query(function(models) {
          var ApiToken = models.ApiToken;

          // find the token
          ApiToken.one({
            token: token
          }, function(err, apiToken) {
            if(err) {
              throw err;
            }

            // get the user
            apiToken.getUser(function(err, user) {
              if(err) {
                throw err;
              }

              // send info back
              callback(user.username);
            });
          });
        });
      }
    };
  }
};
