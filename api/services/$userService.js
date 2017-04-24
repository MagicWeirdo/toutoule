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

          // check if the user exists
          User.exists({
            username: username
          }, function(err, isUserExist) {
            if(err) {
              throw err;
            }

            if(isUserExist === false) {
              callback("用户不存在");
            }else {
              // find the user
              User.one({
                username: username,
                password: password
              }, function(err, user) {
                if(err) {
                  throw err;
                }

                // check if password matches the username
                if(user === null) {
                  callback("密码错误");
                }else {
                  // check user state
                  if(user.isOnline === true) {
                    callback("用户已经在线");
                  }else {
                    // change state to online
                    user.isOnline = true;
                    user.save(function(err) {
                      if(err) {
                        throw err;
                      }

                      // create a new token
                      $authService.createToken({
                        username: username,
                        type: "normal"
                      }, function(token) {
                        callback(null, token);
                      });
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
       * logout the account
      **/
      logout: function(option, callback) {
        var username = option.username;

        $orm2.query(function(models) {
          var User = models.User;

          // find the user
          User.one({
            username: username
          }, function(err, user) {
            if(err) {
              throw err;
            }

            // change the state to offline
            user.isOnline = false;
            user.save(function(err) {
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

            // check if the user exists
            if(user === null) {
              callback("用户不存在");
            }else {
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
                  date: $date.now().getAsMilliseconds(),
                  coin: 100
                }, function(err, user) {
                  if(err) {
                    throw err;
                  }

                  // send info back
                  callback({
                    username: user.username,
                    password: user.password,
                    date: user.date
                  });
                });
              });
            }
          );
        });
      },
      /**
       * @public
       * @param {Function} callback
       * @desc
       * get the count of user
      **/
      getUserCount: function(callback) {
        $orm2.query(function(models) {
          var User = models.User;

          User.count(function(err, userCount) {
            if(err) {
              throw err;
            }

            // send info back
            callback(userCount);
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * list users
      **/
      listUsers: function(option, callback) {
        var start = option.start;
        var end = option.end;

        $orm2.rawQuery(function(db) {
          db.driver.execQuery(
            "SELECT id, username, date, extra " +
            "FROM user " +
            "ORDER BY id DESC LIMIT ? OFFSET ?",
            [ (end - start + 1), start ],
            function(err, users) {
              if(err) {
                throw err;
              }

              // send info back
              callback(users);
            }
          );
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * get user info
      **/
      getUserInfo: function(option, callback) {
        var username = option.username;

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
              // send info back
              callback(null, {
                id: user.id,
                username: user.username,
                date: user.date,
                extra: user.extra,
                coin: user.coin
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
       * save user extra
      **/
      saveUserExtra: function(option, callback) {
        var userId = option.userId;
        var extra = option.extra;

        $orm2.query(function(models) {
          var User = models.User;

          // find the user
          User.one({
            id: userId
          }, function(err, user) {
            if(err) {
              throw err;
            }

            // check if the user exists
            if(user === null) {
              callback("用户不存在");
            }else {
              user.extra = extra;
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
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * top up coin
      **/
      topUpCoin: function(option, callback) {
        var username = option.username;
        var amount = option.amount;

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
              if(amount <= 0) {
                callback("金额不能为空或负值");
              }else {
                user.coin += amount;
                user.save(function(err) {
                  if(err) {
                    throw err;
                  }

                  callback();
                });
              }
            }
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * button down coin
      **/
      bottomDownCoin: function(option, callback) {
        var username = option.username;
        var amount = option.amount;

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
              if(amount <= 0) {
                callback("金额不能为空或负值");
              }else {
                user.coin -= amount;
                user.save(function(err) {
                  if(err) {
                    throw err;
                  }

                  callback();
                });
              }
            }
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * get user coin amount
      **/
      getUserCoinAmount: function(option, callback) {
        var username = option.username;

        $orm2.query(function(models) {
          var User = models.User;

          // check if the user is found
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
              // send info back
              callback(null, user.coin);
            }
          });
        });
      },
      /**
       * @public
       * @param {Function} callback
       * @desc
       * reset all users' state
      **/
      resetAllUsersState: function(callback) {
        $orm2.query(function(models) {
          var User = models.User;

          // find all users
          User.all(function(err, users) {
            if(err) {
              throw err;
            }

            // 获取总数量
            var totalNum = users.length;
            var finishedNum = 0;

            // 遍历
            users.forEach(function(user) {
              user.isOnline = false;
              user.save(function(err) {
                if(err) {
                  throw err;
                }

                finishedNum++;
              });
            });

            // 等待修改完成
            var waitInterval = setInterval(function() {
              if(finishedNum === totalNum) {
                clearInterval(waitInterval);

                callback();
              }
            }, 500);
          });
        });
      }
    };
  }
};
