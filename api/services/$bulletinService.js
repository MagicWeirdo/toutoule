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
      saveBulletin(option, callback) {
        var content = option.content;

        $orm2.query(function(models) {
          var Bulletin = models.Bulletin;

          // save the bulletin
          Bulletin.create({
            content: content,
            date: $date.now().getAsMilliseconds()
          }, function(err, bulletin) {
            if(err) {
              callback(err.msg);
            }else {
              // send info back
              callback(null, {
                id: bulletin.id,
                content: bulletin.content,
                date: bulletin.date
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
      }
    };
  }
};
