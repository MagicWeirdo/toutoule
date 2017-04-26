module.exports = {
  /**
   * @public
   * @desc
   * called before models are defined
  **/
  before: function(orm, db) {
    db.define("CoinRecord", {
      username: { type: "text", size: 12, required: true },
      coin: { type: "integer", size: 8, required: true },
      remainCoin: { type: "integer", size: 8, required: true },
      date: { type: "integer", size: 8, required: true }
    }, {
      validations: {
        username: orm.enforce.required("用户名不能为空"),
        username: orm.enforce.notEmptyString("用户名不能为空字符串"),
        username: orm.enforce.ranges.length(1, 12, "用户名长度必须在1至12之间"),
        coin: orm.enforce.required("积分不能为空"),
        remainCoin: orm.enforce.required("所剩积分不能为空"),
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
