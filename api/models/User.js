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
      date: { type: "integer", size: 8, required: true },
      token: { type: "text", size: 64, unique: true },
      extra: { type: "text", size: 150 },
      coin: { type: "integer", size: 8, defaultValue: 0 },
      isOnline: { type: "boolean", defaultValue: false }
    }, {
      validations: {
        username: orm.enforce.required("用户名不能为空"),
        username: orm.enforce.notEmptyString("用户名不能为空字符串"),
        username: orm.enforce.ranges.length(1, 12, "用户名长度必须在1至12之间"),
        username: orm.enforce.unique("用户名已经存在"),
        password: orm.enforce.required("密码不能为空"),
        password: orm.enforce.notEmptyString("密码不能为空"),
        password: orm.enforce.ranges.length(6, 16, "密码长度必须在6至16之间"),
        date: orm.enforce.required("注册日期不能为空"),
        token: orm.enforce.ranges.length(64, 64, "密匙长度必须为64位"),
        token: orm.enforce.unique("密匙必须唯一"),
        extra: orm.enforce.ranges.length(undefined, 150, "备注长度不能超过150字"),
        coin: orm.enforce.ranges.number(0, undefined, "金额不能为负值")
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
