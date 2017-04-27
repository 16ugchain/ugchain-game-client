/*
    实现逻辑
        1.游戏初始化
            a)页面初始化
            b)数据初始化
        2.开始游戏
            a)得分
            b)背景
        3.游戏结束
            a)菜单窗口
        4.商店
            a)皮肤
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
    var derma = 0;
    var userName = "";
    var gameTouch = false;
    var token = "4bd9f7a2-71f8-4077-9b19-0f5d431ad04d";
/*
    游戏初始化
*/
    gameLayoutFun();
/*
    开始游戏  
*/
    $(document).ready(function($) {
        //  用户信息请求
        $.get("/getData/" + token,function(data){
            console.log(data);
            if(data.meta.code == 200){
                heroMaxCount = data.data.data;
                derma = data.data.derma;
                userName = data.data.userName;
                saveCookie(userName + "heroMaxCount",heroMaxCount)

                saveCookie(userName + "derma",derma)

                if(parseInt(derma)){
                    $("section").css({
                        // "background": "url(/images/hero-b" + parseInt(Math.round(Math.random() + 1)) + ".jpg) no-repeat",
                        "background": "url(/images/hero-b5.jpg) no-repeat",
                        "background-size": "100% 100%"
                    });
                }
            }
        })
        that = $(".select").parent();
        $(".begin-btn").on("click",function(event) {
            event.preventDefault();
            event.stopPropagation();
            // 开始按钮消失
            $(this).fadeOut('0').siblings().fadeIn(400);
            gameTouch = true;
        })
        // 长按事件
        // 按住屏幕使竿变长
        $('section').on('touchstart',function(event) {
            event.preventDefault();
            if(gameTouch){
                // 竿变大
                (function boxWidth(obj) {
                    // console.log(obj.h);
                    obj.h++;
                    // console.log(height);
                    that = $(".select").parent();
                    $(".select").css({
                        "height": obj.h + "px",
                        "top": obj.h * ( - 1) + "px"
                    });
                    obj.timer = setTimeout(function() {
                        boxWidth(sofarH);
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
            // if($(".option-em").hasClass('select')){
            //     gameTouch = false;
            // }
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
                console.log("Success");
                stageBox();
                sofarH.count += 100;
                $(".count").html(sofarH.count);
                // console.log(sofarH.sL + "sofarH.sL");
                setTimeout(function() {
                    sofarH.h = 0;
                    gameTouch = true;
                    $(".hero").animate({
                        "left": successLeft
                    },400);
                    // that.removeClass('class name')
                    that.next().children('em').addClass('select option-em');
                    sofarH.sL = sofarH.sL + parseInt(that.width()) + minWidth;

                    $(".stage").animate({
                        "scrollLeft": sofarH.sL
                    },400)
                },400)

                return;
            } else { //掉下去
                console.log("game over");
                // console.log(sofarH.h);
                $(".hero").animate({
                    "left": failLeft
                },400);
                // 最高记录写入
                if(heroMaxCount<sofarH.count){
                    console.log("adsfasdf");
                    saveCookie(userName + "heroMaxCount",sofarH.count)

                    // 发送请求到服务器保存最高记录 
                    $.get("/updateData/insert?token=" + token + "&data=" + sofarH.count,function(data){
                        console.log(data);
                        if(data.meta.code == 200){
                             console.log("写入成功");
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
                $(".begin-btn").fadeIn(400).css({
                    "fontSize": "18px"
                }).html("重新开始").on("click",function() {
                    window.location.reload();
                }).siblings().fadeOut('400');
            }
        });
        $("section").bind('touchmove',function(event) {
            event.preventDefault();
        });
        // 购买皮肤
        $("#buyBtn").on('click touchstart', function(event) {
            event.preventDefault();
            /* Act on the event */
            if($("#checkBox input[type='checkbox']").is(":checked")){
                if($.cookie(userName + "derma")==0){
                    derma = 1;
                    $.get("/updateData/derma?token=" + token + "&derma=" + derma,function(data){
                        if(data.meta.code == 200){
                            saveCookie(userName + "derma",derma)
                            // 发送请求到服务器进行确认 
                            console.log("购买成功");
                            $('#myModal').modal('hide');
                            $("section").css({
                                // "background": "url(/images/hero-b" + parseInt(Math.round(Math.random() + 1)) + ".jpg) no-repeat",
                                "background": "url(/images/hero-b5.jpg) no-repeat",
                                "background-size": "100% 100%"
                            });
                        }
                        
                    })
                    
                }else{
                    alert("不能重复购买")
                }
                
            }else{
                alert("请选择商品");
            }
        });
        // 查看排行
        $(".ranking-btn").on('click', function(event) {
            event.preventDefault();
            /* Act on the event */
            console.log("发送请求");
            $(".ranking-list").html("")


            $.get("/getData/list",function(data){
                /**
                    伪数据
                    var listData = gameResponse.data.sort(compare("data")).reverse();
                    listData.forEach(function(v,i){
                        if(i<9){
                            // console.log(v);
                            $(".ranking-list").append("<li>" + v.userName + " : " + v.data + "</li>")
                        }
                    })
                */
                
                /**
                    真实数据
                    
                    
                */
                if(data.meta.code == 200){
                    var listData = data.data.sort(compare("data")).reverse();
                    listData.forEach(function(v,i){
                        if(i<9){
                            console.log(v);
                            $(".ranking-list").append("<li>" + v.userName + " : " + v.data + "</li>")
                        }
                    })
                }
            })
            
        });
    });