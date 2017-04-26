- 登录 [完成]
- 修改密码 [完成]
- 显示游戏状态
  - 管理员第一次连接上
    - 当游戏状态为online时，发送状态 [完成]
    - 当游戏状态为onWait且模式为manual，发送状态 [完成]
  - 状态发生改变（每次状态改变都向管理员发送状态）
    - offline
    - online
    - preparingCountDown (每秒广播一次)
    - loading
    - gaming
    - gamingCountDown (每秒广播一次)
    - onWait (如果是manual模式，则等待管理员发结果)
    - calculateResult (计算结果)
    - onResult
    - watting
- 押注状态 [完成]
- 结果控制 [完成]
  - btnDan
  - btnShuang
  - btnBaozi1
  - btnBaozi2
  - btnBaozi3
  - btnBaozi4
  - btnBaozi5
  - btnBaozi6
  - btnYes
- 玩家实时列表
  - 分页
    <tr>
      <td>1</td>
      <td>1704220001</td>
      <td>已押注</td>
      <td>单</td>
      <td>20</td>
    </tr>

    <li><a href="#">&laquo;</a></li>
    <li><a href="#">1</a></li>
    <li><a href="#">&raquo;</a></li>
- 游戏状态
- 账号列表
  - 序号
  - 日期
  - 时间
  - 用户名
  - 注销
