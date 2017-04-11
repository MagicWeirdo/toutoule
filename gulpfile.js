const gulp = require("gulp");
const $http = require("./test/$http");

// 管理员登录
gulp.task("adminLogin", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 80,
    path: "/admin/login"
  }, {
    username: "admin",
    password: "wamysys5054362"
  }).then(function(response) {
    console.log(response);
  });
});

// 管理员修改密码
gulp.task("adminModifyPassword", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 80,
    path: "/admin/modifyPassword",
    headers: {
      "Authorization": "b9e96926f32c0f10250c013fa04a68984b99381ca8db1af03f9e18b3f8581b8f"
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
    port: 80,
    path: "/user/login"
  }, {
    username: "2017460",
    password: "123456789"
  }).then(function(response) {
    console.log(response);
  });
});

// 普通用户修改密码
gulp.task("userModifyPassword", function() {
  $http.post({
    hostname: "127.0.0.1",
    port: 80,
    path: "/user/modifyPassword",
    headers: {
      "Authorization": "8fb9c22cf6eb025fdacf378dff6bea49f86cf8bd20cea4f89a173aaf3adcd91a"
    }
  }, {
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
    port: 80,
    path: "/user/generate",
    headers: {
      "Authorization": "719d9348c2cb10d5f55ed51d704358b551c30cae6a5636d99696fad871dfba09"
    }
  }).then(function(response) {
    console.log(response);
  });
});
