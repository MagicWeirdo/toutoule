module.exports = function($stateMachine, io) {
  // TODO: 重启后，把所有用户的登录状态修改为未登录状态

  // initialize game service
  $stateMachine.init(io);
};
