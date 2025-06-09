import { saveTodosIntoLocalStorage, getTodosFromLocalStorage, formattedDate } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const addTodoInput = document.querySelector("[data-add-todo-input]");
  const addTodoBtn = document.querySelector("[data-add-todo-button]");
  const searchInput = document.querySelector("[data-search-todo-input]");
  const searchBtn = document.querySelector("[data-search-todo-button]");
  const todosContainer = document.querySelector("[data-todo-container]");
  const todoTemplate = document.querySelector("[data-todo-template]");

  if (!todoTemplate) {
    console.error("Template not found!");
    return;
  }

  let filteredArray = [];
  let isFiltered = false;

  let todoList = getTodosFromLocalStorage();
  console.log(todoList);

  addTodoBtn.addEventListener("click", () => {
    if (addTodoInput.value.trim()) {
      const newTodo = {
        id: Date.now(),
        text: addTodoInput.value.trim(),
        completed: false,
        createdAt: formattedDate,
      };

      todoList.push(newTodo);
      addTodoInput.value = "";
      saveTodosIntoLocalStorage(todoList);
      isFiltered = false;
      renderTodos();
    }
  });

  let debounceTimer;

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
      isFiltered = false;
      renderTodos();
      return;
    }

    filteredArray = todoList.filter((todo) =>
      todo.text.toLowerCase().includes(query)
    );
    isFiltered = true;
    renderTodos();
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
      isFiltered = false;
      renderTodos();
      return;
    }

    debounceTimer = setTimeout(() => {
      filteredArray = todoList.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
      isFiltered = true;
      renderTodos();
    }, 500);
  });

  const createTodoLayout = (todo) => {
    const todoElement = document.importNode(todoTemplate.content, true);

    const checkbox = todoElement.querySelector("[data-todo-checkbox]");
    checkbox.checked = todo.completed;

    checkbox.addEventListener("change", (e) => {
      todoList = todoList.map((t) => {
        if (t.id === todo.id) {
          t.completed = e.target.checked;
        }
        return t;
      });
      saveTodosIntoLocalStorage(todoList);
      renderTodos();
    });

    const todoText = todoElement.querySelector("[data-todo-text]");
    todoText.textContent = todo.text;

    const todoDate = todoElement.querySelector("[data-todo-date]");
    todoDate.textContent = todo.createdAt;

    const removeTodoBtn = todoElement.querySelector("[data-remove-todo-button]");
    removeTodoBtn.addEventListener("click", () => {
      todoList = todoList.filter((t) => t.id !== todo.id);
      saveTodosIntoLocalStorage(todoList);
      renderTodos();
    });

    // Додаємо кнопку зміни тексту (якщо є в шаблоні)
    const changeTodoBtn = todoElement.querySelector("[data-change-todo-button]");
    if (changeTodoBtn) {
      changeTodoBtn.addEventListener("click", () => {
        const newText = prompt("Введіть новий текст задачі", todo.text);
        if (newText && newText.trim()) {
          todo.text = newText.trim();
          saveTodosIntoLocalStorage(todoList);
          renderTodos();
        }
      });
    }

    return todoElement;
  };

  const renderTodos = () => {
    todosContainer.innerHTML = "";
    const arrToRender = isFiltered ? filteredArray : todoList;
    if (arrToRender.length === 0) {
      todosContainer.innerHTML = "<h2>No tasks...</h2>";
      return;
    }

    arrToRender.forEach((todo) => {
      const todoElement = createTodoLayout(todo);
      todosContainer.append(todoElement);
    });
  };

  renderTodos();
});