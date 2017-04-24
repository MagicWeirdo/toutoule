module.exports = {
  scope: "singleton",
  name: "$dateUtils",
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
      }
    };
  }
};
