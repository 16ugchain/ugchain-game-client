## ugc game client readme： 
**用于区块链开发大赛ugc game 客户端**

1.客户端提供创建账户，导入账户
2.账户售卖，填写价格信息，出售账户
3.皮肤购买，选择对应的皮肤进行交易
4.游戏排行，显示玩家最高分前十名分数

**合约代码的调用**

1.创建账号，在合约中初始化token，调用游戏服务端获取游戏数据进行游戏。
2.购买游戏道具，调用合约的pay方法在链上进行资产转移，用户付费给游戏厂商的账户，获得游戏道具。
3.监听交易是否成功，从游戏服务端轮询道具是否下发。
4.通知游戏服务端出售账号，游戏服务端代为上架账号，调用合约发布资产。
