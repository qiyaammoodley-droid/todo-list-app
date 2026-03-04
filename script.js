const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

// Load saved tasks (if any)
let tasks = loadTasks();
renderTasks();

// Add task
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");
    li.dataset.id = String(task.id);

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = document.createElement("label");
    label.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(label);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.appendChild(left);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  }

  updateCounter();
}

function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  if (total === 0) {
    counter.textContent = "0 tasks";
  } else {
    counter.textContent = `${total} task${total === 1 ? "" : "s"} (${completed} completed)`;
  }
}

function saveTasks() {
  localStorage.setItem("todo_tasks", JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem("todo_tasks");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
    }
