// ==================== Initial Data ====================

const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
  },
  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
  },
  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
  },
  {
    id: 4,
    title: "Learn Data Structures and Algorithms 📚",
    description: "Study fundamental data structures and algorithms to solve coding problems efficiently",
    status: "todo",
  },
  {
    id: 5,
    title: "Contribute to Open Source Projects 🌐",
    description: "Gain practical experience and collaborate with others in the software development community",
    status: "done",
  },
  {
    id: 6,
    title: "Build Portfolio Projects 🛠️",
    description: "Create a portfolio showcasing your skills and projects to potential employers",
    status: "done",
  },
];

// ==================== Constants ====================

const STORAGE_KEY = 'kanban_tasks';
const VALID_STATUSES = ['todo', 'doing', 'done'];
const COLUMNS = [
  { id: 'todo', title: 'TO DO', color: '#4CB3E6' },
  { id: 'doing', title: 'DOING', color: '#635FC7' },
  { id: 'done', title: 'DONE', color: '#3ECF8E' }
];

let allTasks = [];
let currentTask = null;
let isEditMode = false;

// ==================== LocalStorage Functions ====================

/**
 * Saves tasks to localStorage
 */
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTasks));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Loads tasks from localStorage
 */
function loadTasks() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            allTasks = JSON.parse(saved);
            console.log('Loaded tasks from localStorage:', allTasks);
        } else {
            allTasks = [...initialTasks];
            saveTasks();
            console.log('No saved tasks, using initial data');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        allTasks = [...initialTasks];
    }
}

// ==================== Task Management Functions ====================

function getNextId() {
    if (allTasks.length === 0) {
        return 1;
    }
    const maxId = Math.max(...allTasks.map(task => task.id));
    return maxId + 1;
}

function validateStatus(status) {
    const normalizedStatus = status.toLowerCase().trim();
    return VALID_STATUSES.includes(normalizedStatus);
}

function getTasksByStatus(status) {
    return allTasks.filter(task => task.status === status);
}

function getCompletedTasks() {
    return allTasks.filter(task => task.status === 'done');
}

function createTask(title, description, status) {
    if (!title || !title.trim()) {
        alert('Please enter a task title');
        return null;
    }
    
    if (!validateStatus(status)) {
        alert('Invalid status');
        return null;
    }
    
    const newTask = {
        id: getNextId(),
        title: title.trim(),
        description: description.trim(),
        status: status.toLowerCase().trim()
    };
    
    allTasks.push(newTask);
    saveTasks();
    return newTask;
}

function updateTask(taskId, title, description, status) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return null;
    
    const oldStatus = task.status;
    task.title = title.trim();
    task.description = description.trim();
    task.status = status.toLowerCase().trim();
    
    saveTasks();
    
    return {
        task: task,
        statusChanged: oldStatus !== task.status
    };
}

// ==================== DOM Functions ====================

function createTaskCard(task) {
    const card = document.createElement('article');
    card.className = 'card bg-panel rounded-[12px] p-3 shadow-card text-[13px] leading-[23px] font-bold';
    card.textContent = task.title;
    card.dataset.taskId = task.id;
    card.addEventListener('click', () => openEditModal(task));
    return card;
}

function createColumn(column, tasks) {
    const columnDiv = document.createElement('div');
    columnDiv.className = 'col-fixed mb-6 md:mb-0';
    
    const header = document.createElement('div');
    header.className = 'flex items-center gap-3 mb-4';
    
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = column.color;
    
    const title = document.createElement('h4');
    title.className = 'text-[12px] font-semibold leading-[15px]';
    title.textContent = column.title;
    
    const count = document.createElement('span');
    count.className = 'text-[13px] text-muted opacity-80';
    count.textContent = `(${tasks.length})`;
    
    header.appendChild(dot);
    header.appendChild(title);
    header.appendChild(count);
    
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'flex flex-col gap-4';
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksContainer.appendChild(taskCard);
    });
    
    columnDiv.appendChild(header);
    columnDiv.appendChild(tasksContainer);
    
    return columnDiv;
}

function renderBoard() {
    const container = document.getElementById('boardContainer');
    container.innerHTML = '';
    
    COLUMNS.forEach(column => {
        const tasks = getTasksByStatus(column.id);
        const columnElement = createColumn(column, tasks);
        container.appendChild(columnElement);
    });
}

// ==================== Modal Functions ====================

function openCreateModal() {
    currentTask = null;
    isEditMode = false;
    
    const modal = document.getElementById('modalBackdrop');
    const modalTitle = modal.querySelector('h2');
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const statusSelect = document.getElementById('taskStatus');
    const submitButton = modal.querySelector('button[type="submit"]');
    
    modalTitle.textContent = 'Add New Task';
    submitButton.textContent = 'Create Task';
    
    titleInput.value = '';
    descriptionInput.value = '';
    statusSelect.value = 'todo';
    
    modal.classList.add('active');
    setTimeout(() => titleInput.focus(), 100);
}

function openEditModal(task) {
    currentTask = task;
    isEditMode = true;
    
    const modal = document.getElementById('modalBackdrop');
    const modalTitle = modal.querySelector('h2');
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const statusSelect = document.getElementById('taskStatus');
    const submitButton = modal.querySelector('button[type="submit"]');
    
    modalTitle.textContent = 'Edit Task';
    submitButton.textContent = 'Save Changes';
    
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    statusSelect.value = task.status;
    
    modal.classList.add('active');
    setTimeout(() => titleInput.focus(), 100);
}

function closeModal() {
    const modal = document.getElementById('modalBackdrop');
    modal.classList.remove('active');
    currentTask = null;
    isEditMode = false;
}

function handleTaskSubmit(event) {
    event.preventDefault();
    
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const statusSelect = document.getElementById('taskStatus');
    
    const title = titleInput.value;
    const description = descriptionInput.value;
    const status = statusSelect.value;
    
    if (isEditMode && currentTask) {
        // Edit existing task
        const result = updateTask(currentTask.id, title, description, status);
        if (result) {
            renderBoard();
        }
    } else {
        // Create new task
        const newTask = createTask(title, description, status);
        if (newTask) {
            renderBoard();
        }
    }
    
    closeModal();
}

// ==================== Initialization ====================

function init() {
    // Load tasks from localStorage
    loadTasks();
    
    // Render the board
    renderBoard();
    
    // Modal event listeners
    const closeButton = document.getElementById('closeButton');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const taskForm = document.getElementById('taskForm');
    
    closeButton.addEventListener('click', closeModal);
    
    modalBackdrop.addEventListener('click', (event) => {
        if (event.target === modalBackdrop) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closeModal();
        }
    });
    
    taskForm.addEventListener('submit', handleTaskSubmit);
    
    // Add Task button listeners
    const desktopAddButton = document.getElementById('addTaskButtonDesktop');
    const mobileAddButton = document.getElementById('addTaskButtonMobile');
    
    if (desktopAddButton) {
        desktopAddButton.addEventListener('click', openCreateModal);
    }
    
    if (mobileAddButton) {
        mobileAddButton.addEventListener('click', openCreateModal);
    }
    
    // Log for debugging
    console.log('All tasks:', allTasks);
    console.log('Completed tasks:', getCompletedTasks());
}

// ==================== Start ====================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
