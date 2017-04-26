module.exports = {
  scope: "singleton",
  name: "$coinService",
  factory: function($orm2, $date) {
    return {
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * save coin record
      **/
      saveCoinRecord: function(option, callback) {
        var username = option.username;
        var coin = option.coin;
        var remainCoin = option.remainCoin;

        $orm2.query(function(models) {
          var CoinRecord = models.CoinRecord;

          // 插入新的条目
          CoinRecord.create({
            username: username,
            coin: coin,
            remainCoin: remainCoin,
            date: $date.now().getAsMilliseconds()
          }, function(err, coinRecord) {
            if(err) {
              throw err;
            }

            // send info back
            callback({
              id: coinRecord.id,
              username: coinRecord.username,
              coin: coinRecord.coin,
              remainCoin: coinRecord.remainCoin,
              date: coinRecord.date
            });
          });
        });
      },
      /**
       * @public
       * @param {Function} callback
       * @desc
       * count coin records
      **/
      countCoinRecords: function(callback) {
        $orm2.query(function(models) {
          var CoinRecord = models.CoinRecord;

          // do count
          CoinRecord.count(function(err, count) {
            if(err) {
              throw err;
            }

            // send info back
            callback(count);
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * list coin records
      **/
      listCoinRecords: function(option, callback) {
        var start = option.start;
        var end = option.end;

        $orm2.rawQuery(function(db) {
          // 查询充值记录
          db.driver.execQuery(
            "SELECT * FROM coinrecord " +
            "ORDER BY id DESC LIMIT ? OFFSET ?",
            [ (end - start + 1), start ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              // send info back
              callback(rows);
            }
          );
        });
      }
    };
  }
};
