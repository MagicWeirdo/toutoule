$(document).ready(function() {
  // makeLoginForm();

  // // 顺序加载 js
  // function loadJS(url, success) {
  //   var domScript = document.createElement("script");
  //   domScript.src = url;
  //   success = success || function() {};
  //   domScript.onload = domScript.onreadystatechange = function() {
  //     if(!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
  //       success();
  //       this.onload = this.onreadystatechange = null;
  //       this.parentNode.removeChild(this);
  //     }
  //   }
  //   document.getElementsByTagName('head')[0].appendChild(domScript);
  // }

  // 制作对话框
  function makeDialog(msg) {
    $("body").append(
      "<div class=\"dialog\">" +
      "<div class=\"dialog\-header\">" +
      "<div class=\"close\-button\"></div>" +
      "</div>" +
      "<div class=\"dialog\-body\">" +
      "<p>" + msg + "</p>" +
      "</div>"
    );

    $(".dialog").css("margin-top", 0 - $(".dialog").outerHeight() / 2);
    $(".dialog").css("margin-left", 0 - $(".dialog").outerWidth() / 2);
    $(".close-button").click(function() {
      $(".dialog").detach();
    });
  }

  makeDialog(startGame);

  // makeLoginForm();

  // // 加载 js 文件
  // loadJS("/socket.io/socket.io.js", function() {
  //   loadJS("/static/js/phaser.js", function() {
  //     loadJS("/static/js/game.js", function() {
  //       // makeDialog("脚本加载");
  //       start();
  //     });
  //   });
  // });
});

// 生成登录框
function makeLoginForm() {
  // 移除所有界面元素
  $("body").empty();

  $("body").addClass("background");
  $("body").append(
    "<div id=\"login-form\">" +
    "<div id=\"wrapper\">" +
    "<input type=\"text\" id=\"username\" placeholder=\"请输入用户名\">" +
    "<input type=\"password\" id=\"password\" placeholder=\"请输入密码\">" +
    "<div id=\"login-button\"></div>" +
    "<div id=\"forget-button\"></div>" +
    "</div>" +
    "</div>" +
    "<div id=\"ground\"></div>"
  );

  // 注册登录按钮点击事件
  $("#login-button").click(function() {
    $.post(
      "/user/login",
      JSON.stringify({
        username: $("#username").val(),
        password: $("#password").val()
      }),
      function(data) {
        if(data.isError) {
          makeDialog(data.errorMessage);
        }else {
          Cookies.set("username", $("#username").val());
          Cookies.set("token", data.result.token);

          start();
        }
      },
      "json"
    );
  });

  $("#forget-button").click(function() {
    makeForgetForm();
  });
}

// 生成修改密码框
function makeForgetForm() {
  $("body").empty();

  $("body").addClass("background");
  $("body").append(
    "<div id=\"forget-form\">" +
    "<div id=\"wrapper\">" +
    "<input type=\"user\" id=\"user\" placeholder=\"请输入用户名\">" +
    "<input type=\"password\" id=\"oldPassword\" placeholder=\"请输入旧密码\">" +
    "<input type=\"password\" id=\"newPassword\" placeholder=\"请输入新密码\">" +
    "<div id=\"change-button\"></div>" +
    "<div id=\"return-button\"></div>" +
    "</div>" +
    "</div>" +
    "<div id=\"ground\"></div>"
  );

  $("#change-button").click(function() {
    $.post(
      "/user/modifyPassword",
      JSON.stringify({
        username: $("#user").val(),
        oldPassword: $("#oldPassword").val(),
        newPassword: $("#newPassword").val()
      }),
      function(data) {
        if(data.isError) {
          makeDialog(data.errorMessage);
        }else {
          makeLoginForm();
        }
      },
      "json"
    );
  });

  $("#return-button").click(function() {
    makeLoginForm()
  });
}

// 制作对话框
function makeDialog(msg) {
  $("body").append(
    "<div class=\"dialog\">" +
    "<div class=\"dialog\-header\">" +
    "<div class=\"close\-button\"></div>" +
    "</div>" +
    "<div class=\"dialog\-body\">" +
    "<p>" + msg + "</p>" +
    "</div>"
  );

  $(".dialog").css("margin-top", 0 - $(".dialog").outerHeight() / 2);
  $(".dialog").css("margin-left", 0 - $(".dialog").outerWidth() / 2);
  $(".close-button").click(function() {
    $(".dialog").detach();
  });
}

function start() {
  // 清除对话框
  $("body").empty();

  // 清除背景
  $("body").removeClass("background");

  // canvas container
  $("body").append("<div id=\"canvas\"></div>");

  startGame();
}
