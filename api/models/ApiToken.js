module.exports = {
  /**
   * @public
   * @desc
   * called before models are defined
  **/
  before: function(orm, db) {
    db.define("ApiToken", {
      token: { type: "text", size: 64, required: true, unique: true },
      type: { type: "enum", values: [ "normal", "admin" ], required: true },
      date: { type: "integer", size: 8, required: true },
      expiration: { type: "integer", size: 8, required: true }
    }, {
      validations: {
        token: orm.enforce.required("密匙不能为空"),
        token: orm.enforce.notEmptyString("密匙不能为空"),
        token: orm.enforce.ranges.length(64, 64, "密匙长度必须为64位"),
        type: orm.enforce.required("用户类型不能为空"),
        type: orm.enforce.lists.inside([ "normal", "admin" ], "非法用户类型"),
        date: orm.enforce.required("日期不能为空"),
        expiration: orm.enforce.required("过期日期不能为空")
      }
    });
  },
  /**
   * @public
   * @desc
   * called after models are defined
  **/
  after: function(orm, db) {
    var ApiToken = db.models.ApiToken;
    var User = db.models.User;

    // set user
    ApiToken.hasOne("user", User);
  }
};
