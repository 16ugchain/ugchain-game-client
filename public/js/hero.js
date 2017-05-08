/*
    账号实现逻辑
        1.创建账号

        2.导入账号
    游戏整体实现逻辑
        1.游戏初始化
            a)页面初始化
            b)数据初始化
        2.开始游戏
            a)交互
            a)得分
            b)背景
        3.游戏结束
            a)菜单窗口
        4.商店
            a)皮肤
        5.排行
            a)Top10
*/


/**
    游戏数据
        sofarW：站台宽度
        sofarM：站台间距
        heroMaxCount： 最高分
*/
    window['sofarW'] = ["20px", "50px", "25px", "35px", "45px", "30px", "40px"];
    window['sofarM'] = ["30px", "40px", "50px", "60px", "70px", "80px", "90px", "100px", "110px", "120px"];
    window["that"];
    var heroMaxCount = 0;
    var buyDermaIdEd = [];
    var userName = "";
    var gameTouch = false; 
    var gameAddress = "";           //地址
    var gameToken = "";             //游戏token
    var GAME_ID = 1;                //游戏ID
    var balance = 0;                //余额
    var ug = 0;
    // $.cookie("randomSeed","nature recipe paper maximum medal cover depart bus journey roof swamp supply");
/*
    游戏初始化
*/
    gameLayoutFun();
