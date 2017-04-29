module.exports = {
  scope: "singleton",
  name: "$bulletinService",
  factory: function($orm2, $date) {
    return {
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * save a bulletin
      **/
      saveBulletin: function(option, callback) {
        var content = option.content;

        $orm2.query(function(models) {
          var Bulletin = models.Bulletin;

          // save the bulletin
          Bulletin.create({
            content: content,
            date: $date.now().getAsMilliseconds()
          }, function(err, bulletin) {
            if(err) {
              throw err;
            }

            // send info back
            callback({
              id: bulletin.id,
              content: bulletin.content,
              date: bulletin.date
            });
          });
        });
      },
      /**
       * @public
       * @param {Function} callback
       * @desc
       * count bulletins
      **/
      countBulletins: function(callback) {
        $orm2.query(function(models) {
          var Bulletin = models.Bulletin;

          // do count
          Bulletin.count(function(err, bulletinCount) {
            if(err) {
              throw err;
            }

            // send info back
            callback(bulletinCount);
          });
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * get bulletin
      **/
      listBulletins: function(option, callback) {
        var start = option.start;
        var end = option.end;

        $orm2.rawQuery(function(db) {
          // extra tops first
          db.driver.execQuery(
            "SELECT id, content,  date " +
            "FROM bulletin " +
            "ORDER BY id DESC LIMIT ? OFFSET ?",
            [ (end - start + 1), start ],
            function(err, bulletins) {
              if(err) {
                throw err;
              }

              // send info back
              callback(bulletins);
            }
          );
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * get bulletin
      **/
      listBulletinsFormated: function(option, callback) {
        var start = option.start;
        var end = option.end;

        $orm2.rawQuery(function(db) {
          // extra tops first
          db.driver.execQuery(
            "SELECT id, content,  date " +
            "FROM bulletin " +
            "ORDER BY id DESC LIMIT ? OFFSET ?",
            [ (end - start + 1), start ],
            function(err, rows) {
              if(err) {
                throw err;
              }

              // 公告条目列表
              var bulletins = [];

              // 遍历
              rows.forEach(function(row) {
                // 获取原生数据
                var id = row.id;
                var content = row.content;
                var date = $date.millisecondsToDate(row.date);

                // 转换日期
                var day = date.getYear() + "年" + date.getMonth() + "月" + date.getDay() + "日";
                var time = date.getHour() + ":" + date.getMinute() + ":" + date.getSecond();

                // 存储信息
                bulletins.push({
                  id: id,
                  day: day,
                  time: time,
                  content: content
                });
              });

              // send info back
              callback(bulletins);
            }
          );
        });
      },
      /**
       * @public
       * @param {Object} option
       * @param {Function} callback
       * @desc
       * remove a bulletin
      **/
      removeBulletin: function(option, callback) {
        var bulletinId = option.bulletinId;

        $orm2.query(function(models) {
          var Bulletin = models.Bulletin;

          // 查找该 bulletin
          Bulletin.one({
            id: bulletinId
          }, function(err, bulletin) {
            if(err) {
              throw err;
            }

            // 检查是否存在
            if(bulletin === null) {
              callback("公告不存在");
            }else {
              // 删除该公告
              bulletin.remove(function(err) {
                if(err) {
                  throw err;
                }

                callback();
              });
            }
          });
        });
      }
    };
  }
};
