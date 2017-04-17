module.exports = function($validator, $authService, $bulletinService, io) {

  /**
   * 游戏状态
   * inactive 游戏下线
   * active 游戏上线
   * inStopPeriodTick 游戏即将开始计时
   * loading 游戏加载中
   * inGame 游戏中
   * inGamePeriodTick 游戏进行时的计时
   * rotateDice 转动骰子
   * inRotateDicePeriodTick 转动骰子计时
   * inResult 游戏结果
  **/
  var status = "inactive"; // 游戏状态

  /**
   * 游戏模式
   * auto   自动
   * manual 手动
  **/
  var mode = "manual"; // 游戏模式
  var stopPeriod = 20; // 游戏结束后的时间
  var gamePeriod = 30; // 每轮游戏时间
  var dicePeriod = 10; // 骰子转动时间

  var tick;
  var tickInterval;

  // 游戏室中的玩家数量
  var players = new Map();

  // 主循环
  setInterval(function() {
    // 若为自动模式
    if(mode === "auto") {
      // 若游戏状态为上线
      if(status === "active") {
        status = "inStopPeriodTick";

        tick = stopPeriod;
        tickInterval = setInterval(function() {
          tick--;

          // 向大厅和游戏室中的玩家，通知游戏状态更细
          io.to("hall").emit("updateStatus", { status: status, tick: tick });
          io.to("game").emit("updateStatus", { status: status, tick: tick });

          // 如果计时结束
          if(tick === 0) {
            clearInterval(tickInterval);

            // 修改游戏状态为加载游戏
            status = "loading";

            // 向游戏室中的用户，通知加载游戏
            io.to("game").emit("loadGame");

            // 向大厅中的用户，通知游戏状态更新
            io.to("hall").emit("updateStatus", { status: status });
          }
        }, 1000);
      }

      // 若游戏状态为加载中
      if(status === "loading") {
        // 遍历所有玩家
        var isAllLoaded = true;
        var values = players.values();
        var value;

        while(value = values.next()) {
          if (value.isLoaded === false) {
            isAllLoaded = false;
            break;
          }
        }

        // 判断所有玩家是否加载成功
        if(isAllLoaded) {
          status = "inGame";
        }
      }

      // 若状态为在游戏中
      if(status === "inGame") {
        status = "inGamePeriodTick";

        tick = gamePeriod;
        tickInterval = setInterval(function() {
          tick--;

          // 向大厅和游戏室中的玩家，发送通知状态
          io.to("hall").emit("updateStatus", { status: status, tick: tick });
          io.to("game").emit("updateStatus", { status: status, tick: tick });

          // 如果计时结束
          if(tick === 0) {
            clearInterval(tickInterval);

            // 修改游戏状态为旋转骰子
            status = "rotateDice";

            // 向大厅和游戏室中的用户，发送通知状态
            io.to("hall").emit("updateStatus", { status: status });
            io.to("game").emit("updateStatus", { status: status });
          }
        });
      }

      // 若状态为旋转骰子
      if(status === "rotateDice") {
        status = "inRotateDicePeriodTick";

        tick = dicePeriod;
        tickInterval = setInterval(function() {
          tick--;

          // 向大厅和游行中的玩家，发送通知状态
          io.to("hall").emit("updateStatus", { status: status, tick: tick });
          io.to("game").emit("updateStatus", { status: status, tick: tick });

          // 如果计时结束
          if(tick === 0) {
            clearInterval(tickInterval);

            // 修改游戏状态为出结果
            status = "inResult";

            // 向大厅和游戏室中的用户，发送通知状态
            io.to("hall").emit("updateStatus", { status: status });
            io.to("game").emit("updateStatus", { status: status });
          }
        });
      }

      // 若状态为结果中
      if(status === "inResult") {
        // TODO: 计算结果

        // TODO: 保存游戏记录

        // 向游戏室中的用户，通知游戏结果
        io.to("game").emit("result");

        // 修改游戏状态为上线
        status = "active";

        // 向大厅和游戏室中的用户，发送通知状态
        io.to("hall").emit("updateStatus", { status: status });
        io.to("game").emit("updateStatus", { status: status });

        // // 把玩家踢出游戏室，加入大厅
        // var connected = io.of("/").connected;
        // var keys = players.keys();
        // var key;
        //
        // while(key = keys.next()) {
        //   // 离开游戏室，加入大厅
        //   connected[key].leave("game");
        //   connected[key].join("hall");
        //
        //   // 当玩家退出游戏室时，获取公告
        //   $bulletinService.listBulletins({ start: 0, end: 5 }, function(bulletins) {
        //     connected[key].emit("updateBulletin", { list: bulletins });
        //   });
        // }
        //
        // // 清除 map
        // players.clear();
      }
    }
  }, 1000);

  // **** 给socket注册事件监听 ****
  // 当用户连接上时
  io.on("connection", function(socket) {
    // 注册请求
    socket.on("newUser", function(data) {
      // register validations
      $validator.reset();
      $validator.required("token", "密匙不能为空");
      $validator.notEmptyString("token", "密匙不能为空");
      $validator.required("type", "类型不能为空");
      $validator.notEmptyString("type", "类型不能为空");

      $validator.validate(data, function(err) {
        if(err) {
          // 请求格式不合法, 断开连接
          socket.disconnect(true);
        }else {
          // 验证用户身份
          $authService.verify(data, function(err, username) {
            if(err) {
              // 验证不通过, 断开连接
              socket.disconnect(true);
            }else {
              // 判断用户类型
              if(data.type === "admin") {
                // 管理员发布公告
                socket.on("newBulletin", function(data) {
                  // register validations
                  $validator.reset();
                  $validator.required("content", "内容不能为空");
                  $validator.notEmptyString("content", "内容不能为空");

                  // do validation
                  $validator.validate(data, function(err) {
                    if(err) {
                      socket.emit("err", { event: "newBulletin", errorMessage: err.msg });
                    }else {
                      // 保存公告
                      $bulletinService.saveBulletin(data, function(err, bulletin) {
                        if(err) {
                          socket.emit("err", { event: "newBulletin", errorMessage: err });
                        }else {
                          $bulletinService.listBulletins({ start: 0, end: 5 }, function(bulletins) {
                            if(status === "loading" || status === "inGame" || status === "inGamePeriodTick" || status === "inResult") {
                              // 如果游戏已经开始，则只向大厅中的玩家发送更新公告
                              socket.to("hall").emit("updateBulletin", { list: bulletins });
                            }else {
                              // 如果游戏没有开始，则向所有玩家发送更新公告
                              socket.to("hall").emit("updateBulletin", { list: bulletins });
                              socket.to("game").emit("updateBulletin", { list: bulletins });
                            }
                          });
                        }
                      });
                    }
                  });
                });
              }else if(data.type === "normal") {
                // bind player info
                socket.player = {
                  username: username
                };

                // 初次进入游戏, 则加入大厅
                socket.join("hall");

                // 第一次加入大厅, 发送更新公告
                $bulletinService.listBulletins({ start: 0, end: 5 }, function(bulletins) {
                  // 发送公告至用户
                  socket.emit("updateBulletin", { list: bulletins });
                });

                // 玩家准备
                socket.on("playerReady", function() {
                  socket.join("game");
                  socket.leave("hall");

                  // 将玩家加入 map
                  players.set(socket.id, {
                    isLoaded: false
                  });
                });

                // 当玩家取消准备时
                socket.on("playerReadyCancel", function() {
                  socket.leave("game");
                  socket.join("hall");

                  // 将玩家从 map 中移除
                  players.delete(socket.id);
                });

                // 当玩家加载完成
                socket.on("loadingFinished", function() {
                  // 修改玩家状态为加载成功
                  players.get(socket.id).isLoaded = true;
                });

                // 玩家进行押注
                socket.on("stake", function(data) {
                  // TODO: finish this later
                });
              }
            }
          });
        }
      });
    });

    // 当用户连接断开时
    socket.on("disconnect", function() {

    });
  });
};
