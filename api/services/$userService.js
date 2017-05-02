module.exports = {
  scope: "singleton",
  name: "$userService",
  factory: function($date, $orm2, $authService, $coinService, $utils) {
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
                  // 查询用户是否被注销
                  if(user.state === "inactive") {
                    callback("用户已被注销");
                  }else {
                    // 检查用户是否已登录
                    if(user.isOnline) {
                      callback("用户已登录");
                    }else {
                      // create a new token
                      $authService.createToken({
                        username: username,
                        type: "normal"
                      }, function(token) {
                        callback(null, token);
                      });
                    }
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
       * mark the user as logged in
      **/
      markAsLoggedIn: function(option, callback) {
        var username = option.username;

        $orm2.query(function(models) {
          var User = models.User;

          // 查找用户
          User.one({
            username: username
          }, function(err, user) {
            if(err) {
              throw err;
            }

            // 将状态改为已登录
            user.isOnline = true;
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
        $orm2.rawQuery(function(db) {
          db.driver.execQuery(
            "SELECT COUNT(*) AS count FROM user " +
            "WHERE username LIKE ?",
            [ $utils.getTodayPrefix() + "%" ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              $orm2.query(function(models) {
                var User = models.User;

                // create a new user
                User.create({
                  username: $utils.getTodayPrefix() + rows[0].count,
                  password: "123456789",
                  date: $date.now().getAsMilliseconds(),
                  coin: 0
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

          User.count({ state: "active" }, function(err, userCount) {
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
            "SELECT * FROM user " +
            "WHERE state = ? " +
            "GROUP BY id DESC LIMIT ? OFFSET ?",
            [ "active", (end - start +1), start ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              // 用户信息列表
              var users = [];

              // 遍历
              rows.forEach(function(row) {
                // 获取原生数据
                var username = row.username;
                var date = $date.millisecondsToDate(row.date);

                // 转换日期
                var day = date.getYear() + "年" + date.getMonth() + "月" + date.getDay() + "日";
                var time = date.getHour() + ":" + date.getMinute() + ":" + date.getSecond();

                // 存储信息
                users.push({
                  day: day,
                  time: time,
                  username: username
                });
              });

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
       * list just usernames
      **/
      listUserSimple: function(option, callback) {
        var start = option.start;
        var end = option.end;

        $orm2.rawQuery(function(db) {
          db.driver.execQuery(
            "SELECT username FROM user " +
            "WHERE state = ? " +
            "ORDER BY id DESC LIMIT ? OFFSET ?",
            [ "active", (end - start + 1), start ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              // 获取所有结果的用户名
              var usernames = [];
              rows.forEach(function(row) {
                usernames.push(row.username);
              });

              // send info back
              callback(usernames);
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
                coin: user.coin,
                state: user.state
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
        var amount = Number.parseInt(option.amount);
        var shouldRecord = option.shouldRecord;

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
                // 获取剩余积分
                var remainCoin = user.coin + amount;

                // 保存数据
                user.coin += amount;
                user.save(function(err) {
                  if(err) {
                    throw err;
                  }

                  // 检查是否记录
                  if(shouldRecord) {
                    // 保存积分设置记录
                    $coinService.saveCoinRecord({
                      username: username,
                      coin: amount,
                      remainCoin: remainCoin
                    }, function(coinRecord) {
                      // 回调
                      callback();
                    });
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
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * button down coin
      **/
      bottomDownCoin: function(option, callback) {
        var username = option.username;
        var amount = Number.parseInt(option.amount);
        var shouldRecord = option.shouldRecord;

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
                // 获取剩余积分
                var remainCoin = user.coin - amount;

                // 保存数据
                user.coin -= amount;
                user.save(function(err) {
                  if(err) {
                    throw err;
                  }

                  // 检查是否记录
                  if(shouldRecord) {
                    // 保存积分设置记录
                    $coinService.saveCoinRecord({
                      username: username,
                      coin: 0 - amount,
                      remainCoin: remainCoin
                    }, function(coinRecord) {
                      // 回调
                      callback();
                    });
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
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * ativate user
      **/
      activateUser: function(option, callback) {
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
              // 修改用户状态 & 保存
              user.state = "active";
              user.save(function(err) {
                if(err) {
                  throw err;
                }

                callback();
              });
            }
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Funtion} callback
       * @desc
       * deativate user
      **/
      deactivateUser: function(option, callback) {
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

            // check if the user existss
            if(user === null) {
              callback("用户不存在");
            }else {
              // 修改用户状态 & 保存
              user.state = "inactive";
              user.save(function(err) {
                if(err) {
                  throw err;
                }

                callback();
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
       * search user
      **/
      searchUser: function(option, callback) {
        var keyword = option.keyword;

        $orm2.rawQuery(function(db) {
          db.driver.execQuery(
            "SELECT username FROM user " +
            "WHERE username LIKE ? " +
            "ORDER BY id DESC",
            [ keyword + "%" ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              var usernames = [];
              rows.forEach(function(row) {
                usernames.push(row.username);
              });

              // send info back
              callback(usernames);
            }
          );
        });
      }
    };
  }
};
