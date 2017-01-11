var LOCAL_STATUS_START = {
    action: "start",
    name: "开始",
    stop: false
}

var LOCAL_STATUS_END = {
    action: "end",
    name: "结束",
    stop: true
}

var LOCAL_STATUS_HAPPYEND = {
    action: "happy ending",
    name: "抽奖结束",
    stop: true
}

// 初始化奖项个数
var FIRST_AWARD_LENGTH = 1
var SECOND_AWARD_LENGTH = 1
var THIRD_AWARD_LENGTH = 1
var FOUTH_AWARD_LENGTH = 2
var FIFTH_AWARD_LENGTH = 3


// 启动滚动动画
var start_animate

var lottery = new Vue({
    el: '#lottery',
    data: {
        items: get_localdata() === null || "" ? localdata : JSON.parse(get_localdata()),
        status: LOCAL_STATUS_START
    },
    methods: {
        updateStatus: function(e) {
            var e = e || event
            e.target.blur();
            e.preventDefault();
            updataStatus()
        }
    }
})


function updataStatus() {
    var that = document.querySelector("#startBtn")
    doLottery(that)
    if (that.getAttribute("data-status") == "start") {
        lottery.status = LOCAL_STATUS_END
    } else {
        lottery.status = LOCAL_STATUS_START
    }

}
// 抽奖
function doLottery(item) {
    var flag = $(item).attr("data-status")
    if (flag == "start") {
        start()
    } else {
        stop()
        local_save()
    }

    function start() {
        // 删除默认图片
        $("#profile-default").remove()

        // 删除中奖的员工信息
        var index = $("#oUl li:first").attr("data-index")
        lottery.items.splice(index, 1)

        //每次开始前自动洗牌
        shuffle()
        start_animate = self.setInterval('autoScroll("#profile", "#oUl")', 50)


    }

    function stop() {
        clearInterval(start_animate)
        var index = $("#oUl li:first").attr("data-index")
        setAward(lottery.items[index])

    }

    function getRandomItem() {
        var len = lottery.items.length
        return Math.floor(Math.random() * len)
    }
}

// 图片滚动
function autoScroll(obj, ul_bz) {
    $(obj).find(ul_bz).animate({}, 50, function() {
        $(this).find("li:first").appendTo(this);
    });
}

// 缓存数据至local
function local_save() {
    localStorage.setItem("localdata", JSON.stringify(lottery.items))
    localStorage.setItem("awardlist", JSON.stringify($("#award-list").html()))
}

// 设置活动结束状态
function stopLotteryStatus() {
    localStorage.setItem("stopLottery", true)
}

// 获取活动进行状态
function getLotteryStatus() {
    return localStorage.getItem("stopLottery")
}

// 重置数据
function resetLocalData() {
    localStorage.clear()
    window.location.reload()
}

// 获取本地缓存数据
function get_localdata() {
    return localStorage.getItem("localdata")
}

// 获取奖项列表
function get_awardlist() {
    return localStorage.getItem("awardlist")
}

// 初始化页面
function initPage(callback) {
    // 隐藏按钮
    $("#startBtn").hide()
    if (get_awardlist() !== null) {
        // 删除默认图片
        $("#profile-default").remove()
        $("#award-list").empty().html(JSON.parse(get_awardlist()))
    }

    if (getLotteryStatus() === "true") {
        stopLottery()
    }

    listenKeydown()
    callback()
}

// 设置奖项，添加至section 中
function setAward(param) {
    if ($("#fifth-award li").length < FIFTH_AWARD_LENGTH) {
        $(".award-5").addClass("award-bg")
        $("#fifth-award").append(initAwardNode(param))
        FIFTH_AWARD_LENGTH = isLeader(param) ? FIFTH_AWARD_LENGTH+1 : FIFTH_AWARD_LENGTH
    }else if ($("#fouth-award li").length < FOUTH_AWARD_LENGTH) {
        $(".award-4").addClass("award-bg")
        $("#fouth-award").append(initAwardNode(param))
        FOUTH_AWARD_LENGTH = isLeader(param) ? FOUTH_AWARD_LENGTH+1 : FOUTH_AWARD_LENGTH
    }else if ($("#third-award li").length < THIRD_AWARD_LENGTH) {
        $(".award-3").addClass("award-bg")
        $("#third-award").append(initAwardNode(param))
        THIRD_AWARD_LENGTH = isLeader(param) ? THIRD_AWARD_LENGTH+1 : THIRD_AWARD_LENGTH
    } else if ($("#second-award li").length < SECOND_AWARD_LENGTH) {
        $("#second-award").append(initAwardNode(param))
        $(".award-2").addClass("award-bg")
        SECOND_AWARD_LENGTH = isLeader(param) ? SECOND_AWARD_LENGTH+1 : SECOND_AWARD_LENGTH
    } else if ($("#first-award li").length <= FIRST_AWARD_LENGTH) {
        $("#first-award").append(initAwardNode(param))
        $(".award-1").addClass("award-bg")
        FIRST_AWARD_LENGTH = isLeader(param) ? FIRST_AWARD_LENGTH+1 : FIRST_AWARD_LENGTH
        if( $("#first-award li").length === FIRST_AWARD_LENGTH ){
           stopLottery() 
        }
    } else {
        alert("happy ending")
    }
}

// 生成奖项列表的node
function initAwardNode(param) {
    // return '<li><img src="' + param.imageUrl + '" alt=""><b class="lt-block">' + param.userName + '</b></li>'
    return '<li><b class="lt-block">' + param.userName + '</b></li>'
}


// 结束活动  置灰按钮
function stopLottery() {
    $("#lottery button").text("活动结束").attr("disabled", true)
    stopLotteryStatus()
}


function listenKeydown() {
    $(document).on("keydown", function(event) {
        if (event.keyCode === 32 && !$("#startBtn").attr("disabled")) {
            updataStatus()
        }
    })
}


function shuffle() {
    lottery.items = window.knuthShuffle(lottery.items.slice(0));
}

function showBtn(callback) {
    $("#startBtn").show().addClass('animated slideInDown')
    callback()
}

function showList(callback) {
    $("#award-list").removeClass("hiden").addClass('animated slideInDown')
    if (arguments && arguments.length === 1) {
        callback()
    }

}

function toggleSetting() {
    $.alert({
        theme: 'black',
        animationBounce: 2.5,
        closeAnimation: 'scale',
        title: 'SETTING',
        content: '<button type="button" class="am-btn am-btn-primary" onclick="resetLocalData()">重置</button><button type="button" class="am-btn am-btn-primary" onclick="shuffle()">洗牌</button>',
        closeIcon: true,
        confirmButton: 'Cancel',
    });


}


function isLeader(param){
    return param.leader
}