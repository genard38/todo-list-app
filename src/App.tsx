import { useState } from "react";

/*  interface Todo { ... } functions almost exacly like java interface or a simple POJO's filed
    declaration. it's a compile-time-only contract; it produces zero runtime code
*/

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn React", done: false },
    { id: 2, text: "Build a to-do app", done: false },
    { id: 3, text: "Master Tailwind", done: true },
  ]);
  const [inputValue, setInputValue] = useState<string>("");

  function handleAddTodo() {
    if (inputValue.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      done: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  }

  function handleDeleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function handleToggleDone(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">My To-Do List</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new task..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between py-2 border-b"
          >
            <span
              onClick={() => handleToggleDone(todo.id)}
              className={`cursor-pointer ${
                todo.done ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
