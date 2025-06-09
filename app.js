import {saveTodosIntoLocalStorage, getTodosFromLocalStorage, formattedDate} from "./utils.js";

const addTodoInput = document.querySelector("[data-add-todo-input]");
const addTodoBtn = document.querySelector("[data-add-todo-button]");
const todosContainer = document.querySelector("[data-todo-container]");
const todoTemplate = document.querySelector("[data-todo-template]");

let todoList = getTodosFromLocalStorage();
console.log(todoList);

addTodoBtn.addEventListener("click", () => {
    if (addTodoInput.value.trim()) {
        const newTodo = {
            id: Date.now(),
            text: addTodoInput.value.trim(),
            completed: false,
            createdAt: formattedDate
        };

        todoList.push(newTodo);
        addTodoInput.value = "";
        saveTodosIntoLocalStorage(todoList);
        renderTodos();
    }
});

const createTodoLayout = (todo) => {
    const todoElement = document.importNode(todoTemplate.content, true);

    const checkbox = todoElement.querySelector("[data-todo-checkbox]");
    checkbox.checked = todo.completed;

    checkbox.addEventListener("change", (e) => {
        todoList = todoList.map(t => {
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

    const removeTodoBtn = todoElement.querySelector("[data-remove-todo-btn]");
    // removeTodoBtn.disabled = !todo.completed;

    removeTodoBtn.addEventListener("click", () => {
        todoList = todoList.filter(t => t.id !== todo.id);
        saveTodosIntoLocalStorage(todoList);
        renderTodos();
    })

    return todoElement;
};

const renderTodos = () => {
    todosContainer.innerHTML = "";
    if (todoList.length === 0) {
        todosContainer.innerHTML = "<h2>No tasks...</h2>";
        saveTodosIntoLocalStorage(todoList);
        return;
    }

    todoList.forEach((todo) => {
        const todoElement = createTodoLayout(todo);
        todosContainer.append(todoElement);
    });
};

renderTodos();