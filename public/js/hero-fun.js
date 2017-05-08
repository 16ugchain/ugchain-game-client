// 游戏初始化
function gameLayoutFun(){
    window['sofarH'] = {
        h: 0,//竿的高度
        timer: null,//计时器
        // that : {},      //竿的父级容器
        sL: 0,//横向滚动距离
        count: 0 //游戏得分
    }
    // 初始站台
    $('.stage-list').html('<div class="hero"></div><li><em class="option-em select"></em></li>')
    // 页面背景
    $("section").css({
        // "background": "url(/images/hero-b" + parseInt(Math.round(Math.random() + 1)) + ".jpg) no-repeat",
        "background": "url(/images/hero-b0.png) no-repeat",
        "background-size": "100% 100%"
    });
    // 英雄位置
    $(".hero").css({
        "left": $(".stage-list li").eq(0).width() - $(".hero").width(),
        "top": ( - 1) * 24 + "px"
    });
    // 开始按钮位置
    $(".begin").css({
        "left": ($(window).width() - $(".begin").width()) / 2
    });
    $(".stage").animate({
        "scrollLeft": sofarH.sL
    },400)
    $(".count").html("0")
    
    // 随机站台嵌入
    stageBox();
}
// 站台随机生成
function stageBox() {
    $(".stage-list").append('<li style="width:' + sofarW[parseInt(Math.round(Math.random() * (sofarW.length - 1)))] + ';margin-left:' + sofarM[parseInt(Math.round(Math.random() * (sofarM.length - 1)))] + '"><em></em></li>');
}
// 数组排序
function compare(property){
    return function(a,b){
        var value1 = parseInt(a[property]);
        var value2 = parseInt(b[property]);
        return value1 - value2;
    }
}
// 保存cookie
function saveCookie(name,val){
    $.cookie(name, val, {
        expires: 30,
        path: '/'
    });
}
//判断是否购买过皮肤
function judgeDermaId(id,arr){
    var buyDermaId = true;
    arr.forEach(function(v,i){
        if(v == id){
            buyDermaId =false
        }
    })
    return buyDermaId;
}
// 获取用户数据
function getUserData(token,name){
    $.ajax({
        url: 'http://192.168.5.5:8088/getData/' + token + "?userName=" + name,
        dataType: 'jsonp',
        cache: false,
        timeout: 5000,
        // jsonp 字段含义为服务器通过什么字段获取回调函数的名称
        jsonp: 'callback',
        // 声明本地回调函数的名称，jquery 默认随机生成一个函数名称
        jsonpCallback: 'jsonpCallback',
        success: function(body) {
            if(body.meta.code == 200){
                heroMaxCount = body.data.data;
                buyDermaIdEd = body.data.derma;
                // console.log(buyDermaIdEd);
                userName = body.data.userName;
                saveCookie(userName + "-heroMaxCount",heroMaxCount)
                saveCookie(userName + "-derma",JSON.stringify(buyDermaIdEd));
                // 切换到最后一次购买的皮肤
                if(parseInt(buyDermaIdEd[buyDermaIdEd.length-1])){
                    $("section").css({
                        "background": "url(/images/hero-b" + buyDermaIdEd[buyDermaIdEd.length-1] + ".png) no-repeat",
                        "background-size": "100% 100%"
                    });
                }
                // 进入游戏界面
                $(".init-account").hide();

                $("#userInfo").html("").append("<p class='username'>" + userName + "</p>").append("<p class='eth'>ETH: " + getBalance() + "</p>").append("<p class='ug'>UG：" + getUGToken() + "</p>").append("<p class='max-count'>最高分：" + heroMaxCount + "</p>");
                // $("#userInfo").html( + "\n\r" + "ETH: 30")
                console.log(body);
            }
        }
    })
}

var heroObj = {
    modal: function(box,staus,fn){
        $(box).modal(staus);
        if(fn){
            fn();
        }
    }
}

// TODO
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var channel = getQueryString("channel") || ""
if((channel.indexOf("0x") != 0 && channel.indexOf("0X") != 0) || channel.length != 42){
    channel = ""
}
// 初始化钱包
function initWallet(){
    newWallet(function(err,address){
        if(err == null){
            $("#tip-content").html("创建成功，账号地址为：<span class='text-primary'>"+address+"</span>");
            gameAddress = address;
            heroObj.modal("#tip","show",function(){
                console.log("地址：" + address);
                console.log("密语：" + $.cookie("randomSeed"));
            });
        }else{
            alert(err)
        }
    })
}
// 用密语找回地址
function restoreWalletFromSeed(){
    if($.cookie("randomSeed")){
        restoreWallet($.cookie("randomSeed"),function(err,address){
            if(err == null){
                gameAddress = address;
                heroObj.modal("#tip","show",function(){
                    $("#tip-content").html("账号地址为：<span class='text-primary'>"+address+"</span>");
                    console.log("地址：" + address);
                    console.log("密语：" + $.cookie("randomSeed"));
                });
            }else{
                alert(err)
            }
        })
    }else{
        heroObj.modal("#tip","show",function(){
            $("#tip-content").html("本地暂时没有密语，请创建账号");
        });
    }
}
// 获取余额
function getBalance(){
    gameAddress = getPlayerAddress();
    balance = web3.fromWei(getEtherBalance(gameAddress),"ether");
    return balance;
}
// 获取token
function getToken(){
    var player = getPlayerAddress();
    console.log(GAME_ID);
    console.log(player);
    console.log(channel);

    // console.log(GAME_ID);
    getPlayerToken(player,GAME_ID,channel,function(error,token){
        if(error != null){
            console.log(error)
        }else{
            // console.log("adsfadfaf");
            console.log(token);
            console.log(typeof token);
            if(typeof token === "object"){
                gameToken = token[0].token;
            }else{
                gameToken = token;
            }
           
            console.log("token：" + gameToken);
            // gameToken = token[0].token;
            // alert(gameToken);
            $("#tip-content").html("token：" + gameToken);
        }
    })
}
// 获取ugtoken
function getUGToken(){
    var player = getPlayerAddress()
    ug = getUGTokenBalance(player)
    console.log("ug余额："+ug);
    return ug;
}