/*
    开始游戏  
*/
    $(document).ready(function($) {
        
        
        that = $(".select").parent();
        /*
            开始游戏
        */
        $(".begin-test").on("click",function(event) {
            event.preventDefault();
            event.stopPropagation();
            // 开始按钮消失
            // $(this).fadeOut('0').siblings().fadeIn(400);
            gameTouch = true;
            $(this).html("游戏中...");
        });
        /*
            游戏交互
                A】长按屏幕事件
                B】离开屏幕事件
        */
        $('section').on('touchstart',function(event) {
            event.preventDefault();
            if(gameTouch){
                // 竿变大
                (function boxWidth(obj) {
                    obj.h++;
                    that = $(".select").parent();
                    $(".select").css({
                        "height": obj.h + "px",
                        "top": obj.h * ( - 1) + "px"
                    });
                    obj.timer = setTimeout(function() {
                        boxWidth(obj);
                    },7)
                })(sofarH)
            }else{
                return;
            }
        });
        // 手指离开屏幕
        $('section').on('touchend',function(event) {
            if(!gameTouch){
                return;
            }
            gameTouch = false;
            event.preventDefault();
            // 清计时器
            clearInterval(sofarH.timer);
            // 清除按住事件
            $("section").off("touchstart", this, false);
            // 顺时针旋转90度 并且移除select类名
            $(".option-em").css({
                "transition": "0.3s",
                "transform": "rotate(90deg)"
            }).removeClass('select');
            // 判断杠的长度是否在合理范围内
            var minWidth = parseInt(that.next().css("margin-left")); //竿的最小长度
            var maxWidth = minWidth + that.next().width(); //竿的最大长度
            var successLeft = parseInt($(".hero").css("left")) + maxWidth; //成功过杠
            var failLeft = parseInt($(".hero").css("left")) + sofarH.h; //掉下去
            if (sofarH.h >= minWidth && sofarH.h <= maxWidth) { //过杠
                stageBox();
                sofarH.count += 100;
                $(".count").html(sofarH.count);
                setTimeout(function() {
                    sofarH.h = 0;
                    
                    $(".hero").animate({
                        "left": successLeft
                    },400);
                    that.next().children('em').addClass('select option-em');
                    sofarH.sL = sofarH.sL + parseInt(that.width()) + minWidth;
                    $(".stage").animate({
                        "scrollLeft": sofarH.sL
                    },400,function(){
                        
                    })
                    gameTouch = true;
                },400)
                return;
            } else { 
                //掉下去
                $(".hero").animate({
                    "left": failLeft
                },400);
                // 最高记录写入
                if(heroMaxCount<sofarH.count){
                    saveCookie(userName + "-heroMaxCount",sofarH.count)
                    // 发送请求到服务器保存最高记录 
                    // $.get("/updateData/insert?token=" + token + "&data=" + sofarH.count,function(data){
                    $.ajax({
                        url: 'http://192.168.5.5:8088/updateData/data',
                        data: {
                            "token":gameToken,
                            "data":sofarH.count,
                            "userName": userName
                        },
                        dataType: 'jsonp',
                        cache: false,
                        timeout: 5000,
                        // jsonp 字段含义为服务器通过什么字段获取回调函数的名称
                        jsonp: 'callback',
                        // 声明本地回调函数的名称，jquery 默认随机生成一个函数名称
                        jsonpCallback: 'jsonpCallback',
                        success: function(data) {
                            if(data.meta.code == 200){
                                console.log("write success");
                            }
                        }
                        
                    })
                }
                setTimeout(function() {
                    that.children(".option-em").css({
                        "transition": "0.3s",
                        "transform": "rotate(185deg)"
                    });
                    $(".hero").animate({
                        "top": 10000 + "px"
                    },400);
                },400)
                // 失败后出现重新开始，点击重新开始
                $(".begin-test").html("重新开始").on("click",function() {
                    // window.location.reload();
                    gameLayoutFun();
                })
            }
        });
        $("section").bind('touchmove',function(event) {
            event.preventDefault();
        });
        /*
            购买皮肤
                A】总共7种皮肤（1种系统默认）
                B】点击购买:
                    对照本地cookie进行物品是否以购买判断
                    1）未购买：
                        发送购买请求，写入cookie，关闭购买界面
                    2）已购买:
                        切换改皮肤，关闭交易界面。
        */  
        $("#buyBtn").on('click touchstart', function(event) {
            event.preventDefault();
            /* Act on the event */
            var dermaId =  $('#modalBox input:radio:checked').val();
            console.log(dermaId);
            buyDermaIdEd = JSON.parse($.cookie(userName + "-derma"));
            console.log(buyDermaIdEd);
            if(!dermaId){
                alert("请选择商品");
            }else{
                
                if(judgeDermaId(dermaId,buyDermaIdEd)){
                    console.log("可以购买");
                    getUGToken();
                    $.ajax({
                        url: 'http://192.168.5.5:8088/insertOrder/' + gameToken ,
                        data: {
                            "derma":dermaId
                        },
                        dataType: 'jsonp',
                        cache: false,
                        timeout: 5000,
                        // jsonp 字段含义为服务器通过什么字段获取回调函数的名称
                        jsonp: 'callback',
                        // 声明本地回调函数的名称，jquery 默认随机生成一个函数名称
                        jsonpCallback: 'jsonpCallback',
                        success: function(body) {
                            if(body.meta.code == 200){
                                // 获取地址进行转账
                                console.log(body.data.seller);
                                var tradeId = body.data.orderId
                                var seller = body.data.seller
                                var prices = $('#modalBox input:radio:checked').siblings('span.derma-prices').html();
                                console.log("###########");
                                
                                console.log("支付金额："+prices+"\r\n订单号："+tradeId+"\r\n支付地址："+seller+"\r\n本账号地址："+gameAddress)
                                console.log("###########");
                                console.log(prices); 
                                console.log(gameAddress);
                                pay(GAME_ID,tradeId,seller,prices,gameAddress,function(err,data1){
                                    console.log(err);
                                    console.log(data1);
                                    // console.log(data2);

                                    console.log("支付成功");
                                    $('#myModal').modal('hide');
                                    $(".eth").html("ETH:"+getBalance());
                                    // 查询订单状态
                                    $.ajax({
                                        url: 'http://192.168.5.5:8088/getOrder/' + tradeId + '/derma',
                                        dataType: 'jsonp',
                                        cache: false,
                                        timeout: 5000,
                                        // jsonp 字段含义为服务器通过什么字段获取回调函数的名称
                                        jsonp: 'callback',
                                        // 声明本地回调函数的名称，jquery 默认随机生成一个函数名称
                                        jsonpCallback: 'jsonpCallback',
                                        success: function(data) {
                                            if(data.meta.code == 200){
                                                if(data.data.status == 1){
                                                    buyDermaIdEd.push(dermaId);
                                                    saveCookie(userName + "-derma",JSON.stringify(buyDermaIdEd))
                                                    发送请求到服务器进行确认 
                                                    console.log("购买成功");
                                                    $('#myModal').modal('hide');

                                                    $("section").css({
                                                        // "background": "url(/images/hero-b" + parseInt(Math.round(Math.random() + 1)) + ".jpg) no-repeat",
                                                        "background": "url(/images/hero-b" + buyDermaIdEd[buyDermaIdEd.length-1] + ".png) no-repeat",
                                                        "background-size": "100% 100%"
                                                    });
                                                }else{
                                                    console.log("交易状态未改变");
                                                    // alert("请稍等。。。");
                                                }
                                            }else{
                                                console.log("订单查询失败");
                                            }

                                        }
                                        
                                    })
                                });
                                
                            }
                        }
                    })
                }else{
                    alert("已购买过此皮肤");
                }
            }
            $(".game-tip").on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                console.log("余额查询")

                // etBalance()
            });

        });
        /**
            查看排行：
                只显示排行前10名
        */
        $(".ranking-btn").on('click', function(event) {
            event.preventDefault();
            /* Act on the event */
            $(".ranking-list").html("")
            $.ajax({
                url: 'http://192.168.5.5:8088/getData/list',
                dataType: 'jsonp',
                cache: false,
                timeout: 5000,
                // jsonp 字段含义为服务器通过什么字段获取回调函数的名称
                jsonp: 'callback',
                // 声明本地回调函数的名称，jquery 默认随机生成一个函数名称
                jsonpCallback: 'jsonpCallback',
                success: function(data) {
                    if(data.meta.code == 200){
                        var listData = data.data.sort(compare("data")).reverse();
                        listData.forEach(function(v,i){
                            if(i<9){
                                $(".ranking-list").append("<li>" + v.userName + " : " + v.data + "</li>")
                            }
                        })
                    }
                }
            })
        });
        /**
            加载皮肤列表
        */
        $(".buy-btn").on('click', function(event) {
            console.log("点击购买皮肤列表");
            event.preventDefault();

            /* Act on the event */
            $("#modalBox").html("")
            $.ajax({
                url: 'http://192.168.5.5:8088/getData/derma',
                dataType: 'jsonp',
                cache: false,
                timeout: 5000,
                // jsonp 字段含义为服务器通过什么字段获取回调函数的名称
                jsonp: 'callback',
                // 声明本地回调函数的名称，jquery 默认随机生成一个函数名称
                jsonpCallback: 'jsonpDerma',
                success: function(body) {
                    if(body.meta.code == 200){
                        var dermaArr = body.data;
                        dermaArr.forEach(function(v,i){
                            $("#modalBox").append('<div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios' + v.id + '" value="' + v.id + '"><span class="derma-name">' + v.name + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="derma-prices">' + v.prices + '</span></label></div>');
                        })
                    }
                }
            })
        });
        // 创建账号
        $("#creatAccount").on('click', function(event) {
            event.preventDefault();
            /* Act on the event */
            console.log("创建");
            initWallet();
            $.cookie("randomSeed",randomSeed);
            // $('.init-account').modal('show');

        });
        // 导入账号
        $("#channelAccount").on('click', function(event) {
            event.preventDefault();
            /* Act on the event */
            $("#userName").addClass('name-status');
            restoreWalletFromSeed()
            console.log("导入成功");
            // $('.init-account').modal('show');
        });
        // 监听模态框隐藏方法
        $("#tip").on("hide.bs.modal",function(){
            if(gameAddress){
                $(".init-before").hide();
                $(".init-after").show();
                getToken();
            }
        });
        // 进入游戏按钮点击事件
        $("#EnterBtn").on('click', function(event) {
            event.preventDefault();
            
            
            /* Act on the event */
            if(gameToken){
                
                /**
                    用户信息写入事件
                */
               
               if(!$("#userName").hasClass('name-status')){
                    console.log(userName);
                    console.log("首次创建");
                    userName = $("#userName").val();
                    if(userName){
                        getUserData(gameToken,userName);
                    }else{
                        alert("请输入用户名");
                    }
               }else{
                    console.log("导入账号");
                    getUserData(gameToken,userName);
                    
               }
               
                
            }else{
                heroObj.modal("#tip","show",function(){
                    $("#tip-content").html("No enough ether for Transaction");
                });
                getToken();
            }
            
        });
    });