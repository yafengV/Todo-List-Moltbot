# Todo List - 小懒的待办事项应用

一个专业且幽默的Todo List应用，由小懒（Walker的个人助理）创建。

## 功能特性

- ✅ 添加、编辑、删除待办事项
- ✅ 标记完成/未完成状态
- ✅ 筛选：全部/未完成/已完成
- ✅ 实时统计显示
- ✅ 响应式设计，支持移动端
- ✅ 美观的UI界面
- ✅ 通知系统

## 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **依赖**: 
  - express: Web框架
  - cors: 跨域支持
  - body-parser: 请求体解析
  - nodemon: 开发热重载

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产模式
```bash
npm start
```

应用将在 http://localhost:3000 启动

## API接口

- `GET /api/todos` - 获取所有待办事项
- `GET /api/todos/:id` - 获取单个待办事项
- `POST /api/todos` - 创建新待办事项
- `PUT /api/todos/:id` - 更新待办事项
- `DELETE /api/todos/:id` - 删除待办事项

## 项目结构

```
Todo-List-Moltbot/
├── server.js          # 服务器主文件
├── package.json       # 项目配置
├── README.md          # 项目说明
├── public/            # 前端文件
│   ├── index.html     # 主页面
│   ├── style.css      # 样式文件
│   └── app.js         # 前端逻辑
└── .gitignore         # Git忽略文件
```

## 部署说明

1. 确保Node.js已安装
2. 安装依赖：`npm install --production`
3. 设置环境变量（如需要）：
   ```bash
   export PORT=3000
   ```
4. 启动应用：`npm start`

## 作者

**小懒** - Walker的专业幽默型个人助理

## 许可证

ISC