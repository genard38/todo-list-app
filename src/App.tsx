import { useState, useEffect } from "react";

/*  interface Todo { ... } functions almost exacly like java interface or a simple POJO's filed
    declaration. it's a compile-time-only contract; it produces zero runtime code
*/

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// useState is a React hook that manages state in a component
// Todo[] tells TypeScript that todos is an array of Todo objects.
// the setTodos function is used later to update that array.

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved
      ? JSON.parse(saved) //converts the string back into a JavaScript array of objects
      : [
          // if nothing was saved, used the default starte list:
          { id: 1, text: "Learn React", done: false },
          { id: 2, text: "Build a to-do app", done: false },
          { id: 3, text: "Master Tailwind", done: false },
        ];
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleAddTodo() {
    if (inputValue.trim() === "") return; // Checks if the input field is empty or contains only whitespace do nothing

    // Creates a new todo object that matches the Todo interface
    // id: Uses current timestamp (Date.now()) for a unique identifier)
    // text: Takes the current value from the input field
    // done: Sets to false (new tasks start as incomplete)
    const newTodo: Todo = {
      // create a new Todo Object
      id: Date.now(),
      text: inputValue,
      done: false,
    };

    // Update State
    // Uses the spread operator(...) to create a new array containing:
    // All existing todos (...todos)
    // The new todo object appended at the end
    // React will re-render the component with the updated
    setTodos([...todos, newTodo]); // Calls setTodos to update the component's state
    setInputValue("");
  }

  function handleDeleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // toggles the done status of a specific to-do time in the component's state.
  // Receives an id(the unique identifier of the to-do whose completion state should be flipped).
  // Updates the todos state array so that the to-do with the matching id has its done boolean
  // inverted (true -> false or false -> true)
  function handleToggleDone(id: number) {
    setTodos(
      todos.map(
        (todo) =>
          // we then override the done property with its logical opposite (!todo.done)
          todo.id === id ? { ...todo, done: !todo.done } : todo,
        // if the id's do not match, we simply return the original todo unchanged
      ),
    );
  }

  function handleStartEdit(id: number, currentText: string) {
    setEditingId(id);
    setEditText(currentText);
  }

  function handleSaveEdit(id: number) {
    if (editText.trim() === "") return;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo,
      ),
    );
    setEditingId(null);
    setEditText("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value); // (e.target.value) and updates the component's state via the setInputValue
  }

  function handleEditInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditText(e.target.value);
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
            className="flex items-center justify-between py-2 border-b" // horizontal line
          >
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={handleEditInputChange}
                  className="flex-1 border rounded px-2 py-1"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  onClick={() => handleToggleDone(todo.id)}
                  className={`cursor-pointer flex-1 ${
                    todo.done ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleStartEdit(todo.id, todo.text)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
