let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;

    if (input.value.trim() === "") return;

    tasks.push({
        text: input.value,
        completed: false,
        priority: priority
    });

    input.value = "";
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let completedCount = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add(task.priority);

        if (task.completed) {
            li.classList.add("completed");
            completedCount++;
        }

        li.innerHTML = `
            <span onclick="toggleTask(${index})">${task.text}</span>
            <button onclick="deleteTask(${index})">❌</button>
        `;

        list.appendChild(li);
    });

    updateProgress(completedCount);
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function updateProgress(completed) {
    const bar = document.getElementById("progressBar");
    const total = tasks.length;

    let percent = total === 0 ? 0 : (completed / total) * 100;
    bar.style.width = percent + "%";
}

// Initial render
renderTasks();
