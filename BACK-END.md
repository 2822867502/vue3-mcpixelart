# 后端部分 Back-end Part

## 说明 Description

后端服务器处理前端请求、投影文件生成与存储、数据库交互  
使用了[litemapy](https://github.com/SmylerMC/litemapy)库实现投影文件生成  

The backend server processes frontend requests, generates and stores projection files, and interacts with databases
Used [litemapy](https://github.com/SmylerMC/litemapy) Library implementation for generating .litematic files

## /backend 目录结构
* utils  
  - .env 环境变量 数据库常量  
  - db.py 提供数据库操作接口  
  - net.py 提供可复用的逻辑  
* enhance.py 强化地图画  
* error.py 错误上报处理  
* midware.py 解压中间件  
* music.py 红石音乐  
* pixelart.py 像素画  
* user.py 用户、广场  