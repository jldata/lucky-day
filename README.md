# lucky-day# lucky-day
# 程序简述：
  
-  1.这是一个纯前端抽奖程序，使用localStorage做的本地缓存，右下角的setting拥有初始化和洗牌两个功能。
-  2.奖项配置可以在app.js中设置，有几个静态变量，可以自行修改。
-  3.数据全部存储在local.js中，json格式，属性分别是username,imageurl,leader，其中leader属性的作用是，抽中leader为true的，该奖项自动加1，如不需要leader属性可以全部置为false。
-  4.依赖关系，使用vue做的双向绑定，使用jquery和animate.css (https://github.com/daneden/animate.css) 做了一些动画处理，弹出框使用jquery-confirm (https://github.com/craftpip/jquery-confirm)，洗牌功能使用shuffle.js。
