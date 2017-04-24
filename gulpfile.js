const gulp = require("gulp");
const $http = require("./test/$http");

// 管理员登录
gulp.task("adminLogin", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/admin/login"
  }, {
    username: "admin",
    password: "admin"
  }).then(function(response) {
    console.log(response);
  });
});

// 管理员修改密码
gulp.task("adminModifyPassword", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/admin/modifyPassword",
    headers: {
      "Authorization": "1cec4f36b13ca31cd35301fcdede474b9b40d5aa94440a744edec98f5bbb509c"
    }
  }, {
    oldPassword: "admin",
    newPassword: "wamysys5054362"
  }).then(function(response) {
    console.log(response);
  });
});

// 普通用户登录
gulp.task("userLogin", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/login"
  }, {
    username: "20174130",
    password: "123456789"
  }).then(function(response) {
    console.log(response);
  });
});

// 普通用户修改密码
gulp.task("userModifyPassword", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/modifyPassword"
  }, {
    username: "20174130",
    oldPassword: "123456789",
    newPassword: "wamysys5054362"
  }).then(function(response) {
    console.log(response);
  });
});

// 生成新用户
gulp.task("generateUser", function() {
  $http.get({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/generate",
    headers: {
      "Authorization": "673b5260e731580c6dab6bc90c29b994e375e61e99093c189797823e0fb7c052"
    }
  }).then(function(response) {
    console.log(response);
  });
});

// 获取用户数量
gulp.task("getUserCount", function() {
  $http.get({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/count",
    headers: {
      "Authorization": "1cec4f36b13ca31cd35301fcdede474b9b40d5aa94440a744edec98f5bbb509c"
    }
  }).then(function(response) {
    console.log(response);
  });
});

// 获取用户列表
gulp.task("listUsers", function() {
  $http.get({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/list?start=0&end=5",
    headers: {
      "Authorization": "1cec4f36b13ca31cd35301fcdede474b9b40d5aa94440a744edec98f5bbb509c"
    }
  }).then(function(response) {
    console.log(response.data.result);
  });
});

// 添加用户备注
gulp.task("saveUserExtra", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/extra",
    headers: {
      "Authorization": "1cec4f36b13ca31cd35301fcdede474b9b40d5aa94440a744edec98f5bbb509c"
    }
  }, {
    userId: 2,
    extra: "haha"
  }).then(function(response) {
    console.log(response);
  });
});

// 获取用户信息
gulp.task("getUserInfo", function() {
  $http.get({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/info?username=20174180",
    headers: {
      "Authorization": "1cec4f36b13ca31cd35301fcdede474b9b40d5aa94440a744edec98f5bbb509c"
    }
  }).then(function(response) {
    console.log(response);
  });
});

// 给用户充值
gulp.task("topUpCoin", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/coin/topup",
    headers: {
      "Authorization": "1cec4f36b13ca31cd35301fcdede474b9b40d5aa94440a744edec98f5bbb509c"
    }
  }, {
    username: "20174180",
    amount: 100
  }).then(function(response) {
    console.log(response);
  });
});

// 获取用户金额数目
gulp.task("getUserCoinAmount", function() {
  $http.get({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/user/coin/amount",
    headers: {
      "Authorization": "d98593167ab8cad67de762a58e0189a4f05e6e1bccc79acfb45048fab62ee9f7"
    }
  }).then(function(response) {
    console.log(response);
  });
});

// 获取用户游戏记录
gulp.task("listUserGameRecords", function() {
  $http.get({
    hostname: "127.0.0.1",
    port: 8080,
    path: "/game/history/user/list?username=20174220&start=0&end=5",
    headers: {
      "Authorization": "a9ddc29425209eef31f694c64be0fcc42d18d0e2e3f9dabcda274c5bf8281ad7"
    }
  }).then(function(response) {
    console.log(response.data);
  });
});

// **** remote ****
// 管理员登录
gulp.task("adminLoginRemote", function() {
  $http.post({
    hostname: "119.23.142.44",
    port: 8080,
    path: "/admin/login"
  }, {
    username: "admin",
    password: "admin"
  }).then(function(response) {
    console.log(response);
  });
});

// 生成新用户
gulp.task("generateUserRemote", function() {
  $http.get({
    hostname: "119.23.142.44",
    port: 8080,
    path: "/user/generate",
    headers: {
      "Authorization": "a7849c298c12751aa67a103f618b5a65cee7d4bb3747d8954f87db08aa1017f9"
    }
  }).then(function(response) {
    console.log(response);
  });
});
