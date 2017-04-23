module.exports = {
  scope: "singleton",
  name: "$gameService",
  factory: function($orm2, $date) {
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
        var mode = option.mode;
        var result = option.result;

        $orm2.query(function(models) {
          var GameRound = models.GameRound;

          // save the round
          GameRound.create({
            mode: mode,
            result: result,
            date: $date.now().getAsMilliseconds()
          }, function(err, gameRound) {
            if(err) {
              throw err;
            }

            // send info back
            callback({
              id: gameRound.id,
              mode: gameRound.mode,
              result: gameRound.result,
              date: gameRound.date
            });
          });
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
        var date = option.date;

        $orm2.query(function(models) {
          var GameRecord = models.GameRecord;

          // save the game record
          GameRecord.create({
            stake: stake,
            reward: reward,
            date: date
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
      }
    };
  }
};
