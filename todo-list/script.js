const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearBtn = document.getElementById("clearBtn");

// tasks = [{ text: "...", completed: false }]
let tasks = [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    try {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (e) {
        tasks = [];
    }
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        const li = document.createElement("li");
        li.className = "task" + (task.completed ? " completed" : "");
        li.dataset.index = index;

        const left = document.createElement("div");
        left.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "complete-checkbox";
        checkbox.checked = task.completed;

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text; // safe: no HTML injection

        left.appendChild(checkbox);
        left.appendChild(span);

        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "Delete";

        li.appendChild(left);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    updateTaskCount();
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

function updateTaskCount() {
    const total = tasks.length;
    const pending = tasks.filter(function (t) {
        return !t.completed;
    }).length;

    if (total === 0) {
        taskCount.textContent = "No tasks yet";
    } else {
        taskCount.textContent =
            pending + " of " + total + (total === 1 ? " task" : " tasks") + " left";
    }
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

taskList.addEventListener("click", function (event) {
    const li = event.target.closest(".task");
    if (!li) return;

    const index = Number(li.dataset.index);

    if (event.target.classList.contains("delete-btn")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    if (event.target.classList.contains("complete-checkbox")) {
        tasks[index].completed = event.target.checked;
        saveTasks();
        renderTasks();
    }
});

clearBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (t) {
        return !t.completed;
    });
    saveTasks();
    renderTasks();
});

loadTasks();
renderTasks();
