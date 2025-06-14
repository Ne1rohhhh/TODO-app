import { saveTodosIntoLocalStorage, getTodosFromLocalStorage, formattedDate } from "./utils.js";

const addTodoInput = document.querySelector("[data-add-todo-input]");
const addTodoBtn = document.querySelector("[data-add-todo-button]");
const clearAllBtn = document.querySelector("[data-clear-all-todos-button]");
const searchInput = document.querySelector("[data-search-todo-input]");
const searchBtn = document.querySelector("[data-search-todo-button]");
const todosContainer = document.querySelector("[data-todo-container]");
const todoTemplate = document.querySelector("[data-todo-template]");

export let filteredArray = [];
export let isFiltered = false;
export let todoList = getTodosFromLocalStorage();

export const setIsFiltered = (val) => {
  isFiltered = val;
};

export const updateTodoList = (newArray) => {
  todoList = newArray;
  saveTodosIntoLocalStorage(todoList);
};

export const updateFilteredArray = (newArray) => {
  filteredArray = newArray;
};

export const renderTodos = () => {
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

const createTodoLayout = (todo) => {
  const todoElement = document.importNode(todoTemplate.content, true);
  const checkbox = todoElement.querySelector("[data-todo-checkbox]");
  const todoText = todoElement.querySelector("[data-todo-text]");
  const todoDate = todoElement.querySelector("[data-todo-date]");
  const removeTodoBtn = todoElement.querySelector("[data-remove-todo-button]");
  const changeTodoBtn = todoElement.querySelector("[data-change-todo-button]");

  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", (e) => {
    const updatedList = todoList.map((t) => {
      if (t.id === todo.id) {
        return { ...t, completed: e.target.checked };
      }
      return t;
    });
    updateTodoList(updatedList);

    if (isFiltered) {
      const query = searchInput.value.toLowerCase().trim();
      const filtered = updatedList.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
      updateFilteredArray(filtered);
    }

    renderTodos();
  });

  todoText.textContent = todo.text;
  todoDate.textContent = todo.createdAt;

  removeTodoBtn.addEventListener("click", () => {
    const updatedList = todoList.filter((t) => t.id !== todo.id);
    updateTodoList(updatedList);

    if (isFiltered) {
      const query = searchInput.value.toLowerCase().trim();
      const filtered = updatedList.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
      updateFilteredArray(filtered);
    }

    renderTodos();
  });

  if (changeTodoBtn) {
    changeTodoBtn.addEventListener("click", () => {
      const newText = prompt("Введіть новий текст задачі", todo.text);
      if (newText && newText.trim()) {
        const updatedList = todoList.map((t) =>
          t.id === todo.id ? { ...t, text: newText.trim() } : t
        );
        updateTodoList(updatedList);
        renderTodos();
      }
    });
  }

  return todoElement;
};

document.addEventListener("DOMContentLoaded", () => {
  addTodoBtn.addEventListener("click", () => {
    if (addTodoInput.value.trim()) {
      const newTodo = {
        id: Date.now(),
        text: addTodoInput.value.trim(),
        completed: false,
        createdAt: formattedDate(),
      };

      updateTodoList([...todoList, newTodo]);
      addTodoInput.value = "";
      setIsFiltered(false);
      renderTodos();
    }
  });

  clearAllBtn.addEventListener("click", () => {
    updateTodoList([]);
    setIsFiltered(false);
    renderTodos();
  });

  let debounceTimer;

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
      setIsFiltered(false);
      renderTodos();
      return;
    }

    const filtered = todoList.filter((todo) =>
      todo.text.toLowerCase().includes(query)
    );
    updateFilteredArray(filtered);
    setIsFiltered(true);
    renderTodos();
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
      setIsFiltered(false);
      renderTodos();
      return;
    }

    debounceTimer = setTimeout(() => {
      const filtered = todoList.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
      updateFilteredArray(filtered);
      setIsFiltered(true);
      renderTodos();
    }, 500);
  });

  renderTodos();
});
