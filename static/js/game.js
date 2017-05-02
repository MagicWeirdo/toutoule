/* jshint esversion: 3 */

function startGame() {
  // open WebSocket
  var socket = io();

  // 告知服务器新玩家加入
  socket.emit("newPlayer", {
    token: Cookies.get("token"),
    type: "normal"
  });

  var game = new Phaser.Game(
    $(window).width() > $("body").outerWidth() ? $(window).width() : $("body").outerWidth(),
    $(window).height() > $("body").outerHeight() ? $(window).height() : $("body").outerHeight(),
    Phaser.CANVAS,
    "canvas",
    {
      preload: preload,
      create: create,
      update: update,
      render: render
    }
  );

  // 触碰场景
  var touchScene;
  var song;
  var buttonSound;
  var moneyButtonSound;
  var rotateSound;

  // 主场景
  var mainScene;
  var msUsernameText;
  var msCoinText;
  var msStatusText;
  var msReadyButton;
  var msAlreadyButton;
  var bulletinText;

  // 游戏场景
  var gameScene;
  var gsUsernameText;
  var gsCoinText;
  var gsStatusText;
  var resultDanBanner;
  var resultShuangBanner;
  var result1Banner;
  var result2Banner;
  var result3Banner;
  var result4Banner;
  var result5Banner;
  var result6Banner;
  var gsBannerText;
  var gsResultText;
  var gsDice1;
  var gsDice2;
  var gsDice3;
  var baoziButton;
  var dice1;
  var ya1;
  var dice2;
  var ya2;
  var dice3;
  var ya3;
  var dice4;
  var ya4;
  var dice5;
  var ya5;
  var dice6;
  var ya6;
  var danButton;
  var yiyadanButton;
  var shuangButton;
  var yiyashuangButton;
  var gsInputText;
  var gsYesButton;
  var gsStakedButton;

  // 业务相关
  var scene;
  var state = "offline";
  var allowStake = true;
  var ownedCoin = 0; // 用户所拥有的金币数量
  var stake = {
    type: "",
    coin: 0
  };

  function preload() {
    // 进度条文字
    var progressText = game.add.text(game.world.centerX, game.world.centerY, "0%", {
      fill: "#FFFFFF",
      fontSize: "36px"
    });
    progressText.anchor.set(0.5);

    // 监听进度
    game.load.onLoadStart.add(function() {
      var progressInterval = setInterval(function() {
        progressText.text = game.load.progress + "%";

        if(game.load.progress === 100) {
          clearInterval(progressInterval);
        }
      }, 50);
    });

    game.load.image("background", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/background.png");
    game.load.image("usernameBanner", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/username.png");
    game.load.image("coinBanner", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/coin.png");
    game.load.image("statusBanner", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/time.png");
    game.load.image("bulletinBanner", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/bulletin.png");
    game.load.image("buttonGroupBackground", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/btn_bg.png");
    game.load.image("readyButton", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/ready.png");
    game.load.image("alreadyButton", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/have_readied.png");
    game.load.image("cancelButton", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/cancel.png");
    game.load.image("playArea", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/play_area.png");
    game.load.image("stakeArea", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/stack_area.png");
    game.load.image("baozi", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/baozi.png");
    game.load.image("dan", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/dan.png");
    game.load.image("yiyadan", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/yiyadan.png");
    game.load.image("shuang", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/shuang.png");
    game.load.image("yiyashuang", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/yiyashuang.png");
    game.load.image("money5", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/5.png");
    game.load.image("money10", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/10.png");
    game.load.image("money20", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/20.png");
    game.load.image("money50", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/50.png");
    game.load.image("input", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/input.png");
    game.load.image("yes", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/queding.png");
    game.load.image("staked", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/yiyazhu.png");
    game.load.image("back", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/back.png");
    game.load.image("message", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/message.png");
    game.load.image("transparent", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/transparent.png");
    game.load.image("ya1", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/ya1.png");
    game.load.image("ya2", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/ya2.png");
    game.load.image("ya3", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/ya3.png");
    game.load.image("ya4", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/ya4.png");
    game.load.image("ya5", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/ya5.png");
    game.load.image("ya6", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/ya6.png");
    game.load.atlasJSONHash("dice", "/static/assets/dice.png", "/static/assets/dice.json");
    game.load.image("resultDan", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/result_dan.png");
    game.load.image("resultShuang", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/result_shuang.png");
    game.load.image("result1", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/result1.png");
    game.load.image("result2", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/result2.png");
    game.load.image("result3", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/result3.png");
    game.load.image("result4", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/result4.png");
    game.load.image("result5", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/result5.png");
    game.load.image("result6", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/result6.png");
    game.load.image("baozi1", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/baozi/1.png");
    game.load.image("baozi2", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/baozi/2.png");
    game.load.image("baozi3", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/baozi/3.png");
    game.load.image("baozi4", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/baozi/4.png");
    game.load.image("baozi5", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/baozi/5.png");
    game.load.image("baozi6", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/assets/baozi/5.png");
    game.load.audio("song", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/song/background.mp3");
    game.load.audio("buttonSound", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/song/tick.wav");
    game.load.audio("moneyButtonSound", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/song/button.wav");
    game.load.audio("rotateSound", "http://toutoule.oss-cn-shenzhen.aliyuncs.com/game/song/rotate.mp3");

    console.log("游戏资源加载");
  }

  function create() {
    // 初始化 & 播放背景音乐
    song = game.add.audio("song");
    buttonSound = game.add.audio("buttonSound");
    moneyButtonSound = game.add.audio("moneyButtonSound");
    rotateSound = game.add.audio("rotateSound");
    game.sound.setDecodedCallback([song, buttonSound, moneyButtonSound], function() {
      song.loopFull(0.5);
    }, this);

    // 初始化场景
    initTouchScene();
    initMainScene();
    initGameScene();

    // 显示主场景
    touchScene.visible = true;
    scene = "touchScene";

    // Tap & 播放音乐 & 切换场景
    function tapToPlayMusic() {
      // 播放点击音乐
      buttonSound.play();

      // 隐藏触碰界面
      touchScene.visible = false;

      // 显示主界面
      mainScene.visible = true;
      scene = "mainScene";

      // 告知服务器加载完成
      socket.emit("fullyLoaded");
      isServerNotified = true;

      // 移除监听器
      game.input.onTap.remove(tapToPlayMusic);

      console.log("监听器被删除");
    }

    // 注册点击事件
    game.input.onTap.add(tapToPlayMusic);

    // Touch lock & 播放音乐 & 切换场景
    function touchLockPlayMusic() {
      // 播放点击音乐
      buttonSound.play();

      // 隐藏触碰界面
      touchScene.visible = false;

      // 显示主界面
      mainScene.visible = true;
      scene = "mainScene";

      // 告知服务器加载完成
      socket.emit("fullyLoaded");
      isServerNotified = true;

      // 移除监听器
      game.input.touch.removeTouchLockCallback(touchLockPlayMusic);

      console.log("监听器被删除");
    }

    // 注册触碰事件
    game.input.touch.addTouchLockCallback(touchLockPlayMusic);

    // 获取和更新用户信息
    getUserInfo(function(data) {
      msUsernameText.text = data.username;
      msCoinText.text = data.coin;
    });

    // 监听服务发送过来的积分改变
    socket.on("updateCoin", function(data) {
      // 判断场景
      if(scene === "mainScene") {
        msCoinText.text = data.coin;
      }else if(scene === "gameScene") {
        gsCoinText.text = data.coin;
      }
    });

    // 接收游戏状态改变
    socket.on("updateStatus", function(data) {
      switch (data.state) {
        case "offline":
          // 修改状态
          msStatusText.text = "游戏系统关闭中";

          // 修改按钮
          msReadyButton.visible = true;
          msAlreadyButton.visible = false;

          state = "offline";
          break;
        case "online":
          msStatusText.text = "游戏系统开放中";

          state = "online";
          break;
        case "preparingCountDown":
          // 判断场景
          if(scene === "mainScene") {
            msStatusText.text = "距离游戏开始还有" + data.tick + "秒";
          }else {
            gsStatusText.visible = true;
            gsStatusText.text = "距离游戏开始还有" + data.tick + "秒";
          }

          state = "preparingCountDown";
          break;
        case "loading":
          msStatusText.text = "游戏加载中";
          state = "loading";
          break;
        case "gaming":
          msStatusText.text = "游戏正在进行中";
          state = "gaming";
          break;
        case "gamingCountDown":
          // 判断场景
          if(scene === "mainScene") {
            // 判断是否为初次推送
            if(data.tick === undefined) {
              msStatusText.text = "距离下轮游戏开始还有0秒";
            }else {
              msStatusText.text = "距离下轮游戏开始还有" + data.tick + "秒";
            }
          }else {
            // 显示秒数
            gsBannerText.text = "距离押注时间结束还有" + data.tick + "秒";

            // 如果计时为 0，则不准押注
            if(data.tick === 0) {
              allowStake = false;
            }
          }

          state = "gamingCountDown";
          break;
        case "onWait":
          // 判断场景
          if(scene === "mainScene") {
            msStatusText.text = "等待结果";
          }else {
            // 隐藏状态文字
            gsBannerText.visible = false;

            // 显示骰子
            gsDice1.visible = true;
            gsDice2.visible = true;
            gsDice3.visible = true;

            // 播放骰子转动音乐
            rotateSound.loopFull();

            // 转动骰子
            gsDice1.play("rotate");
            gsDice2.play("rotate");
            gsDice3.play("rotate");
          }

          break;
        case "calculateResult":
          // 判断场景
          if(scene === "mainScene") {
            msStatusText.text = "正在计算结果";
          }

          state = "calculateResult";
          break;
        case "onResult":
          // 判断场景
          if(scene === "mainScene") {
            msStatusText.text = "等待结果中";
          }

          state = "onResult";
          break;
        case "waitting":
          msStatusText.text = "等待结束中";
          state = "waitting";
          break;
      }
    });

    // 监听公告更新
    socket.on("updateBulletin", function(data) {
      console.log("接收到公告");

      // 获取值 & 分空格
      var content = data.content;
      var text = "";

      for(var i = 0;i < content.length;i++) {
        if(i === 0) {
          text += content.charAt(i);
        }else {
          text += " " + content.charAt(i);
        }
      }

      // 更新公告栏
      bulletinText.text = text;
    });

    // 重置游戏界面
    function resetGameScene() {
      // 停止播放骰子已
      rotateSound.stop();

      // 隐藏和重置游戏界面
      gameScene.visible = false;
      gsUsernameText.text = "无";
      gsCoinText.text = "0";
      gsStatusText.text = "";
      gsBannerText.text = "等待";
      gsResultText.text = "";
      gsResultText.visible = false;

      // 隐藏状态栏
      gsStatusText.visible = false;

      // 显示等待栏
      gsBannerText.visible = true;

      // 重置结果栏
      resultDanBanner.visible = false;
      resultShuangBanner.visible = false;
      result1Banner.visible = false;
      result2Banner.visible = false;
      result3Banner.visible = false;
      result4Banner.visible = false;
      result5Banner.visible = false;
      result6Banner.visible = false;

      // 停止动画
      if(gsDice1.currentAnim) {
        gsDice1.currentAnim.stop(true);
      }

      if(gsDice2.currentAnim) {
        gsDice2.currentAnim.stop(true);
      }

      if(gsDice3.currentAnim) {
        gsDice3.currentAnim.stop(true);
      }

      // 隐藏骰子
      gsDice1.visible = false;
      gsDice2.visible = false;
      gsDice3.visible = false;

      // 重置 baoziButton
      baoziButton.visible = true;
      dice1.visible = false;
      dice2.visible = false;
      dice3.visible = false;
      dice4.visible = false;
      dice5.visible = false;
      dice6.visible = false;
      ya1.visible = false;
      ya2.visible = false;
      ya3.visible = false;
      ya4.visible = false;
      ya5.visible = false;
      ya6.visible = false;

      // 重置 danButton
      danButton.visible = true;
      yiyadanButton.visible = false;

      // 重置 shuangButton
      shuangButton.visible = true;
      yiyashuangButton.visible = false;

      gsInputText.text = "0";

      // 修改按钮
      gsYesButton.visible = true;
      gsStakedButton.visible = false;

      // 重置 stake
      stake.type = "";
      stake.coin = 0;

      // 允许押注
      allowStake = true;
    }

    // 服务器通知加入游戏
    socket.on("joinGame", function() {
      // 重置按钮
      msReadyButton.visible = true;
      msAlreadyButton.visible = false;

      // 重置游戏场景
      resetGameScene();

      // 切换场景
      mainScene.visible = false;
      gameScene.visible = true;

      // 获取用户信息
      getUserInfo(function(data) {
        gsUsernameText.text = data.username;
        gsCoinText.text = data.coin;

        // 更新用户所拥有的金币数量
        ownedCoin = data.coin;
      });

      // 更改游戏场景
      scene = "gameScene";

      // 告诉服务器游戏加载完成
      socket.emit("loaded");
    });

    // 服务器通知被踢出
    socket.on("kick", function() {
      console.log("被踢");

      // 停止播放骰子已
      rotateSound.stop();

      // 隐藏和重置游戏界面
      gameScene.visible = false;
      gsUsernameText.text = "无";
      gsCoinText.text = "0";
      gsStatusText.text = "";
      gsBannerText.text = "等待";
      gsResultText.text = "";
      gsResultText.visible = false;

      // 隐藏状态栏
      gsStatusText.visible = false;

      // 重置结果栏
      resultDanBanner.visible = false;
      resultShuangBanner.visible = false;
      result1Banner.visible = false;
      result2Banner.visible = false;
      result3Banner.visible = false;
      result4Banner.visible = false;
      result5Banner.visible = false;
      result6Banner.visible = false;

      // 停止动画
      if(gsDice1.currentAnim) {
        gsDice1.currentAnim.stop(true);
      }

      if(gsDice2.currentAnim) {
        gsDice2.currentAnim.stop(true);
      }

      if(gsDice3.currentAnim) {
        gsDice3.currentAnim.stop(true);
      }

      // 隐藏骰子
      gsDice1.visible = false;
      gsDice2.visible = false;
      gsDice3.visible = false;

      // 重置danButton
      danButton.visible = true;
      yiyadanButton.visible = false;

      gsInputText.text = "0";

      // 修改按钮
      gsYesButton.visible = true;
      gsStakedButton.visible = false;

      // 显示主界面
      mainScene.visible = true;

      // 切换场景
      scene = "mainScene";

      // 重置 stake
      stake.type = "";
      stake.coin = 0;

      // 允许押注
      allowStake = true;

      // 更新用户信息
      getUserInfo(function(data) {
        msUsernameText.text = data.username;
        msCoinText.text = data.coin;
      });

      // 向服务器请求获取公告
      socket.emit("getBulletin");
    });

    // 服务器告知结果
    socket.on("result", function(data) {
      // 停止旋转
      gsDice1.animations.stop("rotate");
      gsDice2.animations.stop("rotate");
      gsDice3.animations.stop("rotate");

      // 开始动画
      var anim1 = gsDice1.play("rotateTo" + data.dice1);
      var anim2 = gsDice2.play("rotateTo" + data.dice2);
      var anim3 = gsDice3.play("rotateTo" + data.dice3);

      var numOffinished = 0;

      anim1.onComplete.add(function() {
        numOffinished++;
      });

      anim2.onComplete.add(function() {
        numOffinished++;
      });

      anim3.onComplete.add(function() {
        numOffinished++;
      });

      // 等待动画播放完成
      var waitInterval = setInterval(function() {
        if(numOffinished === 3) {
          clearInterval(waitInterval);

          // 停止播放骰子转动音乐
          rotateSound.stop();

          // 显示结果文字
          gsResultText.visible = true;
          gsResultText.text = data.dice1 + data.dice2 + data.dice3;

          if(data.type === "d") {
            resultDanBanner.visible = true;
          }else if(data.type === "s") {
            resultShuangBanner.visible = true;
          }else if(data.type === "b1") {
            result1Banner.visible = true;
          }else if(data.type === "b2") {
            result2Banner.visible = true;
          }else if(data.type === "b3") {
            result3Banner.visible = true;
          }else if(data.type === "b4") {
            result4Banner.visible = true;
          }else if(data.type === "b5") {
            result5Banner.visible = true;
          }else if(data.type === "b6") {
            result6Banner.visible = true;
          }

          // 等待 1 秒
          setTimeout(function() {
            // 告知服务器
            socket.emit("end");

            // 再次获取积分
            getUserInfo(function(data) {
              gsUsernameText.text = data.username;
              gsCoinText.text = data.coin;
            });
          }, 1000);
        }
      }, 1000);
    });
  }

  function update() {

  }

  function render() {

  }

  function initTouchScene() {
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;

    // touchScene scene
    touchScene = game.add.group();
    touchScene.x = 0;
    touchScene.y = 0;
    touchScene.z = 0;
    touchScene.visible = false;

    // background
    var background = game.add.image(0, 0, "background");
    background.width = displayWidth;
    background.height = displayHeight;
    touchScene.add(background);

    // hint text
    var hintText = game.add.text(displayWidth / 2, displayHeight / 2, "请触触碰屏幕的任意地方", {
      fill: "#9D662C",
      fontSize: "24px",
      stroke: "#FFFFFF",
      strokeThickness: 5
    });
    hintText.anchor.set(0.5);
    touchScene.add(hintText);
  }

  // 初始化主场景
  function initMainScene() {
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;

    // mainScene scene
    mainScene = game.add.group();
    mainScene.x = 0;
    mainScene.y = 0;
    mainScene.z = 0;
    mainScene.visible = false;

    var totalHeight = 0;

    // background
    var background = game.add.image(0, 0, "background");
    background.width = displayWidth;
    background.height = displayHeight;
    mainScene.add(background);

    // header group
    var headerGroup = game.add.group(mainScene);
    headerGroup.x = 0;
    headerGroup.y = 0;
    headerGroup.z = 0;

    // username group
    var usernameGroup = game.add.group(headerGroup);
    usernameGroup.x = 12;
    usernameGroup.y = 12;
    usernameGroup.z = 0;

    // username banner
    var usernameBanner = game.add.image(0, 0, "usernameBanner");
    usernameBanner.width = displayWidth * 0.3;
    usernameBanner.height = usernameBanner.width / (228 / 65);
    usernameGroup.add(usernameBanner);

    // username text
    msUsernameText = game.add.text(usernameBanner.width * 0.35, usernameBanner.height * 0.3, "无", {
      fill: "#FFFFFF",
      fontSize: usernameBanner.height * 0.4 + "px",
      fontWeight: "bold"
    });
    usernameGroup.add(msUsernameText);

    // coin group
    var coinGroup = game.add.group(headerGroup);
    coinGroup.x = displayWidth * 0.7 - 12;
    coinGroup.y = 12;
    coinGroup.z = 0;

    // coin banner
    var coinBanner = game.add.image(0, 0, "coinBanner");
    coinBanner.width = displayWidth * 0.3;
    coinBanner.height = coinBanner.width / (250 / 68);
    coinGroup.add(coinBanner);

    // coin text
    msCoinText = game.add.text(coinBanner.width * 0.35, coinBanner.height * 0.3, "0", {
      fill: "#FFFFFF",
      fontSize: coinBanner.height * 0.4 + "px",
      fontWeight: "bold"
    });
    coinGroup.add(msCoinText);

    // 累计高度
    totalHeight += coinBanner.height + 12;

    // status group
    var statusGroup = game.add.group(mainScene);
    statusGroup.x = displayWidth * 0.22;
    statusGroup.y = totalHeight + displayHeight * 0.075;
    statusGroup.z = 0;

    // status banner
    var statusBanner = game.add.image(0, 0, "statusBanner");
    statusBanner.width = displayWidth * 0.56;
    statusBanner.height = statusBanner.width / (455 / 113);
    statusGroup.add(statusBanner);

    // status text
    msStatusText = game.add.text(statusBanner.width / 2, statusBanner.height / 2, "游戏系统关闭中", {
      fill: "#9D662C",
      fontSize: statusBanner.height * 0.28 + "px",
      stroke: "#FFFFFF",
      strokeThickness: 5
    });
    msStatusText.anchor.set(0.5);
    statusGroup.add(msStatusText);

    totalHeight += statusBanner.height + displayHeight * 0.1;

    // bulletin
    var bulletinGroup = game.add.group(mainScene);
    bulletinGroup.x = (displayWidth * 0.4) / 2;
    bulletinGroup.y = totalHeight + 12;
    bulletinGroup.z = 0;

    // bulletin banner
    var bulletinBanner = game.add.image(0, 0, "bulletinBanner");
    bulletinBanner.width = displayWidth * 0.6;
    bulletinBanner.height = bulletinBanner.width / (525 / 750);
    bulletinGroup.add(bulletinBanner);

    // bulletin text
    bulletinText = game.add.text(bulletinBanner.width / 2, bulletinBanner.height / 2, "暂 无 公 告", {
      fill: "#9D662C",
      fontSize: "16px",
      stroke: "#FFFFFF",
      strokeThickness: 5,
      align: "left",
      boundsAlignH: "left",
      boundsAlignV: "top",
      wordWrap: true,
      wordWrapWidth: bulletinBanner.width * 0.8
    });
    bulletinText.anchor.set(0.5);
    bulletinText.setTextBounds(0, 0, bulletinBanner.width * 0.8, bulletinBanner.height * 0.8);
    bulletinGroup.add(bulletinText);

    totalHeight += bulletinBanner.height + 12;

    // button group
    var buttonGroup = game.add.group(mainScene);
    buttonGroup.x = 0;
    buttonGroup.y = totalHeight;
    buttonGroup.z = 0;

    // button group background
    var buttonGroupBackground = game.add.image((displayWidth * 0.6) / 2, 0 - (((displayWidth * 0.4) / (420 / 109)) / 2), "buttonGroupBackground");
    buttonGroupBackground.width = displayWidth * 0.4;
    buttonGroupBackground.height = buttonGroupBackground.width / (420 / 109);
    buttonGroup.add(buttonGroupBackground);

    // ready button
    msReadyButton = game.add.button((displayWidth * 0.6) / 2 + 2, 0 - (((displayWidth * 0.2) / (207 / 100)) / 2), "readyButton", function() {
      console.log("准备游戏");
      console.log("游戏状态：" + state);

      // 只有当 online 和 preparingCountDown 状态时才能准备
      if(state === "online" || state === "preparingCountDown") {
        buttonSound.play();

        msReadyButton.visible = false;
        msAlreadyButton.visible = true;

        // 告知服务器玩家已准备
        socket.emit("ready");

        console.log("成功准备游戏");
      }
    });
    msReadyButton.width = displayWidth * 0.2;
    msReadyButton.height = msReadyButton.width / (207 / 100);
    buttonGroup.add(msReadyButton);

    // already button
    msAlreadyButton = game.add.button((displayWidth * 0.6) / 2 + 2, 0 - (((displayWidth * 0.2) / (207 / 100)) / 2), "alreadyButton");
    msAlreadyButton.width = displayWidth * 0.2;
    msAlreadyButton.height = msAlreadyButton.width / (207 / 97);
    msAlreadyButton.visible = false;
    buttonGroup.add(msAlreadyButton);

    // cancel button
    var cancelButton = game.add.button((displayWidth * 0.6) / 2 + msReadyButton.width - 2, 0 - (((displayWidth * 0.2) / (207 / 100)) / 2), "cancelButton", function() {
      // 只有当 online 和 preparingCountDown 状态时才能取消准备
      if((state === "online" || state === "preparingCountDown") && msAlreadyButton.visible === true) {
        buttonSound.play();

        msReadyButton.visible = true;
        msAlreadyButton.visible = false;

        // 告知服务器玩家取消准备
        socket.emit("unready");
      }
    });
    cancelButton.width = displayWidth * 0.2;
    cancelButton.height = cancelButton.width / (207 / 100);
    buttonGroup.add(cancelButton);
  }

  // 初始化游戏场景
  function initGameScene() {
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;

    // game scene
    gameScene = game.add.group();
    gameScene.x = 0;
    gameScene.y = 0;
    gameScene.z = 0;
    gameScene.visible = false;

    var totalHeight = 0;

    // background
    var background = game.add.image(0, 0, "background");
    background.width = displayWidth;
    background.height = displayHeight;
    gameScene.add(background);

    // header group
    var headerGroup = game.add.group(gameScene);
    headerGroup.x = 0;
    headerGroup.y = 0;
    headerGroup.z = 0;

    // username group
    var usernameGroup = game.add.group(headerGroup);
    usernameGroup.x = 12;
    usernameGroup.y = 12;
    usernameGroup.z = 0;

    // username banner
    var usernameBanner = game.add.image(0, 0, "usernameBanner");
    usernameBanner.width = displayWidth * 0.3;
    usernameBanner.height = usernameBanner.width / (228 / 65);
    usernameGroup.add(usernameBanner);

    // username text
    gsUsernameText = game.add.text(usernameBanner.width * 0.35, usernameBanner.height * 0.3, "无", {
      fill: "#FFFFFF",
      fontSize: usernameBanner.height * 0.4 + "px",
      fontWeight: "bold"
    });
    usernameGroup.add(gsUsernameText);

    // coin group
    var coinGroup = game.add.group(headerGroup);
    coinGroup.x = displayWidth * 0.7 - 12;
    coinGroup.y = 12;
    coinGroup.z = 0;

    // coin banner
    var coinBanner = game.add.image(0, 0, "coinBanner");
    coinBanner.width = displayWidth * 0.3;
    coinBanner.height = coinBanner.width / (250 / 68);
    coinGroup.add(coinBanner);

    // coin text
    gsCoinText = game.add.text(coinBanner.width * 0.35, coinBanner.height * 0.3, "0", {
      fill: "#FFFFFF",
      fontSize: coinBanner.height * 0.4 + "px",
      fontWeight: "bold"
    });
    coinGroup.add(gsCoinText);

    // 累计高度
    totalHeight += coinBanner.height + 12;

    // status text
    gsStatusText = game.add.text(displayWidth / 2, totalHeight + displayHeight * 0.05, "", {
      fill: "#9D662C",
      fontSize: gsCoinText.height * 0.8 + "px",
      fontWeight: "bold",
      stroke: "#FFFFFF",
      strokeThickness: 5
    });
    gsStatusText.anchor.set(0.5, 0.0);
    gameScene.add(gsStatusText);
    gsStatusText.visible = false;

    // 累计高度
    totalHeight += gsStatusText.height;

    // play group
    var playGroup = game.add.group(gameScene);
    playGroup.x = displayWidth * 0.125;
    playGroup.y = totalHeight + displayHeight * 0.1;
    playGroup.z = 0;

    // play area
    var playArea = game.add.image(0, 0, "playArea");
    playArea.width = displayWidth * 0.75;
    playArea.height = playArea.width / (583 / 410);
    playGroup.add(playArea);

    // result dan banner
    resultDanBanner = game.add.image(playArea.width / 2, 0, "resultDan");
    resultDanBanner.width = playArea.width * 0.8;
    resultDanBanner.height = resultDanBanner.width / (400 / 150);
    resultDanBanner.anchor.set(0.5);
    playGroup.add(resultDanBanner);
    resultDanBanner.visible = false;

    // result shuang banner
    resultShuangBanner = game.add.image(playArea.width / 2, 0, "resultShuang");
    resultShuangBanner.width = playArea.width * 0.8;
    resultShuangBanner.height = resultShuangBanner.width / (400 / 150);
    resultShuangBanner.anchor.set(0.5);
    playGroup.add(resultShuangBanner);
    resultShuangBanner.visible = false;

    // result 1 banner
    result1Banner = game.add.image(playArea.width / 2, 0, "result1");
    result1Banner.width = playArea.width * 0.8;
    result1Banner.height = result1Banner.width / (400 / 150);
    result1Banner.anchor.set(0.5);
    playGroup.add(result1Banner);
    result1Banner.visible = false;

    // result 2 banner
    result2Banner = game.add.image(playArea.width / 2, 0, "result2");
    result2Banner.width = playArea.width * 0.8;
    result2Banner.height = result2Banner.width / (400 / 150);
    result2Banner.anchor.set(0.5);
    playGroup.add(result2Banner);
    result2Banner.visible = false;

    // result 3 banner
    result3Banner = game.add.image(playArea.width / 2, 0, "result3");
    result3Banner.width = playArea.width * 0.8;
    result3Banner.height = result3Banner.width / (400 / 150);
    result3Banner.anchor.set(0.5);
    playGroup.add(result1Banner);
    result3Banner.visible = false;

    // result 4 banner
    result4Banner = game.add.image(playArea.width / 2, 0, "result4");
    result4Banner.width = playArea.width * 0.8;
    result4Banner.height = result4Banner.width / (400 / 150);
    result4Banner.anchor.set(0.5);
    playGroup.add(result4Banner);
    result4Banner.visible = false;

    // result 5 banner
    result5Banner = game.add.image(playArea.width / 2, 0, "result5");
    result5Banner.width = playArea.width * 0.8;
    result5Banner.height = result5Banner.width / (400 / 150);
    result5Banner.anchor.set(0.5);
    playGroup.add(result5Banner);
    result5Banner.visible = false;

    // result 6 banner
    result6Banner = game.add.image(playArea.width / 2, 0, "result6");
    result6Banner.width = playArea.width * 0.8;
    result6Banner.height = result6Banner.width / (400 / 150);
    result6Banner.anchor.set(0.5);
    playGroup.add(result6Banner);
    result6Banner.visible = false;

    // banner text
    gsBannerText = game.add.text(playArea.width / 2, playArea.height / 2, "等待", {
      fill: "#9D662C",
      fontSize: playArea.height * 0.08 + "px",
      fontWeight: "bold",
      stroke: "#FFFFFF",
      strokeThickness: 5
    });
    gsBannerText.anchor.set(0.5);
    playGroup.add(gsBannerText);

    // result text
    gsResultText = game.add.text(playArea.width / 2, playArea.height / 2 - (playArea.height * 0.2) / (57 / 64), "", {
      fill: "#9D662C",
      fontSize: playArea.height * 0.1 + "px",
      fontWeight: "bold",
      stroke: "#FFFFFF",
      strokeThickness: 5
    });
    gsResultText.anchor.set(0.5);
    gsResultText.visible = false;
    playGroup.add(gsResultText);

    // dice group
    var diceGroup = game.add.group(playGroup);
    diceGroup.x = 0;
    diceGroup.y = 0;
    diceGroup.z = 0;

    // 骰子组合生成器
    var diceGroupGenerator = {
      dices: {
        "1": "dice_1",
        "2": "dice_2",
        "3": "dice_3",
        "4": "dice_4",
        "5": "dice_5",
        "6": "dice_6"
      },
      random: function() {
        var arr = [];
        for(var i = 0;i < 6;i++) {
          var num = Math.floor(Math.random() * (6 - 1)) + 1;
          arr.push(this.dices[num]);
          arr.push(this.dices[num]);
          arr.push(this.dices[num]);
          arr.push(this.dices[num]);
        }

        return arr;
      }
    };

    // dice1
    gsDice1 = game.add.sprite(playArea.width / 2 - playArea.height * 0.2, playArea.height / 2, "dice");
    gsDice1.width = playArea.height * 0.2;
    gsDice1.height = (playArea.height * 0.2) / (57 / 64);
    gsDice1.anchor.set(0.5);

    // 生成随机组合
    var rotateTo1Dice1Group = diceGroupGenerator.random();
    rotateTo1Dice1Group.push("dice_1");
    rotateTo1Dice1Group.push("dice_1");
    rotateTo1Dice1Group.push("dice_1");
    rotateTo1Dice1Group.push("dice_1");
    var rotateTo2Dice1Group = diceGroupGenerator.random();
    rotateTo2Dice1Group.push("dice_2");
    rotateTo2Dice1Group.push("dice_2");
    rotateTo2Dice1Group.push("dice_2");
    rotateTo2Dice1Group.push("dice_2");
    var rotateTo3Dice1Group = diceGroupGenerator.random();
    rotateTo3Dice1Group.push("dice_3");
    rotateTo3Dice1Group.push("dice_3");
    rotateTo3Dice1Group.push("dice_3");
    rotateTo3Dice1Group.push("dice_3");
    var rotateTo4Dice1Group = diceGroupGenerator.random();
    rotateTo4Dice1Group.push("dice_4");
    rotateTo4Dice1Group.push("dice_4");
    rotateTo4Dice1Group.push("dice_4");
    rotateTo4Dice1Group.push("dice_4");
    var rotateTo5Dice1Group = diceGroupGenerator.random();
    rotateTo5Dice1Group.push("dice_5");
    rotateTo5Dice1Group.push("dice_5");
    rotateTo5Dice1Group.push("dice_5");
    rotateTo5Dice1Group.push("dice_5");
    var rotateTo6Dice1Group = diceGroupGenerator.random();
    rotateTo6Dice1Group.push("dice_6");
    rotateTo6Dice1Group.push("dice_6");
    rotateTo6Dice1Group.push("dice_6");
    rotateTo6Dice1Group.push("dice_6");

    gsDice1.animations.add("rotate", diceGroupGenerator.random(), 24, true);
    gsDice1.animations.add("rotateTo1", rotateTo1Dice1Group, 30, false);
    gsDice1.animations.add("rotateTo2", rotateTo2Dice1Group, 30, false);
    gsDice1.animations.add("rotateTo3", rotateTo3Dice1Group, 30, false);
    gsDice1.animations.add("rotateTo4", rotateTo4Dice1Group, 30, false);
    gsDice1.animations.add("rotateTo5", rotateTo5Dice1Group, 30, false);
    gsDice1.animations.add("rotateTo6", rotateTo6Dice1Group, 30, false);
    gsDice1.visible = false;
    diceGroup.add(gsDice1);

    // dice2
    gsDice2 = game.add.sprite(playArea.width / 2, playArea.height / 2, "dice");
    gsDice2.width = playArea.height * 0.2;
    gsDice2.height = (playArea.height * 0.2) / (57 / 64);
    gsDice2.anchor.set(0.5);

    // 生成随机组合
    var rotateTo1Dice2Group = diceGroupGenerator.random();
    rotateTo1Dice2Group.push("dice_1");
    rotateTo1Dice2Group.push("dice_1");
    rotateTo1Dice2Group.push("dice_1");
    rotateTo1Dice2Group.push("dice_1");
    var rotateTo2Dice2Group = diceGroupGenerator.random();
    rotateTo2Dice2Group.push("dice_2");
    rotateTo2Dice2Group.push("dice_2");
    rotateTo2Dice2Group.push("dice_2");
    rotateTo2Dice2Group.push("dice_2");
    var rotateTo3Dice2Group = diceGroupGenerator.random();
    rotateTo3Dice2Group.push("dice_3");
    rotateTo3Dice2Group.push("dice_3");
    rotateTo3Dice2Group.push("dice_3");
    rotateTo3Dice2Group.push("dice_3");
    var rotateTo4Dice2Group = diceGroupGenerator.random();
    rotateTo4Dice2Group.push("dice_4");
    rotateTo4Dice2Group.push("dice_4");
    rotateTo4Dice2Group.push("dice_4");
    rotateTo4Dice2Group.push("dice_4");
    var rotateTo5Dice2Group = diceGroupGenerator.random();
    rotateTo5Dice2Group.push("dice_5");
    rotateTo5Dice2Group.push("dice_5");
    rotateTo5Dice2Group.push("dice_5");
    rotateTo5Dice2Group.push("dice_5");
    var rotateTo6Dice2Group = diceGroupGenerator.random();
    rotateTo6Dice2Group.push("dice_6");
    rotateTo6Dice2Group.push("dice_6");
    rotateTo6Dice2Group.push("dice_6");
    rotateTo6Dice2Group.push("dice_6");

    gsDice2.animations.add("rotate", diceGroupGenerator.random(), 24, true);
    gsDice2.animations.add("rotateTo1", rotateTo1Dice2Group, 30, false);
    gsDice2.animations.add("rotateTo2", rotateTo2Dice2Group, 30, false);
    gsDice2.animations.add("rotateTo3", rotateTo3Dice2Group, 30, false);
    gsDice2.animations.add("rotateTo4", rotateTo4Dice2Group, 30, false);
    gsDice2.animations.add("rotateTo5", rotateTo5Dice2Group, 30, false);
    gsDice2.animations.add("rotateTo6", rotateTo6Dice2Group, 30, false);
    gsDice2.visible = false;
    diceGroup.add(gsDice2);

    // dice3
    gsDice3 = game.add.sprite(playArea.width / 2 + playArea.height * 0.2, playArea.height / 2, "dice");
    gsDice3.width = playArea.height * 0.2;
    gsDice3.height = (playArea.height * 0.2) / (57 / 64);
    gsDice3.anchor.set(0.5);

    // 生成随机组合
    var rotateTo1Dice3Group = diceGroupGenerator.random();
    rotateTo1Dice3Group.push("dice_1");
    rotateTo1Dice3Group.push("dice_1");
    rotateTo1Dice3Group.push("dice_1");
    rotateTo1Dice3Group.push("dice_1");
    var rotateTo2Dice3Group = diceGroupGenerator.random();
    rotateTo2Dice3Group.push("dice_2");
    rotateTo2Dice3Group.push("dice_2");
    rotateTo2Dice3Group.push("dice_2");
    rotateTo2Dice3Group.push("dice_2");
    var rotateTo3Dice3Group = diceGroupGenerator.random();
    rotateTo3Dice3Group.push("dice_3");
    rotateTo3Dice3Group.push("dice_3");
    rotateTo3Dice3Group.push("dice_3");
    rotateTo3Dice3Group.push("dice_3");
    var rotateTo4Dice3Group = diceGroupGenerator.random();
    rotateTo4Dice3Group.push("dice_4");
    rotateTo4Dice3Group.push("dice_4");
    rotateTo4Dice3Group.push("dice_4");
    rotateTo4Dice3Group.push("dice_4");
    var rotateTo5Dice3Group = diceGroupGenerator.random();
    rotateTo5Dice3Group.push("dice_5");
    rotateTo5Dice3Group.push("dice_5");
    rotateTo5Dice3Group.push("dice_5");
    rotateTo5Dice3Group.push("dice_5");
    var rotateTo6Dice3Group = diceGroupGenerator.random();
    rotateTo6Dice3Group.push("dice_6");
    rotateTo6Dice3Group.push("dice_6");
    rotateTo6Dice3Group.push("dice_6");
    rotateTo6Dice3Group.push("dice_6");

    gsDice3.animations.add("rotate", diceGroupGenerator.random(), 24, true);
    gsDice3.animations.add("rotateTo1", rotateTo1Dice3Group, 30, false);
    gsDice3.animations.add("rotateTo2", rotateTo2Dice3Group, 30, false);
    gsDice3.animations.add("rotateTo3", rotateTo3Dice3Group, 30, false);
    gsDice3.animations.add("rotateTo4", rotateTo4Dice3Group, 30, false);
    gsDice3.animations.add("rotateTo5", rotateTo5Dice3Group, 30, false);
    gsDice3.animations.add("rotateTo6", rotateTo6Dice3Group, 30, false);
    gsDice3.visible = false;
    diceGroup.add(gsDice3);

    totalHeight += playArea.height + displayHeight * 0.1;

    // stake group
    var stakeGroup = game.add.group(gameScene);
    stakeGroup.x = 0;
    stakeGroup.y = totalHeight + 12;
    stakeGroup.z = 0;

    // stake area
    var stakeArea = game.add.image((displayWidth * 0.1) / 2, 0, "stakeArea");
    stakeArea.width = displayWidth * 0.9;
    stakeArea.height = stakeArea.width / (677 / 291);
    stakeGroup.add(stakeArea);

    // choice group
    var choiceGroup = game.add.group(stakeGroup);
    choiceGroup.x = displayWidth * 0.05;
    choiceGroup.y = stakeArea.height * (93 / 291);
    choiceGroup.z = 0;

    // baozi button
    baoziButton = game.add.button(displayWidth * 0.05, 0, "baozi", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        // 检查豹子按钮的状态
        if(dice1.visible === false) {
          // 显示
          dice1.visible = true;
          dice2.visible = true;
          dice3.visible = true;
          dice4.visible = true;
          dice5.visible = true;
          dice6.visible = true;

          // 隐藏
          danButton.visible = false;
          yiyadanButton.visible = false;
          shuangButton.visible = false;
          yiyashuangButton.visible = false;
        }else {
          // 隐藏
          dice1.visible = false;
          dice2.visible = false;
          dice3.visible = false;
          dice4.visible = false;
          dice5.visible = false;
          dice6.visible = false;

          // 隐藏所有的 yaX
          ya1.visible = false;
          ya2.visible = false;
          ya3.visible = false;
          ya4.visible = false;
          ya5.visible = false;
          ya6.visible = false;

          // 显示
          danButton.visible = true;
          shuangButton.visible = true;
        }

        // 押注类型设置为空
        stake.type = "";
      }
    });
    baoziButton.width = displayWidth * 0.25;
    baoziButton.height = baoziButton.width / (188 / 70);
    choiceGroup.add(baoziButton);

    var totalWidth = baoziButton.width;

    // dice1
    dice1 = game.add.button(totalWidth + displayWidth * 0.075, 0, "baozi1", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.type = "b1";

        // 被点击显示 ya1，隐藏自身
        dice1.visible = false;
        ya1.visible = true;

        // 隐藏其它的 yaX
        ya2.visible = false;
        ya3.visible = false;
        ya4.visible = false;
        ya5.visible = false;
        ya6.visible = false;

        // 显示其它的 diceX
        dice2.visible = true;
        dice3.visible = true;
        dice4.visible = true;
        dice5.visible = true;
        dice6.visible = true;
      }
    });
    dice1.width = baoziButton.height * 0.8;
    dice1.height = dice1.width / (57 / 64);
    choiceGroup.add(dice1);
    dice1.visible = false;

    // ya1
    ya1 = game.add.button(totalWidth + displayWidth * 0.075, 0, "ya1");
    ya1.width = baoziButton.height * 0.8;
    ya1.height = ya1.width / (57 / 64);
    choiceGroup.add(ya1);
    ya1.visible = false;

    totalWidth += displayWidth * 0.075 + dice1.width;

    // dice2
    dice2 = game.add.button(totalWidth + displayWidth * 0.01, 0, "baozi2", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.type = "b2";

        // 被点击显示 ya2，隐藏自身
        dice2.visible = false;
        ya2.visible = true;

        // 隐藏其它的 yaX
        ya1.visible = false;
        ya3.visible = false;
        ya4.visible = false;
        ya5.visible = false;
        ya6.visible = false;

        // 显示其它的 diceX
        dice1.visible = true;
        dice3.visible = true;
        dice4.visible = true;
        dice5.visible = true;
        dice6.visible = true;
      }
    });
    dice2.width = baoziButton.height * 0.8;
    dice2.height = dice2.width / (57 / 64);
    choiceGroup.add(dice2);
    dice2.visible = false;

    // ya2
    ya2 = game.add.button(totalWidth + displayWidth * 0.01, 0, "ya2");
    ya2.width = baoziButton.height * 0.8;
    ya2.height = ya2.width / (57 / 68);
    choiceGroup.add(ya2);
    ya2.visible = false;

    totalWidth += dice2.width + displayWidth * 0.01;

    // dice3
    dice3 = game.add.button(totalWidth + displayWidth * 0.01, 0, "baozi3", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.type = "b3";

        // 被点击显示 ya3，隐藏自身
        dice3.visible = false;
        ya3.visible = true;

        // 隐藏其它的 yaX
        ya1.visible = false;
        ya2.visible = false;
        ya4.visible = false;
        ya5.visible = false;
        ya6.visible = false;

        // 显示其它的 diceX
        dice1.visible = true;
        dice2.visible = true;
        dice4.visible = true;
        dice5.visible = true;
        dice6.visible = true;
      }
    });
    dice3.width = baoziButton.height * 0.8;
    dice3.height = dice3.width / (57 / 64);
    choiceGroup.add(dice3);
    dice3.visible = false;

    // ya3
    ya3 = game.add.button(totalWidth + displayWidth * 0.01, 0, "ya3");
    ya3.width = baoziButton.height * 0.8;
    ya3.height = ya3.width / (57 / 64);
    choiceGroup.add(ya3);
    ya3.visible = false;

    totalWidth += dice3.width + displayWidth * 0.01;

    // dice4
    dice4 = game.add.button(totalWidth + displayWidth * 0.01, 0, "baozi4", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.type = "b4";

        // 被点击显示 ya4，隐藏自身
        dice4.visible = false;
        ya4.visible = true;

        // 隐藏其它 yaX
        ya1.visible = false;
        ya2.visible = false;
        ya3.visible = false;
        ya5.visible = false;
        ya6.visible = false;

        // 显示其它的 diceX
        dice1.visible = true;
        dice2.visible = true;
        dice3.visible = true;
        dice5.visible = true;
        dice6.visible = true;
      }
    });
    dice4.width = baoziButton.height * 0.8;
    dice4.height = dice4.width / (57 / 64);
    choiceGroup.add(dice4);
    dice4.visible = false;

    // ya4
    ya4 = game.add.button(totalWidth + displayWidth * 0.01, 0, "ya4");
    ya4.width = baoziButton.height * 0.8;
    ya4.height = ya4.width / (57 / 64);
    choiceGroup.add(ya4);
    ya4.visible = false;

    totalWidth += dice4.width + displayWidth * 0.01;

    // dice 5
    dice5 = game.add.button(totalWidth + displayWidth * 0.01, 0, "baozi5", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.type = "b5";

        // 被点击时显示 ya5，隐藏自身
        dice5.visible = false;
        ya5.visible = true;

        // 隐藏其它的 yaX
        ya1.visible = false;
        ya2.visible = false;
        ya3.visible = false;
        ya4.visible = false;
        ya6.visible = false;

        // 显示其它的 diceX
        dice1.visible = true;
        dice2.visible = true;
        dice3.visible = true;
        dice4.visible = true;
        dice6.visible = true;
      }
    });
    dice5.width = baoziButton.height * 0.8;
    dice5.height = dice5.width / (57 / 64);
    choiceGroup.add(dice5);
    dice5.visible = false;

    // ya5
    ya5 = game.add.button(totalWidth + displayWidth * 0.01, 0, "ya5");
    ya5.width = baoziButton.height * 0.8;
    ya5.height = ya5.width / (57 / 64);
    choiceGroup.add(ya5);
    ya5.visible = false;

    totalWidth += dice5.width + displayWidth * 0.01;

    // dice 6
    dice6 = game.add.button(totalWidth + displayWidth * 0.01, 0, "baozi6", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.type = "b6";

        // 当被点击显示 ya6，隐藏自身
        dice6.visible = false;
        ya6.visible = true;

        // 隐藏其它的 yaX
        ya1.visible = false;
        ya2.visible = false;
        ya3.visible = false;
        ya4.visible = false;
        ya5.visible = false;

        // 显示其它的 diceX
        dice1.visible = true;
        dice2.visible = true;
        dice3.visible = true;
        dice4.visible = true;
        dice5.visible = true;
      }
    });
    dice6.width = baoziButton.height * 0.8;
    dice6.height = dice6.width / (57 / 64);
    choiceGroup.add(dice6);
    dice6.visible = false;

    // ya6
    ya6 = game.add.button(totalWidth + displayWidth * 0.01, 0, "ya6");
    ya6.width = baoziButton.height * 0.8;
    ya6.height = ya6.width / (57 / 64);
    choiceGroup.add(ya6);
    ya6.visible = false;

    totalWidth += dice6.width + displayWidth * 0.01;

    // dan button
    danButton = game.add.button(baoziButton.width + displayWidth * 0.075, 0, "dan", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.type = "d";

        // 隐藏和显示
        danButton.visible = false;
        yiyadanButton.visible = true;

        // 显示shuangButton，隐藏yiyashuangButton
        shuangButton.visible = true;
        yiyashuangButton.visible = false;
      }
    });
    danButton.width = displayWidth * 0.25;
    danButton.height = danButton.width / (188 / 70);
    choiceGroup.add(danButton);

    // yiyadan button
    yiyadanButton = game.add.button(baoziButton.width + displayWidth * 0.075, 0, "yiyadan");
    yiyadanButton.width = displayWidth * 0.25;
    yiyadanButton.height = yiyadanButton.width / (188 / 70);
    choiceGroup.add(yiyadanButton);
    yiyadanButton.visible = false;

    // shuang button
    shuangButton = game.add.button(baoziButton.width + danButton.width + displayWidth * 0.1, 0, "shuang", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.type = "s";

        // 隐藏和显示
        shuangButton.visible = false;
        yiyashuangButton.visible = true;

        // 显示danButton，隐藏yiyadanButton
        danButton.visible = true;
        yiyadanButton.visible = false;
      }
    });
    shuangButton.width = displayWidth * 0.25;
    shuangButton.height = shuangButton.width / (188 / 70);
    choiceGroup.add(shuangButton);

    // yiyashuang button
    yiyashuangButton = game.add.button(baoziButton.width + danButton.width + displayWidth * 0.1, 0, "yiyashuang");
    yiyashuangButton.width = displayWidth * 0.25;
    yiyashuangButton.height = yiyashuangButton.width / (188 / 70);
    choiceGroup.add(yiyashuangButton);
    yiyashuangButton.visible = false;

    // money group
    var moneyGroup = game.add.group(stakeGroup);
    moneyGroup.x = displayWidth * 0.05;
    moneyGroup.y = stakeArea.height * (93 / 291) + shuangButton.height + 5;
    moneyGroup.z = 0;

    // money 5
    var money5Button = game.add.button(displayWidth * 0.05, 0, "money5", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        // 修改押注金额
        stake.coin = 5 > ownedCoin ? ownedCoin : 5;

        // 显示金额
        gsInputText.text = stake.coin;
      }
    });
    money5Button.width = displayWidth * 0.1;
    money5Button.height = money5Button.width / (59 / 62);
    moneyGroup.add(money5Button);

    // money 10
    var money10Button = game.add.button(money5Button.width + displayWidth * 0.05, 0, "money10", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.coin = 10 > ownedCoin ? ownedCoin : 10;

        // 显示金额
        gsInputText.text = stake.coin;
      }
    });
    money10Button.width = displayWidth * 0.1;
    money10Button.height = money10Button.width / (59 / 62);
    moneyGroup.add(money10Button);

    // money 20
    var money20Button = game.add.button(money5Button.width + money10Button.width + displayWidth * 0.05, 0, "money20", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.coin = 20 > ownedCoin ? ownedCoin : 20;

        // 显示金额
        gsInputText.text = stake.coin;
      }
    });
    money20Button.width = displayWidth * 0.1;
    money20Button.height = money20Button.width / (59 / 63);
    moneyGroup.add(money20Button);

    // money 50
    var money50Button = game.add.button(money5Button.width + money10Button.width + money20Button.width + displayWidth * 0.05, 0, "money50", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.coin = 50 > ownedCoin ? ownedCoin : 50;

        // 显示金额
        gsInputText.text = stake.coin;
      }
    });
    money50Button.width = displayWidth * 0.1;
    money50Button.height = money50Button.width / (58 / 61);
    moneyGroup.add(money50Button);

    // input group
    var inputGroup = game.add.group(moneyGroup);
    inputGroup.x = displayWidth * 0.9 - (money5Button.width + money10Button.width + money20Button.width + displayWidth * 0.1);
    inputGroup.y = 0;
    inputGroup.z = 0;

    // input bar
    var inputBar = game.add.image(0, 0, "input");
    inputBar.width = displayWidth * 0.35;
    inputBar.height = inputBar.width / (239 / 71);
    inputGroup.add(inputBar);

    // input text
    gsInputText = game.add.text(inputBar.width * 0.35, inputBar.height * 0.3, "0", {
      fill: "#FFFFFF",
      fontSize: inputBar.height * 0.4 + "px"
    });
    inputGroup.add(gsInputText);

    totalHeight += stakeArea.height + 12;

    // add button
    var addButton = game.add.button(inputBar.width * 0.8, 0, "transparent", function() {
      // 若允许押注
      if(allowStake) {
        moneyButtonSound.play();

        stake.coin = stake.coin + 10 > ownedCoin ? ownedCoin : stake.coin + 10;

        // 检查是否押注金额超过500
        stake.coin = stake.coin > 500 ? 500 : stake.coin;

        // 显示金额
        gsInputText.text = stake.coin;
      }
    });
    addButton.width = inputBar.height;
    addButton.height = inputBar.height;
    inputGroup.add(addButton);

    // yes button
    gsYesButton = game.add.button(displayWidth * 0.35, totalHeight - displayWidth * 0.05, "yes", function() {
      // 若允许押注
      if(allowStake && stake.type !== "" && stake.coin > 0) {
        buttonSound.play();

        // 告知服务器已押注
        socket.emit("stake", stake);

        // 修改为不准押注
        allowStake = false;

        // 隐藏与显示
        gsYesButton.visible = false;
        gsStakedButton.visible = true;

        // 重置 stake
        stake.type = "";
        stake.coin = 0;
      }
    });
    gsYesButton.width = displayWidth * 0.3;
    gsYesButton.height = gsYesButton.width / (200 / 61);
    gameScene.add(gsYesButton);

    // staked button
    gsStakedButton = game.add.button(displayWidth * 0.35, totalHeight - displayWidth * 0.05, "staked");
    gsStakedButton.width = displayWidth * 0.3;
    gsStakedButton.height = gsStakedButton.width / (200 / 80);
    gsStakedButton.visible = false;
    gameScene.add(gsStakedButton);

    // back button
    var backButton = game.add.button(displayWidth * 0.1, displayHeight * 0.9, "back", function() {
      buttonSound.play();

      // 告知服务器玩家退出
      socket.emit("quit");
    });
    backButton.width = displayWidth * 0.1;
    backButton.height = backButton.width / (79 / 81);
    gameScene.add(backButton);
  }

  // 获取用户信息
  function getUserInfo(callback) {
    $.ajax(
      "/user/coin/amount",
      {
        method: "GET",
        headers: {
          "Authorization": Cookies.get("token")
        }
      }
    ).done(function(data) {
      if(data.isError === false) {
        // send info back
        callback({
          username: Cookies.get("username"),
          coin: data.result.coin
        });

        console.log("成功获取用户数据");
      }
    });
  }
}
