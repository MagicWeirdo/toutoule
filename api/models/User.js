module.exports = {
  /**
   * @public
   * @desc
   * called before models are defined
  **/
  before: function(orm, db) {
    db.define("User", {
      username: { type: "text", size: 12, required: true, unique: true },
      password: { type: "text", size: 16, required: true },
      type: { type: "enum", values: [ "normal", "admin" ], required: true },
      date: { type: "integer", size: 8, required: true }
    }, {
      validations: {
        username: orm.enforce.required("用户名不能为空"),
        username: orm.enforce.notEmptyString("用户名不能为空字符串"),
        username: orm.enforce.ranges.length(1, 12, "用户名长度必须在1至12之间"),
        username: orm.enforce.unique("用户名已经存在"),
        password: orm.enforce.required("密码不能为空"),
        password: orm.enforce.notEmptyString("密码不能为空"),
        password: orm.enforce.ranges.length(1, 16, "密码长度必须在1至12之间"),
        type: orm.enforce.required("用户类型不能为空"),
        type: orm.enforce.lists.inside([ "normal", "admin" ], "非法用户类型"),
        date: orm.enforce.required("注册日期不能为空")
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
