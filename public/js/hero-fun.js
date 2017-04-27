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
        "background": "url(/images/hero-b3.jpg) no-repeat",
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