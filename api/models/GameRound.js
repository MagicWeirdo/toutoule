module.exports = {
  /**
   * @public
   * @desc
   * called before models are defined
  **/
  before: function(orm, db) {
    db.define("GameRound", {
      code: { type: "text", size: 10, required: true },
      result: { type: "enum", values: [ "b1", "b2", "b3", "b4", "b5", "b6", "d", "s", "none" ], required: true }
    }, {
      validations: {
        code: orm.enforce.required("游戏编号不能为空"),
        code: orm.enforce.notEmptyString("游戏编号不能为空"),
        result: orm.enforce.required("游戏结果不能为空"),
        result: orm.enforce.notEmptyString("游戏结果不能为空"),
        result: orm.enforce.lists.inside([ "b1", "b2", "b3", "b4", "b5", "b6", "d", "s", "none" ], "非法游戏结果")
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
