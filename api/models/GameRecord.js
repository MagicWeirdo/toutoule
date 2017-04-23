module.exports = {
  /**
   * @public
   * @desc
   * called before models are defined
  **/
  before: function(orm, db) {
    db.define("GameRecord", {
      stake: { type: "enum", values: [ "b1", "b2", "b3", "b4", "b5", "b6", "d", "s", "none" ], required: true },
      reward: { type: "integer", required: true },
      date: { type: "integer", size: 8, required: true }
    }, {
      stake: orm.enforce.required("押注不能为空"),
      stake: orm.enforce.notEmptyString("押注不能为空"),
      stake: orm.enforce.lists.inside([ "b1", "b2", "b3", "b4", "b5", "b6", "d", "s", "none" ], "非法押注类型"),
      reward: orm.enforce.required("奖惩不能为空"),
      date: orm.enforce.required("日期不能为空")
    });
  },
  /**
   * @public
   * @desc
   * called after models are defined
  **/
  after: function(orm, db) {
    var GameRecord = db.models.GameRecord;
    var GameRound = db.models.GameRound;
    var User = db.models.User;

    // set game round
    GameRecord.hasOne("gameRound", GameRound);

    // set user
    GameRecord.hasOne("user", User);
  }
};
