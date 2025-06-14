export const saveTodosIntoLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
}

export const getTodosFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("todos")) || [];
}

export const formattedDate = () => new Date().toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});
