module.exports = function($userService, $stateMachine, io) {
  // 重启后，把所有用户的登录状态修改为未登录状态
  $userService.resetAllUsersState(function() {
    // initialize game service
    $stateMachine.init(io);
  });
};
