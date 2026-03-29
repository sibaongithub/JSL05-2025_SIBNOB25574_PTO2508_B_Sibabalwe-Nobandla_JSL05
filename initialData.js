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
      id: 11,
      title: "Learn Data Structures and Algorithms 📚",
      description: "Study fundamental data structures and algorithms to solve coding problems efficiently",
      status: "todo",
    },
    {
      id: 12,
      title: "Contribute to Open Source Projects 🌐",
      description: "Gain practical experience and collaborate with others in the software development community",
      status: "done",
    },
    {
      id: 13,
      title: "Build Portfolio Projects 🛠️",
      description: "Create a portfolio showcasing your skills and projects to potential employers",
      status: "done",
    },
  ];
  
  let allTasks = [...initialTasks];
  
  // ==================== Constants ====================
  
  const MAX_NEW_TASKS = 3;
  const VALID_STATUSES = ['todo', 'doing', 'done'];
  const COLUMNS = [
    { id: 'todo',  title: 'TO DO', color: '#4CB3E6' },
    { id: 'doing', title: 'DOING', color: '#635FC7' },
    { id: 'done',  title: 'DONE',  color: '#3ECF8E' }
  ];
  
  /** @type {object|null} Currently open task in the edit modal */
  let currentTask = null;
  
  // ==================== JSL05 — Local Storage ====================
  
  /**
   * Saves the current allTasks array to localStorage.
   * @returns {void}
   */
  function saveTasksToLocalStorage() {
    localStorage.setItem('kanban-tasks', JSON.stringify(allTasks));
  }
  
  /**
   * Loads tasks from localStorage. If no data is found the
   * initialTasks array is used as the starting point.
   * @returns {void}
   */
  function loadTasksFromLocalStorage() {
    const stored = localStorage.getItem('kanban-tasks');
    if (stored) {
      try {
        allTasks = JSON.parse(stored);
      } catch (e) {
        console.warn('Could not parse stored tasks — using initial data.', e);
        allTasks = [...initialTasks];
      }
    }
  }
  
  // ==================== Functions ====================
  
  /**
   * Returns the next available task ID by inspecting the last element
   * of allTasks and incrementing its id by 1.
   * @returns {number} The next unique task ID.
   */
  function getNextId() {
    if (allTasks.length === 0) {
      return 1;
    }
    const ids = allTasks.map(t => t.id);
    return Math.max(...ids) + 1;
  }
  
  /**
   * Validates whether the given status string is one of the accepted values.
   * @param {string} status - The status string to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  function validateStatus(status) {
    const normalizedStatus = status.toLowerCase().trim();
    return VALID_STATUSES.includes(normalizedStatus);
  }
  
  /**
   * Prompts the user for a task title, description, and status and
   * returns a structured task object. Loops until a valid status is entered.
   * @param {number} taskNumber - The display number used in the prompt text.
   * @returns {{ id: number, title: string, description: string, status: string }}
   */
  function getTaskFromUser(taskNumber) {
    let title       = prompt(`Enter task ${taskNumber} title:`);
    let description = prompt(`Enter task ${taskNumber} description:`);
    let status      = prompt(`Enter task ${taskNumber} status (todo, doing, or done):`);
  
    while (!validateStatus(status)) {
      alert("Invalid status. Please enter 'todo', 'doing', or 'done'.");
      status = prompt(`Enter task ${taskNumber} status (todo, doing, or done):`);
    }
  
    return {
      id: getNextId(),
      title,
      description,
      status: status.toLowerCase().trim()
    };
  }
  
  /**
   * Returns all tasks whose status equals "done".
   * @returns {object[]} Array of completed task objects.
   */
  function getCompletedTasks() {
    return allTasks.filter(task => task.status === 'done');
  }
  
  /** Logs all tasks to the console. @returns {void} */
  function logAllTasks() {
    console.log('All tasks:');
    console.log(allTasks);
  }
  
  /** Logs only completed tasks to the console. @returns {void} */
  function logCompletedTasks() {
    const completedTasks = getCompletedTasks();
    console.log('Completed tasks:');
    console.log(completedTasks);
  }
  
  /**
   * Filters allTasks by the given status value.
   * @param {string} status - One of "todo", "doing", or "done".
   * @returns {object[]} Filtered task array.
   */
  function getTasksByStatus(status) {
    return allTasks.filter(task => task.status === status);
  }
  
  /**
   * Creates a DOM card element for the given task and attaches a
   * click listener that opens the edit modal.
   * @param {object} task - The task object to render.
   * @returns {HTMLElement} The constructed article element.
   */
  function createTaskCard(task) {
    const card = document.createElement('article');
    card.className = 'card bg-panel rounded-[12px] p-3 shadow-card text-[13px] leading-[23px] font-bold';
    card.textContent = task.title;
    card.dataset.taskId = task.id;
    card.addEventListener('click', () => openTaskModal(task));
    return card;
  }
  
  /**
   * Builds a full column DOM element including header (dot, title, count)
   * and all task cards for the given column definition.
   * @param {{ id: string, title: string, color: string }} column - Column metadata.
   * @param {object[]} tasks - Tasks that belong in this column.
   * @returns {HTMLElement} The constructed column div.
   */
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
  
  /**
   * Clears the board container and re-renders all columns from allTasks.
   * @returns {void}
   */
  function renderBoard() {
    const container = document.getElementById('boardContainer');
    container.innerHTML = '';
  
    COLUMNS.forEach(column => {
      const tasks = getTasksByStatus(column.id);
      const columnElement = createColumn(column, tasks);
      container.appendChild(columnElement);
    });
  }
  
  /**
   * Opens the task-edit modal and populates its fields with the given task's data.
   * @param {object} task - The task to display in the modal.
   * @returns {void}
   */
  function openTaskModal(task) {
    currentTask = task;
    const modal           = document.getElementById('modalBackdrop');
    const titleInput      = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const statusSelect    = document.getElementById('taskStatus');
  
    titleInput.value       = task.title;
    descriptionInput.value = task.description;
    statusSelect.value     = task.status;
  
    modal.classList.add('active');
    setTimeout(() => titleInput.focus(), 100);
  }
  
  /**
   * Closes the task-edit modal and clears the currentTask reference.
   * @returns {void}
   */
  function closeTaskModal() {
    const modal = document.getElementById('modalBackdrop');
    modal.classList.remove('active');
    currentTask = null;
  }
  
  /**
   * Handles submission of the task-edit form. Updates the task in allTasks,
   * saves to localStorage, and refreshes the board as needed.
   * @param {Event} event - The form submit event.
   * @returns {void}
   */
  function handleTaskSubmit(event) {
    event.preventDefault();
  
    if (!currentTask) return;
  
    const titleInput       = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const statusSelect     = document.getElementById('taskStatus');
  
    currentTask.title       = titleInput.value;
    currentTask.description = descriptionInput.value;
    const oldStatus         = currentTask.status;
    currentTask.status      = statusSelect.value;
  
    // Persist changes (JSL05)
    saveTasksToLocalStorage();
  
    if (oldStatus !== currentTask.status) {
      renderBoard();
    } else {
      const card = document.querySelector(`[data-task-id="${currentTask.id}"]`);
      if (card) {
        card.textContent = currentTask.title;
      }
    }
  
    closeTaskModal();
  }
  
  // ==================== JSL05 — Add New Task Modal ====================
  
  /**
   * Opens the "Add New Task" modal and focuses the title input.
   * @returns {void}
   */
  function openAddTaskModal() {
    document.getElementById('addTaskModalBackdrop').classList.add('active');
    setTimeout(() => document.getElementById('newTaskTitle').focus(), 100);
  }
  
  /**
   * Closes the "Add New Task" modal and resets the form fields.
   * @returns {void}
   */
  function closeAddTaskModal() {
    document.getElementById('addTaskModalBackdrop').classList.remove('active');
    document.getElementById('addTaskForm').reset();
  }
  
  /**
   * Handles submission of the "Add New Task" form. Creates a new task object,
   * pushes it to allTasks, saves to localStorage, re-renders the board, and
   * closes the modal.
   * @param {Event} event - The form submit event.
   * @returns {void}
   */
  function handleAddTaskSubmit(event) {
    event.preventDefault();
  
    const title       = document.getElementById('newTaskTitle').value.trim();
    const description = document.getElementById('newTaskDescription').value.trim();
    const status      = document.getElementById('newTaskStatus').value;
  
    const newTask = {
      id: getNextId(),
      title,
      description,
      status
    };
  
    allTasks.push(newTask);
    saveTasksToLocalStorage();
    renderBoard();
    closeAddTaskModal();
  
    console.log('New task added:', newTask);
    logAllTasks();
  }
  
  // ==================== Initialisation ====================
  
  /**
   * Entry point. Loads tasks from localStorage (falling back to initialTasks),
   * renders the board, and wires up all event listeners for both modals.
   * @returns {void}
   */
  function init() {
    // JSL05: Hydrate from localStorage before first render
    loadTasksFromLocalStorage();
  
    renderBoard();
  
    // ---- Edit-task modal listeners (JSL04) ----
    const closeButton   = document.getElementById('closeButton');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const taskForm      = document.getElementById('taskForm');
  
    if (closeButton)   closeButton.addEventListener('click', closeTaskModal);
    if (taskForm)      taskForm.addEventListener('submit', handleTaskSubmit);
  
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (event) => {
        if (event.target === modalBackdrop) closeTaskModal();
      });
    }
  
    // ---- Add-task modal listeners (JSL05) ----
    const addTaskBtnDesktop = document.getElementById('addTaskBtnDesktop');
    const addTaskBtnMobile  = document.getElementById('addTaskBtnMobile');
    const addTaskBackdrop   = document.getElementById('addTaskModalBackdrop');
    const closeAddBtn       = document.getElementById('closeAddTaskButton');
    const addTaskForm       = document.getElementById('addTaskForm');
  
    if (addTaskBtnDesktop) addTaskBtnDesktop.addEventListener('click', openAddTaskModal);
    if (addTaskBtnMobile)  addTaskBtnMobile.addEventListener('click',  openAddTaskModal);
    if (closeAddBtn)       closeAddBtn.addEventListener('click', closeAddTaskModal);
    if (addTaskForm)       addTaskForm.addEventListener('submit', handleAddTaskSubmit);
  
    if (addTaskBackdrop) {
      addTaskBackdrop.addEventListener('click', (event) => {
        if (event.target === addTaskBackdrop) closeAddTaskModal();
      });
    }
  
    // Global Escape key handler
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (modalBackdrop  && modalBackdrop.classList.contains('active'))  closeTaskModal();
      if (addTaskBackdrop && addTaskBackdrop.classList.contains('active')) closeAddTaskModal();
    });
  
    // JSL04 debug logs
    logAllTasks();
    logCompletedTasks();
  }
  
  // ==================== Start ====================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
