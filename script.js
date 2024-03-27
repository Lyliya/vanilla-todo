const STORAGE_KEY = "todos";
const todos = [];

const randomId = function (length = 6) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

function retrieveTodoFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveTodoToLocalStorage() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      todos.map((todo) => ({
        id: todo.id,
        description: todo.description,
        checked: todo.checked,
      }))
    )
  );
}

function updateTodoList() {
  const storage = retrieveTodoFromLocalStorage();
  const notInStorage = todos.filter((a) => !storage.some((b) => a.id === b.id));

  notInStorage.forEach((todo) => {
    todo.node?.remove?.();
  });

  storage.forEach((todo) => {
    const old = todos.find((e) => e.id === todo.id);
    if (old) {
      const isChecked = old.node.classList.contains("checked");
      if (isChecked !== todo.checked) {
        if (todo.checked && !isChecked) {
          old.node.classList.add("checked");
        } else if (!todo.checked && isChecked) {
          old.node.classList.remove("checked");
        }
      }
    } else {
      createTodo(todo.description, todo.checked, todo.id);
    }
  });
}

class Todo {
  constructor(description, node, id = randomId(), checked = false) {
    this.id = id;
    this.description = description;
    this.checked = checked;
    this.node = node;
  }

  toggleCheck() {
    this.checked = !this.checked;
  }

  updateText(description) {
    this.description = description;
    this.node.innerText = description;
  }
}

function createTodo(description, checked, id) {
  const li = document.createElement("li");
  if (checked) {
    li.classList.add("checked");
  }
  const todo = new Todo(description, li, id, checked);
  todo.updateText(description);
  todos.push(todo);
  li.onclick = () => {
    todo.toggleCheck();
    saveTodoToLocalStorage();
    updateTodoList();
  };
  const todoRoot = document.querySelector("#todos");
  if (todoRoot) {
    todoRoot.appendChild(li);
  }
}

function addTodo() {
  const input = document.querySelector("#todoInput");
  const inputValue = input.value;

  createTodo(inputValue, false);

  saveTodoToLocalStorage();

  input.value = "";
  return false;
}

window.onload = () => {
  updateTodoList();
};
