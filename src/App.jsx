import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", done: false }, //initial value
    { id: 2, text: "Build a todo", done: false }, // initial value
    { id: 3, text: "Master Tailwind", done: true }, // initial value
  ]);

  const [inputValue, setInputValue] = useState("");

  function handleAddTodo() {
    if (inputValue.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      done: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">My To-Do List</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
          <li key={todo.id} className="py-2 border-b">
            {todo.text}
          </li>
        ))}
      </ul>
    </div>

    /*
        Once you've got this rendering and it makes sense, say so and we'll move to 
        Step 2: adding new to-dos -- which introduces controlled inputs(onChange, value)

     */
  );
}

export default App;
