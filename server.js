const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 内存中的todos数据
let todos = [
  { id: 1, text: '学习Node.js', completed: true },
  { id: 2, text: '创建Todo List应用', completed: true },
  { id: 3, text: '部署到云端', completed: false },
  { id: 4, text: '添加更多功能', completed: false }
];

// API路由

// 获取所有todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// 获取单个todo
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// 创建新todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Todo text is required' });
  }
  
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    text: text.trim(),
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 更新todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (text !== undefined) {
    todos[todoIndex].text = text.trim();
  }
  
  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }
  
  res.json(todos[todoIndex]);
});

// 删除todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(todoIndex, 1);
  res.status(204).send();
});

// 前端路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Todo List应用运行在 http://localhost:${PORT}`);
  console.log(`API地址: http://localhost:${PORT}/api/todos`);
});