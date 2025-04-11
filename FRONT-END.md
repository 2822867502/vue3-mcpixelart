# 前端部分 Front-end Part

## 说明 Description

前端提供浏览器运行的用户界面进行交互，上传和预处理用户选择的文件，向服务器发送请求和接收响应。  
为了减小服务器压力，对文件的处理逻辑尽可能多地放在了前端实现。

The front-end provides a user interface for the browser to interact, upload and preprocess files selected by the user, send requests to the server, and receive responses.  
In order to reduce server pressure, the processing logic for files has been implemented as much as possible in the front-end.

## /src 目录结构 Directory Structure 
* App.vue *主界面 挂载Layout组件和provide模态框*  
* main.js   
* style.css *全局样式*  
* style.scss *bootstrap样式引入*  
* api *管理网络请求*  
   - index.js *axios实例 请求、响应拦截器*  
   - error.js *错误主动上报api*  
   - mc2d.js *像素画api*  
   - mc3d.js *雕塑api*  
   - mcManual.js *手动搭建api*  
   - mcMusic.js *红石音乐api*  
   - playground.js *广场api*  
   - share.js *分享api*  
   - user.js *用户api*  
* assets  
   - data  
      * blocksArt.json *制作像素画使用的59种方块*  
      * constant.json *存放版本号等常量*  
      * version.json *版本更新日志*  
   - font
      * Minecraft.woff2  
   - img  *存放项目使用的图片 BlockCSS为wiki上找到的方块精灵图*  
   - svg *项目使用的图标*  
* components *组件*  
   - ContentSelector.vue *广场使用过滤选择器*  
   - FootBar.vue *页脚*  
   - GlobalModal.vue *普通模态框*  
   - ImageCropper.vue *手动搭建小图和大图显示*  
   - Layout.vue *页面总体布局 版心居中*  
   - MIDITrack.vue *MIDI音轨*  
   - MIDITrackInfo.vue *MIDI音轨信息*  
   - NavBar.vue *导航栏*  
   - Pagination.vue *分页*  
   - PictureBox.vue *显示ImageData*  
   - PlayCard.vue *广场的卡片*  
   - QuantityCell.vue *像素画每种方块统计信息的卡片*  
   - QuantityStatistics.vue *像素画统计信息*  
   - SettingModal.vue *像素画设置模态框*  
   - ShareModal.vue *分享模态框*  
   - UserInfo.vue *用户信息模态框*  
   - ViewSelector.vue *主页的选择框*  
   - Waiting.vue *Worker/Promise等待任务模态框*  
* router *vue-router*  
   - index.js *router配置*  
* store *pinia仓库*  
   - blocksArt.js *方块相关*  
   - history.js *数据本地化管理*  
   - product.js *作品成品存放在这里 发请求直接发的这里的数据*  
   - setting.js *像素画设置*  
   - user.js *用户信息*  
* utils *工具库*  
   - artMaker.js *像素画制作算法*  
   - autoDownload.js *自动下载*  
   - dataStruct.js *自定义数据结构 Counter方块计数器* 
   - errorReporter.js *错误主动上报*   
   - fix.js *兼容性修补*
   - formatter.js *格式化*  
   - globalModal.js *普通模态框*  
   - imageUtils.js *图片解析*  
   - MIDI.js *MIDI解析*  
   - shareModal.js *分享模态框*  
   - transplant.js *移植上个版本网站的用户配置*  
   - userModal.js *用户信息模态框*  
   - waitModal.js *等待模态框*  
   - workers *Web Worker*  
      * voxel.js *雕塑体素化算法*  
      * worker.js *waitModal函数传入的普通同步函数在这里执行*  
* views *路由指向的页面*  
   - HomePage.vue *主页*  
   - Minecraft2D.vue *像素画制作*  
   - Minecraft3D.vue *雕塑制作*  
   - MinecraftManual.vue *像素画手动搭建*  
   - MinecraftMusic.vue *红石音乐*  
   - Playground.vue *广场*  
   - Privacy.vue *隐私*  
   - Versions.vue *版本日志*  