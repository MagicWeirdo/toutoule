module.exports = {
  scope: "singleton",
  name: "$stateMachine",
  factory: function($validator, $authService, $gameService, $userService, $logger) {
    return {
      io: null,
      state: "offline",
      preparingPeriod: 10, // 游戏准备倒计时
      gamePeriod: 20, // 游戏掷骰子倒计时
      mode: "manual",
      /**
       * @public
       * @param {io} io
       * @desc
       * init game service
      **/
      init: function(io) {
        var self = this;

        self.io = io;

        io.on("connection", function(socket) {
          self._handleRegistry(socket);
        });
      },
      /**
       * @private
       * @param {Socket} socket
       * @param {Function} callback
       * @desc
       * handle socket registry
      **/
      _handleRegistry: function(socket, callback) {
        var self = this;

        socket.on("newPlayer", function(data) {

          $validator.reset();

          // register validations
          $validator.required("token", "密匙不能为空");
          $validator.notEmptyString("token", "密匙不能为空");
          $validator.required("type", "类型不能为空");
          $validator.notEmptyString("type", "类型不能为空");

          // do validation
          $validator.validate(data, function(err) {
            if(err) {
              $logger.log("请求格式不合法, 断开连接");

              // 请求格式不合法, 断开连接
              socket.disconnect(true);
            }else {
              // 验证用户身份
              $authService.verify(data, function(err, username) {
                if(err) {
                  $logger.log("验证不通过, 断开连接");

                  // 验证不通过, 断开连接
                  socket.disconnect(true);
                }else {
                  // 判断用户类型
                  if(data.type === "admin") {
                    self._handleAdminRegistry(socket);
                  }else if(data.type === "normal") {
                    // 绑定玩家信息
                    socket.player = {
                      username: username,
                      isStaked: false // 标记是否已押注
                    };

                    self._handlePlayerRegistry(socket);
                  }
                }
              });
            }
          });
        });
      },
      /**
       * @public
       * @param {Socket} socket
       * @param {Function} callback
       * @desc
       * hande admin registry
      **/
      _handleAdminRegistry: function(socket, callback) {
        $logger.log("管理员注册成功");

        var self = this;

        // 管理员上线游戏
        socket.on("turnOn", function() {
          console.log("当前游戏状态: " + self.getState());

          // 只有当游戏处于下线状态时才能上线
          if(self.getState() === "offline") {
            self.turnOn();
          }
        });

        // 管理员下线游戏
        socket.on("turnOff", function() {
          // 只有当游戏处于上线状态或开始倒计时状态时才能下线
          if(self.getState() === "online" || self.getState() === "preparingCountDown") {
            // 下线游戏
            self.turnOff();
          }
        });

        // 管理员开启自动模式
        socket.on("turnOnAutoMode", function() {
          // 只有当游戏状态为上线且游戏模式为手动时才能切换模式
          if(self.getState() === "online" && self.getMode() === "manual") {
            $logger.log("切换为自动模式");

            self.setMode("auto");

            // 再次开启
            self.turnOn();
          }
        });

        // 管理员开启手动模式
        socket.on("turnOnManualMode", function() {
          // 只有当游戏状态为上线或为开始倒计时，且模式为自动时才能切换
          if((self.getState() === "online" || self.getState() === "preparingCountDown") && self.getMode() === "auto") {
            $logger.log("切换为手动模式");

            self.setMode("manual");
          }
        });

        // 管理员手动开启游戏
        socket.on("startGame", function() {
          // 只有当游戏为 online 状态且游戏模式为 manual 且准备人数大于 0 时才能开启游戏
          if(self.getState() === "online" && self.getMode() === "manual" && self.countReadiedPlayers() > 0) {
            $logger.log("手动开启游戏");

            // 开始加载游戏
            self.startLoading();
          }
        });

        // 管理员给定结果
        socket.on("giveResult", function(data) {
          $logger.log("管理员给定结果");

          // 只有当游戏状态为 onWait 才能给定结果
          if(self.getState() === "onWait") {
            var result = null;

            // TODO: 优化算法
            // 如果为单
            if(data === "d") {
              // 循环直至生成单数
              while(true) {
                let temp = $gameService.random();
                if(temp.type === "d") {
                  result = temp;
                  break;
                }
              }
            }else if(data === "s") {
              // 如果为双
              while(true) {
                let temp = $gameService.random();
                if(temp.type === "s") {
                  result = temp;
                  break;
                }
              }
            }else {
              // 如果为豹子

              // 获取数字
              var num = Number.parseInt(data.substring(1));

              // 生成结果
              result = {
                dice1: num,
                dice2: num,
                dice3: num,
                type: data
              };
            }

            // 开始计算结果
            self.calculateResult(result);
          }
        });
      },
      /**
       * @public
       * @param {Socket} socket
       * @param {Function} callback
       * @desc
       * hande player registry
      **/
      _handlePlayerRegistry: function(socket, callback) {
        $logger.log("玩家注册长连接成功");

        var self = this;

        // 玩家加入大厅
        socket.join("hall");

        // 只有当状态为 online/gamingCountDown 且 mode 为 manual 的情况下才有必要推送
        if(self.getState() === "online" || (self.getState() === "onWait" && self.getMode() === "manual")) {
          socket.emit("updateStatus", { state: self.getState() });
        }

        // 玩家准备游戏
        socket.on("ready", function() {

          // 当状态为 online 和 preparingCountDown 时，玩家才能准备
          if(self.getState() === "online" || self.getState() === "preparingCountDown") {
            // 玩家离开大厅，加入等待室
            socket.leave("hall");
            socket.join("wait");

            $logger.log("玩家成功准备游戏");
          }
        });

        // 玩家取消准备游戏
        socket.on("unready", function() {

          // check state
          if(self.getState() === "online" || self.getState() === "preparingCountDown") {
            // 玩家离开等待室，加入大厅
            socket.leave("wait");
            socket.join("hall");

            $logger.log("玩家成功取消准备游戏");
          }
        });

        // 玩家加载完成
        socket.on("loaded", function() {
          // 将玩家踢出等待室，并加入游戏室
          socket.leave("wait");
          socket.join("game");
        });

        // 玩家押注
        socket.on("stake", function(data) {
          // 修改玩家状态
          socket.player.isStaked = true;

          // 保存押注数据
          socket.player.stake = data;

          $logger.log("玩家押注成功");
        });

        // 玩家退出游戏
        socket.on("quit", function() {
          // 重置玩家状态
          socket.player.isStaked = false;
          socket.player.stake = null;

          // 将玩家踢出游戏室或等待室，加入大厅
          socket.leave("game");
          socket.leave("wait");
          socket.join("hall");

          // 告知玩家被踢出
          socket.emit("kick");

          $logger.log("玩家退出游戏");
        });

        // 玩家结束游戏
        socket.on("end", function() {
          // 将玩家踢出游戏室，并加入等待室
          socket.leave("game");
          // socket.join("hall");
          socket.join("wait");

          // 提示玩家被踢出
          // socket.emit("kick");

          $logger.log("玩家结束");
        });

        // TODO: 编写玩家断线的逻辑
        socket.on("disconnect", function() {
          // $userService.logout({
          //   username: socket.player.username
          // }, function() {
          //   $logger.log("用户掉线");
          // });
        });
      },
      /**
       * @public
       * @desc
       * turn on game service [online]
      **/
      turnOn: function() {
        $logger.log("游戏上线");

        var self = this;

        self.setState("online");

        // 向在大厅的玩家广播游戏上线
        self.io.to("hall").emit("updateStatus", { state: "online" });

        // 如果是自动模式
        if(self.getMode() === "auto") {
          var waitInterval = setInterval(function() {
            // 如果管理员强制下线
            if(self.getState() === "offline") {
              clearInterval(waitInterval);

              // 将等待室中的玩家踢出，并加入大厅
              var sockets = self.findSocketsByRoom("wait");
              sockets.forEach(function(socket) {
                socket.leave("wait");
                socket.join("hall");
              });

              // 向大厅的玩家广播游戏状态
              self.io.to("hall").emit("updateStatus", { state: "offline" });

              return;
            }

            // 如果游戏模式被更改为 manual
            if(self.getMode() === "manual") {
              clearInterval(waitInterval);
              return;
            }

            // 玩家人数大于零，且游戏状态为 online
            if(self.countReadiedPlayers() > 0 && self.getState() === "online") {
              clearInterval(waitInterval);

              // begin preparing count down
              self.beginPreparingCountdown();
            }
          }, 1000);
        }
      },
      /**
       * @public
       * @desc
       * turn off game servce [offline]
      **/
      turnOff: function() {
        $logger.log("下线游戏");

        var self = this;

        // 修改状态
        self.setState("offline");

        // 若模式为手动模式
        if(self.getMode() === "manual") {
          // 将等待室的玩家踢出，加入大厅
          var sockets = self.findSocketsByRoom("wait");
          sockets.forEach(function(socket) {
            socket.leave("wait");
            socket.join("hall");
          });

          // 向大厅的玩家广播游戏下线
          self.io.to("hall").emit("updateStatus", { state: "offline" });
        }
      },
      /**
       * @public
       * @desc
       * begin preparing count down [preparingCountDown]
      **/
      beginPreparingCountdown: function() {
        $logger.log("开始倒计时");

        var self = this;

        self.setState("preparingCountDown");

        var tick = self.preparingPeriod;
        var preparingInterval = setInterval(function() {
          // 如果管理员强制下线游戏
          if(self.getState() === "offline") {
            clearInterval(preparingInterval);

            // 将等待室玩家踢出，并加入大厅
            var sockets = self.findSocketsByRoom("wait");
            sockets.forEach(function(socket) {
              socket.leave("wait");
              socket.join("hall");
            });

            // 向大厅中的玩家广播游戏状态
            self.io.to("hall").emit("updateStatus", { state: "offline" });

            return;
          }

          // 如果游戏模式被更改为手动
          if(self.getMode() === "manual") {
            clearInterval(preparingInterval);

            // go to online
            self.turnOn();

            return;
          }

          // 如果准备玩家人数为0，则停止计时
          if(self.countReadiedPlayers() === 0) {
            clearInterval(preparingInterval);

            $logger.log("准备玩家人数为零，停止计时");

            // go to online
            self.turnOn();

            return;
          }

          // 计时
          tick--;

          $logger.log("距离游戏开始还有: " + tick);

          // 向大厅和等待室的玩家广播游戏开始倒计时
          self.io.to("hall").emit("updateStatus", { state: "preparingCountDown", tick: tick });
          self.io.to("wait").emit("updateStatus", { state: "preparingCountDown", tick: tick });

          // 如果计时结束
          if(tick === 0) {
            clearInterval(preparingInterval);

            $logger.log("开始倒计时结束");

            // start loading
            self.startLoading();
          }
        }, 1000);
      },
      /**
       * @public
       * @desc
       * start loading [loading]
      **/
      startLoading: function() {
        $logger.log("开始加载游戏");

        var self = this;

        self.setState("loading");

        // 向等待室的玩家提示进入游戏
        self.io.to("wait").emit("joinGame");

        // 向大厅中的玩家广播游戏加载
        self.io.to("hall").emit("updateStatus", { state: "loading" });

        // 检测所有玩家是否加载完成
        var waitInterval = setInterval(function() {
          // 如果玩家数量为 0
          if(self.countUnloadedPlayers() === 0 && self.countInGamePlayers() === 0) {
            clearInterval(waitInterval);

            // go to online
            self.turnOn();

            return;
          }

          // 如果所有玩家加载完成
          if(self.countUnloadedPlayers() === 0 && self.countInGamePlayers() !== 0) {
            clearInterval(waitInterval);

            // 开始游戏
            self.startGame();
          }
        }, 1000);
      },
      /**
       * @public
       * @desc
       * start game [game]
      **/
      startGame: function() {
        $logger.log("游戏开始");

        var self = this;

        self.setState("gaming");

        // 向大厅的玩家广播游戏状态
        self.io.to("hall").emit("updateStatus", { state: "gaming" });

        // 开始押注倒计时
        self.beginGameCountDown();
      },
      /**
       * @public
       * @desc
       * begin game count down [gameCountDown]
      **/
      beginGameCountDown: function() {
        $logger.log("开始游戏倒计时");

        var self = this;

        self.setState("gamingCountDown");

        var tick = self.gamePeriod;

        var gamingInterval = setInterval(function() {
          tick--;

          $logger.log("距离押注时间结束还有" + tick + "秒");

          // 向大厅和游戏中的玩家广播游戏倒计时
          self.io.to("hall").emit("updateStatus", { state: "gamingCountDown", tick: tick });
          self.io.to("game").emit("updateStatus", { state: "gamingCountDown", tick: tick });

          // 如果玩家人数为0，则返回
          if(self.countInGamePlayers() === 0) {
            clearInterval(gamingInterval);

            $logger.log("进行游戏的玩家人数为零，返回");

            self.turnOn();

            return;
          }

          if(tick === 0) {
            clearInterval(gamingInterval);

            $logger.log("游戏倒计时结束");

            // 等待结果
            self.waitResult();
          }
        }, 1000);
      },
      /**
       * @public
       * @desc
       * wait for result
      **/
      waitResult: function() {
        $logger.log("等待游戏结果");

        var self = this;

        // 修改游戏状态
        self.setState("onWait");

        // 向大厅和游戏室的玩家发送广播
        self.io.to("hall").emit("updateStatus", { state: "onWait" });
        self.io.to("game").emit("updateStatus", { state: "onWait" });

        // 如果游戏模式为自动则直接开始计算结果
        if(self.getMode() === "auto") {
          self.calculateResult(null);
        }
      },
      /**
       * @public
       * @param {Object} result
       * @desc
       * calculate result [result]
      **/
      calculateResult: function(result) {
        $logger.log("开始计算结果");

        var self = this;

        self.setState("calculateResult");

        // 向大厅和游戏室的玩家广播游戏状态
        self.io.to("hall").emit("updateStatus", { state: "calculateResult" });
        self.io.to("game").emit("updateStatus", { state: "calculateResult" });

        // 获取游戏模式
        var mode = result === null ? "auto" : "manual";

        if(result === null) {
          // 生成结果
          result = $gameService.random();
        }

        // 保存游戏回合
        $gameService.saveGameRound({
          result: result.type
        }, function(gameRound) {
          // 获取游戏室所所有的玩家
          var sockets = self.findSocketsByRoom("game");

          var totalNum = sockets.length;
          var calculatedNum = 0;

          // iterate
          sockets.forEach(function(socket) {
            // 检查是否已押注
            if(socket.player.isStaked === false) {
              // 计算惩罚

              // 保存游戏记录
              $gameService.saveGameRecord({
                stake: "none",
                reward: 0,
                gameRoundId: gameRound.id,
                username: socket.player.username
              }, function() {
                // 踢出游戏室
                socket.leave("game");
                socket.join("hall");

                // 重置玩家状态
                socket.player.isStaked = false;

                calculatedNum++;

                // 通知玩家已被踢出
                socket.emit("kick");

                $logger.log("没有押注，被踢出");
              });
            }else {
              // 计算奖惩
              var stake = socket.player.stake;

              // 如果结果是单
              if(result.type === "d" && result.type === stake.type) {
                // 奖励 1:1
                $userService.topUpCoin({
                  username: socket.player.username,
                  amount: stake.coin
                }, function() {
                  // 保存游戏记录
                  $gameService.saveGameRecord({
                    stake: "d",
                    reward: stake.coin,
                    gameRoundId: gameRound.id,
                    username: socket.player.username
                  }, function() {
                    calculatedNum++;

                    $logger.log("成功押注单");
                  });
                });
              }else if(result.type === "s" && result.type === stake.type) {
                // 如果结果为双

                // 奖励 1:0.95
                $userService.topUpCoin({
                  username: socket.player.username,
                  amount: stake.coin * 0.95
                }, function() {
                  // 保存游戏记录
                  $gameService.saveGameRecord({
                    stake: "s",
                    reward: stake.coin * 0.95,
                    gameRoundId: gameRound.id,
                    username: socket.player.username
                  }, function() {
                    calculatedNum++;

                    $logger.log("成功押注双");
                  });
                });
              }else if(result.type === stake.type) {
                // 如果结果为豹子

                // 奖励 1:50
                $userService.topUpCoin({
                  username: socket.player.username,
                  amount: stake.coin * 50
                }, function() {
                  // 保存游戏记录
                  $gameService.saveGameRecord({
                    stake: stake.type,
                    reward: stake.coin * 50,
                    gameRoundId: gameRound.id,
                    username: socket.player.username
                  }, function() {
                    calculatedNum++;

                    $logger.log("成功押注豹子");
                  });
                });
              }else {
                // 如果没有押中

                $userService.bottomDownCoin({
                  username: socket.player.username,
                  amount: stake.coin
                }, function() {
                  // 保存游戏记录
                  $gameService.saveGameRecord({
                    stake: stake.type,
                    reward: 0 - stake.coin,
                    gameRoundId: gameRound.id,
                    username: socket.player.username
                  }, function() {
                    calculatedNum++;

                    $logger.log("押注失败");
                  });
                });
              }
            }
          });

          // 等待计算结果完成
          var calculatingInterval = setInterval(function() {
            if(calculatedNum === totalNum) {
              clearInterval(calculatingInterval);

              // 重置玩家状态
              self.findSocketsByRoom("game").forEach(function(socket) {
                socket.player.isStaked = false;
                socket.player.stake = null;

                $logger.log("重置玩家状态");
              });

              $logger.log("结果计算完成");

              // 发送结果
              self.sendResult(result);
            }
          }, 1000);
        });
      },
      /**
       * @public
       * @param {Object} result
       * @desc
       * send result to players in game room [onResult]
      **/
      sendResult: function(result) {
        $logger.log("发送游戏结果");

        var self = this;

        // 修改游戏状态为 onResult
        self.setState("onResult");

        // 向大厅和游戏室的玩家广播状态
        self.io.to("hall").emit("updateStatus", { state: "onResult" });
        self.io.to("game").emit("updateStatus", { state: "onResult" });

        // 延迟 5 秒推送
        setTimeout(function() {
          // 向游戏室玩家广播状态
          self.io.to("game").emit("result", result);

          // 切换游戏状态至等待中
          self.wait();
        }, 5000);
      },
      /**
       * @public
       * @desc
       * wait till the animations of all players are finished [waitting]
      **/
      wait: function() {
        $logger.log("等待玩家结束");

        var self = this;

        // 修改游戏状态为 watting
        self.setState("watting");

        // 向大厅的玩家广播状态
        self.io.to("hall").emit("updateStatus", { state: "waitting" });

        // 等待所有的用户完成
        var waitInterval = setInterval(function() {
          $logger.log("等待");

          // 如果在游戏室的玩家人数为 0
          if(self.countInGamePlayers() === 0) {
            clearInterval(waitInterval);

            // 切换游戏状态
            self.turnOn();
          }
        }, 1000);
      },
      /**
       * @public
       * @param {String} state
       * @desc
       * set state
      **/
      setState: function(state) {
        this.state = state;
      },
      /**
       * @public
       * @return {String}
       * @desc
       * get state
      **/
      getState: function() {
        return this.state;
      },
      /**
       * @public
       * @param {String} mode
       * @desc
       * set mode
      **/
      setMode: function(mode) {
        this.mode = mode;
      },
      /**
       * @public
       * @return {String}
      **/
      getMode: function() {
        return this.mode;
      },
      /**
       * @public
       * @param {String} name
       * @desc
       * find all sockets of a room
      **/
      findSocketsByRoom: function(name) {
        var self = this;

        var sockets = [];

        // 有可能为空
        try {
          var clientIds = self.io.sockets.adapter.rooms[name].sockets;
          for(var id in clientIds) {
            sockets.push(self.io.sockets.connected[id]);
          }
        }catch(err) {
          // do nothing
        }finally {
          return sockets;
        }
      },
      /**
       * @public
       * @return {Number}
       * count readied players
      **/
      countReadiedPlayers: function() {
        return this.findSocketsByRoom("wait").length;
      },
      /**
       * @public
       * @return {Number}
       * 统计没有加载完成的玩家数量
      **/
      countUnloadedPlayers: function() {
        return this.findSocketsByRoom("wait").length;
      },
      /**
       * @public
       * @return {Number}
       * 统计在游戏中的玩家数量
      **/
      countInGamePlayers: function() {
        return this.findSocketsByRoom("game").length;
      }
    };
  }
};
