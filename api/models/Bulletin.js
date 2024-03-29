module.exports = {
  /**
   * @public
   * @desc
   * called before models are defined
  **/
  before: function(orm, db) {
    db.define("Bulletin", {
      content: { type: "text", size: 64, required: true },
      date: { type: "integer", size: 8, required: true }
    }, {
      validations: {
        content: orm.enforce.required("内容不能为空"),
        content: orm.enforce.notEmptyString("内容不能为空"),
        content: orm.enforce.ranges.length(1, 64, "内容长度不能超过64字"),
        date: orm.enforce.required("日期不能为空")
      }
    });
  },
  after: function(orm, db) {

  }
};
