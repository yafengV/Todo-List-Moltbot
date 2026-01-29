class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadTodos();
        this.setupEventListeners();
        this.render();
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            if (response.ok) {
                this.todos = await response.json();
            }
        } catch (error) {
            console.error('加载待办事项失败:', error);
            this.showNotification('无法加载待办事项', 'error');
        }
    }

    setupEventListeners() {
        // 添加按钮
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        
        // 输入框回车键
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // 筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });
    }

    async addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (!text) {
            this.showNotification('请输入待办事项内容', 'warning');
            return;
        }

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                const newTodo = await response.json();
                this.todos.push(newTodo);
                input.value = '';
                this.render();
                this.showNotification('待办事项添加成功！', 'success');
            }
        } catch (error) {
            console.error('添加待办事项失败:', error);
            this.showNotification('添加失败，请重试', 'error');
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !todo.completed })
            });

            if (response.ok) {
                todo.completed = !todo.completed;
                this.render();
                this.showNotification(`标记为${todo.completed ? '已完成' : '未完成'}`, 'info');
            }
        } catch (error) {
            console.error('更新待办事项失败:', error);
            this.showNotification('更新失败，请重试', 'error');
        }
    }

    async editTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo || !newText.trim()) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText })
            });

            if (response.ok) {
                todo.text = newText.trim();
                this.render();
                this.showNotification('待办事项已更新', 'success');
            }
        } catch (error) {
            console.error('编辑待办事项失败:', error);
            this.showNotification('编辑失败，请重试', 'error');
        }
    }

    async deleteTodo(id) {
        if (!confirm('确定要删除这个待办事项吗？')) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.todos = this.todos.filter(t => t.id !== id);
                this.render();
                this.showNotification('待办事项已删除', 'info');
            }
        } catch (error) {
            console.error('删除待办事项失败:', error);
            this.showNotification('删除失败，请重试', 'error');
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('pendingCount').textContent = pending;
    }

    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        // 更新统计
        this.updateStats();

        // 清空列表
        todoList.innerHTML = '';

        // 显示/隐藏空状态
        if (filteredTodos.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            
            // 渲染待办事项
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</span>
                    <div class="todo-actions">
                        <button class="todo-btn edit-btn" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="todo-btn delete-btn" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                // 添加事件监听器
                const checkbox = li.querySelector('.todo-checkbox');
                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

                const editBtn = li.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => this.promptEdit(todo));

                const deleteBtn = li.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

                todoList.appendChild(li);
            });
        }
    }

    promptEdit(todo) {
        const newText = prompt('编辑待办事项:', todo.text);
        if (newText !== null && newText.trim() !== todo.text) {
            this.editTodo(todo.id, newText);
        }
    }

    showNotification(message, type = 'info') {
        // 移除现有的通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建新通知
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;

        // 设置颜色
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        // 添加动画样式
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});