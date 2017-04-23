module.exports = {
  /**
   * @public
   * @desc
   * called before models are defined
  **/
  before: function(orm, db) {
    db.define("GameRound", {
      mode: { type: "enum", values: [ "auto", "manual" ], required: true },
      result: { type: "enum", values: [ "b1", "b2", "b3", "b4", "b5", "b6", "d", "s", "none" ], required: true },
      date: { type: "integer", size: 8, required: true }
    }, {
      validations: {
        mode: orm.enforce.required("游戏模式不能为空"),
        mode: orm.enforce.notEmptyString("游戏模式不能为空"),
        mode: orm.enforce.lists.inside([ "auto", "manual" ], "非法游戏模式"),
        result: orm.enforce.required("游戏结果不能为空"),
        result: orm.enforce.notEmptyString("游戏结果不能为空"),
        result: orm.enforce.lists.inside([ "b1", "b2", "b3", "b4", "b5", "b6", "d", "s", "none" ], "非法游戏结果"),
        date: orm.enforce.required("日期不能为空")
      }
    });
  },
  /**
   * @public
   * @desc
   * called after models are defined
  **/
  after: function(orm, db) {

  }
};
