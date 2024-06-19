const todoForm = document.querySelector("#new-todo-form");
const messageElement = document.querySelector("#message");
const searchInput = document.querySelector("#search-input");
const showAllButton = document.querySelector("#show-all-btn");

const removeMessage = (className) => {
  messageElement.classList.remove(className);
  messageElement.textContent = "";
  messageElement.classList.add("hidden");
};

const showMessage = (message, className) => {
  messageElement.textContent = message;
  messageElement.classList.add(className);
  messageElement.classList.remove("hidden");
  setTimeout(() => {
    removeMessage(className);
  }, 3000);
};

const handleShowAll = (event) => {
  event.preventDefault();
  searchInput.value = "";
  renderTodos();
};

const handleAddTodo = (event) => {
  event.preventDefault();
  try {
    const todoInput = document.querySelector("#todo-input");
    const todoTitle = todoInput.value.trim();
    if (todoTitle) {
      const newTodo = {
        id: Date.now(),
        title: todoTitle,
        completed: false,
      };
      todos.push(newTodo);
      renderTodos();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
      todoInput.value = "";
      // showMessage("Todo is added", "success");
    } else {
      showMessage("Todo is not added", "danger");
    }
  } catch (error) {
    console.error(error.message);
  }
};

const handleSaveTodo = (id, newTitle) => {
  try {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todos[index].title = newTitle;
      renderTodos();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }
  } catch (error) {
    console.error(error.message);
  }
};

const handleDeleteTodo = (id) => {
  try {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error(error.message);
  }
};

const handleCheckBox = (id) => {
  try {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    // renderTodos();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error(error.message);
  }
};

const loadDataFromLocalStorage = async () => {
  try {
    const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTodos && storedTodos.length > 0) {
      todos = JSON.parse(storedTodos);
      renderTodos();
    } else if (!storedTodos) {
      // create a default todo
      const defaultTodo = {
        id: Date.now(),
        title: "Learn JS",
        completed: false,
      };
      todos.push(defaultTodo);
      renderTodos();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }
  } catch (error) {
    console.error("Failed to load todos from local storage:", error.message);
  }
};

const renderTodos = () => {
  try {
    const todosList = document.querySelector("#todos-list");
    const todoCount = document.querySelector("#todo-count");

    todosList.innerHTML = "";
    const filteredTodos = todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    filteredTodos.forEach((todo) => {
      const { id, title, completed } = todo;
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo");

      const todoCheckbox = document.createElement("input");
      todoCheckbox.type = "checkbox";
      todoCheckbox.checked = completed;
      todoCheckbox.classList.add("todo-checkbox");
      todoCheckbox.addEventListener("change", () => handleCheckBox(id));

      const todoTitle = document.createElement("p");
      todoTitle.textContent = title;
      todoTitle.classList.add("todo-title");

      // Make the title clickable for editing
      todoTitle.addEventListener("click", () => {
        todoEditInput.classList.remove("hidden");
        todoTitle.classList.add("hidden");
        todoDeleteButton.classList.add("hidden");
        todoEditInput.focus();
      });

      const todoEditInput = document.createElement("input");
      todoEditInput.type = "text";
      todoEditInput.value = title;
      todoEditInput.classList.add("todo-input", "hidden");
      todoEditInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const newTitle = todoEditInput.value.trim();
          if (newTitle) {
            handleSaveTodo(id, newTitle);
            todoEditInput.classList.add("hidden");
            todoTitle.classList.remove("hidden");
            todoDeleteButton.classList.remove("hidden");
          }
        }
      });

      todoEditInput.addEventListener("blur", () => {
        const newTitle = todoEditInput.value.trim();
        if (newTitle) {
          handleSaveTodo(id, newTitle);
          todoEditInput.classList.add("hidden");
          todoTitle.classList.remove("hidden");
          todoDeleteButton.classList.remove("hidden");
        }
      });

      const todoDeleteButton = document.createElement("button");
      todoDeleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
      todoDeleteButton.addEventListener("click", () => handleDeleteTodo(id));

      todoItem.appendChild(todoCheckbox);
      todoItem.appendChild(todoTitle);
      todoItem.appendChild(todoEditInput);
      todoItem.appendChild(todoDeleteButton);

      todosList.appendChild(todoItem);
    });
    todoCount.textContent = `Total Todos: ${filteredTodos.length}`;
  } catch (error) {
    console.error(error.message);
  }
};

const getDomainBasedUID = () => {
  // benevolent non-interference
  const domain = window.location.href;
  console.log("Domain:", domain);
  let hash = 0;
  if (domain.length == 0) return hash;
  for (let i = 0; i < domain.length; i++) {
    let char = domain.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};

let todos = [];

const LOCAL_STORAGE_KEY = `todos-${getDomainBasedUID()}`;

window.addEventListener("DOMContentLoaded", async () => {
  await loadDataFromLocalStorage();
});

todoForm.addEventListener("submit", handleAddTodo);
showAllButton.addEventListener("click", handleShowAll);
searchInput.addEventListener("input", () => {
  renderTodos();
});

renderTodos();
