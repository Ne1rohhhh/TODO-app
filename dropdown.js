import { todoList, updateTodoList, updateFilteredArray, filteredArray, renderTodos, setIsFiltered, isFiltered, } from "./app.js";

const wrapper = document.querySelector(".search-input-wrapper");
const filterBtn = document.querySelector("[data-filter-options-btn]");
const dropdown = document.querySelector("[data-sort-dropdown]");
const items = dropdown.querySelectorAll(".dropdown-item");

filterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  wrapper.classList.toggle("show-dropdown");
});

document.addEventListener("click", () => {
  wrapper.classList.remove("show-dropdown");
});

items.forEach((item) => {
  item.addEventListener("click", () => {
    const sortType = item.dataset.sort;
    sortByOption(sortType);
    wrapper.classList.remove("show-dropdown");
  });
});

function sortByOption(sortParam) {
  switch (sortParam) {
    case "newest":
      if (isFiltered) {
        const sorted = [...filteredArray].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        updateFilteredArray(sorted);
        setIsFiltered(true);
      } else {
        const sorted = [...todoList].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        updateTodoList(sorted);
        setIsFiltered(false);
      }
      break;

    case "oldest":
      if (isFiltered) {
        const sorted = [...filteredArray].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        updateFilteredArray(sorted);
        setIsFiltered(true);
      } else {
        const sorted = [...todoList].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        updateTodoList(sorted);
        setIsFiltered(false);
      }
      break;

    case "completed":
      if (isFiltered) {
        const sorted = [...filteredArray].sort(
          (a, b) => b.completed - a.completed
        );
        updateFilteredArray(sorted);
        setIsFiltered(true);
      } else {
        const sorted = [...todoList].sort(
          (a, b) => b.completed - a.completed
        );
        updateTodoList(sorted);
        setIsFiltered(false);
      }
      break;

    case "not-completed":
      if (isFiltered) {
        const sorted = [...filteredArray].sort(
          (a, b) => a.completed - b.completed
        );
        updateFilteredArray(sorted);
        setIsFiltered(true);
      } else {
        const sorted = [...todoList].sort(
          (a, b) => a.completed - b.completed
        );
        updateTodoList(sorted);
        setIsFiltered(false);
      }
      break;

    default:
      // нічого не сортуємо
      break;
  }

  renderTodos();
}
