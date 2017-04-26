const async = require("async");

module.exports = {
  scope: "singleton",
  name: "$gameService",
  factory: function($orm2, $utils) {
    return {
      /**
       * @public
       * @return {Object}
       * @desc
       * randomly generate a result
      **/
      random: function() {
        var result = {
          dice1: null,
          dice2: null,
          dice3: null,
          type: null
        };

        result.dice1 = Math.floor(Math.random() * (6 - 1)) + 1;
        result.dice2 = Math.floor(Math.random() * (6 - 1)) + 1;
        result.dice3 = Math.floor(Math.random() * (6 - 1)) + 1;

        // 如果是豹子
        if(result.dice1 === result.dice2 && result.dice2 === result.dice3) {
          result.type = "b" + result.dice;
        }else if((result.dice1 + result.dice2 + result.dice3) % 2 !== 0) {
          // 如果为单
          result.type = "d";
        }else {
          // 如果为双
          result.type = "s";
        }

        return result;
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * save a game record
      **/
      saveGameRound: function(option, callback) {
        var result = option.result;

        $orm2.rawQuery(function(db) {
          // 获取前缀
          var prefix = $utils.getTodayPrefix();

          // 获取有当前前缀的条目数量
          db.driver.execQuery(
            "SELECT COUNT(*) AS count " +
            "FROM gameround " +
            "WHERE code LIKE ?",
            [ prefix + "%" ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              // 获取后缀
              var suffix = $utils.toSuffix(rows[0].count);

              $orm2.query(function(models) {
                var GameRound = models.GameRound;

                // 插入新游戏回合
                GameRound.create({
                  code: prefix + "" + suffix,
                  result: result
                }, function(err, gameRound) {
                  if(err) {
                    throw err;
                  }

                  // send info back
                  callback({
                    id: gameRound.id,
                    code: gameRound.code,
                    result: gameRound.result
                  });
                });
              });
            }
          );
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * save game record
      **/
      saveGameRecord: function(option, callback) {
        var stake = option.stake;
        var reward = option.reward;
        var gameRoundId = option.gameRoundId;
        var username = option.username;

        $orm2.query(function(models) {
          var GameRecord = models.GameRecord;

          // save the game record
          GameRecord.create({
            stake: stake,
            reward: reward
          }, function(err, gameRecord) {
            if(err) {
              throw err;
            }

            var GameRound = models.GameRound;

            // find the game round
            GameRound.get(gameRoundId, function(err, gameRound) {
              if(err) {
                throw err;
              }

              // set game round
              gameRecord.setGameRound(gameRound, function(err) {
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

                  // set the user
                  gameRecord.setUser(user, function(err) {
                    if(err) {
                      throw err;
                    }

                    callback();
                  });
                });
              });
            });
          });
        });
      },
      /**
       * @public
       * @param {Function} callback
       * @desc
       * count game records
      **/
      countGameRecords: function(callback) {
        $orm2.query(function(models) {
          var GameRound = models.GameRound;

          // do count
          GameRound.count(function(err, recordCount) {
            if(err) {
              throw err;
            }

            // send info back
            callback(recordCount);
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * list game records
      **/
      listGameRecords: function(option, callback) {
        var start = option.start;
        var end = option.end;

        $orm2.rawQuery(function(db) {
          // 获取原生数据
          db.driver.execQuery(
            "SELECT gr.id AS gameRoundId, gr.code AS gameRoundCode, gr.result, gre.stake, gre.reward, u.username " +
            "FROM gameround AS gr, gamerecord AS gre, user AS u " +
            "WHERE gr.id = gre.gameround_id AND gre.user_id = u.id " +
            "ORDER BY gameRoundCode DESC LIMIT ? OFFSET ?",
            [ (end - start + 1), start ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              // 数量
              var totalNum = rows.length;
              var currentNum = 0;

              // 存储转换结果
              var records = [];
              rows.forEach(function(row) {
                // 获取原生数据
                var gameRoundId = row.gameRoundId;
                var gameRoundCode = row.gameRoundCode;
                var result = row.result;
                var stake = row.stake;
                var reward = row.reward;
                var username = row.username;

                // 标记是否已插入
                var isInserted = false;



                // 查询容器中是否有对应的游戏回合
                records.forEach(function(record) {
                  // 查询是否对应
                  if(record.gameRoundCode === gameRoundCode) {
                    // 计算所押积分
                    var coinStaked = 0;

                    // 判断输赢
                    if(reward < 0) {
                      coinStaked = Math.abs(reward);
                    }else {
                      // 判断押注类型
                      if(stake === "d") {
                        coinStaked = reward;
                      }else if(stake === "s") {
                        coinStaked = reward / 0.95;
                      }else {
                        coinStaked = reward / 50;
                      }
                    }

                    record.list.push({
                      username: username,
                      stake: stake,
                      coinStaked: coinStaked,
                      won: reward > 0 ? true : false,
                      reward: reward,
                      result: result
                    });

                    // 标记为已插入
                    isInserted = true;
                  }
                });

                // 判断是否已插入
                if(isInserted === false) {
                  // 创建一个新的游戏回合
                  var record = {
                    gameRoundCode: gameRoundCode,
                    list: []
                  };

                  // 计算所押积分
                  var coinStaked = 0;

                  // 判断输赢
                  if(reward < 0) {
                    coinStaked = Math.abs(reward);
                  }else {
                    // 判断押注类型
                    if(stake === "d") {
                      coinStaked = reward;
                    }else if(stake === "s") {
                      coinStaked = reward / 0.95;
                    }else {
                      coinStaked = reward / 50;
                    }
                  }

                  record.list.push({
                    username: username,
                    stake: stake,
                    coinStaked: coinStaked,
                    won: reward > 0 ? true : false,
                    reward: reward,
                    result: result
                  });

                  // 插入结果
                  records.push(record);
                }

                currentNum++;

                // 检查是否查询完成
                if(totalNum === currentNum) {
                  callback(records);
                }
              });
            }
          );
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * count user game records
      **/
      countUserGameRecords: function(option, callback) {
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
              $orm2.rawQuery(function(db) {
                db.driver.execQuery(
                  "SELECT COUNT(*) AS count " +
                  "FROM gameround AS gr, gamerecord AS gre, user AS u " +
                  "WHERE gr.id = gre.gameround_id AND gre.user_id = u.id AND u.username = ?",
                  [ username ],
                  function(err, rows) {
                    if(err) {
                      throw err;
                    }

                    // send info back
                    callback(rows[0].count);
                  }
                );
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
       * list user game records
      **/
      listUserGameRecords: function(option, callback) {
        var username = option.username;
        var start = option.start;
        var end = option.end;

        $orm2.query(function(models) {
          var User = models.User;

          // find the user
          User.one({
            username: username
          }, function(err, user) {
            if(err) {
              throw err;
            }

            // check if the user eixsts
            if(user === null) {
              callback("用户不存在");
            }else {
              $orm2.rawQuery(function(db) {
                // 获取原生数据
                db.driver.execQuery(
                  "SELECT gr.id AS gameRoundId, gr.code AS gameRoundCode, gr.result, gre.stake, gre.reward, u.username " +
                  "FROM gameround AS gr, gamerecord AS gre, user AS u " +
                  "WHERE gr.id = gre.gameround_id AND gre.user_id = u.id AND u.username = ? " +
                  "ORDER BY gameRoundCode DESC LIMIT ? OFFSET ?",
                  [ username, (end - start + 1), start ],
                  function(err, rows) {
                    if(err) {
                      throw err;
                    }

                    // 数量
                    var totalNum = rows.length;
                    var currentNum = 0;

                    // 存储转换结果
                    var records = [];
                    rows.forEach(function(row) {
                      // 获取原生数据
                      var gameRoundId = row.gameRoundId;
                      var gameRoundCode = row.gameRoundCode;
                      var result = row.result;
                      var stake = row.stake;
                      var reward = row.reward;
                      var username = username;

                      // 获取该游戏回合的人数
                      var GameRecord = models.GameRecord;
                      GameRecord.count({
                        gameround_id: gameRoundId
                      }, function(err, playerCount) {
                        if(err) {
                          throw err;
                        }

                        // 计算所押积分
                        var coinStaked = 0;

                        // 判断输赢
                        if(reward < 0) {
                          coinStaked = Math.abs(reward);
                        }else {
                          // 判断押注类型
                          if(stake === "d") {
                            coinStaked = reward;
                          }else if(stake === "s") {
                            coinStaked = reward / 0.95;
                          }else {
                            coinStaked = reward / 50;
                          }
                        }

                        // 插入记录
                        records.push({
                          gameRoundCode: gameRoundCode,
                          playerCount: playerCount,
                          stake: stake,
                          coinStaked: coinStaked,
                          result: result,
                          won: reward > 0 ? true : false,
                          reward: reward
                        });

                        currentNum++;

                        // 检查是否查询完成
                        if(totalNum === currentNum) {
                          callback(records);
                        }
                      });
                    });
                  }
                );
              });
            }
          });
        });
      }
    };
  }
};
