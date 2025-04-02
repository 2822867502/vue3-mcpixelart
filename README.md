# MCPixelArt - Minecraft 像素画/地图画、雕塑和红石音乐在线制作与分享平台

**MCPixelArt** 是一个专注于 Minecraft 像素画/地图画、雕塑和红石音乐创作的在线平台。用户可以通过我们的工具轻松设计和分享自己的作品，无论是像素画、雕塑还是复杂的红石音乐，都能在这里找到灵感和工具。

## 项目简介

- **项目名称**: MCPixelArt  
- **项目类型**: 第三方 Minecraft 创作工具平台  
- **在线地址**: [https://mcpixelart.com](https://mcpixelart.com)  
- **B站主页**: [https://space.bilibili.com/1019826327](https://space.bilibili.com/1019826327)  

## 主要功能

1. **像素画/地图画制作**  
   - 提供直观的像素画转换页面，自定义大小和方块选择，可制作立体地图画，支持抖动算法。  
   - 生成 Minecraft 像素画/地图画投影，方便导入游戏。
   - 手动搭建功能方便基岩版/网易版/不用投影mod的玩家搭建

2. **雕塑设计**  
   - .obj文件转换为雕塑，支持在线预览和下载投影。

3. **红石音乐创作**  
   - 提供midi音乐转换。
   - 生成投影文件或手动搭建。
   - 3种音高调整方案，可拆分和查看音轨。

4. **作品分享与社区**  
   - 用户可以将自己的作品上传到平台，与其他玩家分享。  
   - 下载其他用户的作品。  

## 使用教程

我准备了详细的教学视频，欢迎访问 B站主页观看: 
- [我的Bilibili主页](https://space.bilibili.com/1019826327)  

## src目录结构
* App.vue *主界面 挂载Layout组件和provide模态框*  
* main.js   
* style.css *全局样式*  
* style.scss *bootstrap样式引入*  
* api *管理网络请求*  
   - index.js *axios实例 请求、响应拦截器*  
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
      * worker.js *waitModal传入的普通同步函数在这里执行*  
* views *路由指向的页面*  
   - HomePage.vue *主页*  
   - Minecraft2D.vue *像素画制作*  
   - Minecraft3D.vue *雕塑制作*  
   - MinecraftManual.vue *像素画手动搭建*  
   - MinecraftMusic.vue *红石音乐*  
   - Playground.vue *广场*  
   - Privacy.vue *隐私*  
   - Versions.vue *版本日志*  

## 技术栈 目前只上传了前端项目

- **前端**: Vue3, Vite, Tone.js, Three.js
- **后端**: Python, Nginx
- **数据库**: Mysql

## 如何贡献

如果您对项目感兴趣，欢迎贡献代码或提出建议！
- **问题反馈**: 请在 GitHub Issues 中提交问题或建议。  

## 联系我

如果您有任何问题或合作意向，欢迎通过以下方式联系我：  
- **Email**: 19950083014@163.com  