const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Add task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    saveAndRender();
    taskInput.value = "";
  }
});

// Filter buttons
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Save and render tasks
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task" + (task.completed ? " completed" : "");

      const span = document.createElement("span");
      span.textContent = task.text;
      span.className = "text";
      span.onclick = () => toggleComplete(index);

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.onclick = () => editTask(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.onclick = () => deleteTask(index);

      li.append(span, editBtn, deleteBtn);
      taskList.appendChild(li);
    });
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndRender();
}

function editTask(index) {
  const li = taskList.children[index];
  const span = li.querySelector(".text");

  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].text;
  input.className = "edit";

  li.replaceChild(input, span);
  input.focus();

  input.addEventListener("blur", () => {
    tasks[index].text = input.value.trim() || tasks[index].text;
    saveAndRender();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.blur();
    }
  });
}

// Initial render
renderTasks();
