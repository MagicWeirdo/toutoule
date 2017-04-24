module.exports = {
  scope: "singleton",
  name: "$utils",
  factory: function($date) {
    return {
      /**
       * @public
       * @return {String}
      **/
      getTodayPrefix: function() {
        // 获取当前时间
        var now = $date.now();
        var year = new String(now.getYear());
        var month = new String(now.getMonth());
        var day = new String(now.getDay());

        // 裁剪年份
        year = year.substring(2);
        month = month.length < 2 ? "0" + month : month;
        day = day.length < 2 ? "0" + day : day;

        return year + "" + month + "" + day;
      },
      /**
       * @public
       * @param {Number} code
       * @return {String}
       * @desc
       * transfer to suffix
      **/
      toSuffix: function(code) {
        code = new String(code);
        var num = 4 - code.length;

        for(var i = 0;i < num;i++) {
          code = "0" + code;
        }

        return code;
      }
    };
  }
};
