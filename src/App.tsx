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
      : [];
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null); // null when no item is being edited
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleAddTodo() {
    if (inputValue.trim() === "") return; // Checks if the input field is empty or contains only whitespace do nothing

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
          className="w-96 ml-2 border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FFA6F6] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-md"
          //flex-1 border rounded px-3 py-2 min-w-[12.5px]
        />
        <button
          onClick={handleAddTodo}
          className=" border-black border-2 rounded-md bg-[#FFA6F6] hover:bg-[#fa8cef] active:bg-[#f774ea] w-10 h-10 flex items-center justify-center p-0 shrink-0 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          // bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700
        >
          <svg
            className="block"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8425 24V0H13.1575V24H10.8425ZM0 13.1664V10.8336H24V13.1664H0Z"
              fill="black"
            />
          </svg>
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
                  className="flex-1 border rounded px-2 py-1 min-w-[12.5px]"
                  autoFocus
                />
                {/* <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="ml-2 text-green-600 hover:text-green-800 text-sm"
                >
                  Save
                </button> */}
                {/* Save button*/}
                <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="ml-2 border-black border-2 rounded-md bg-[#B4FFB4] hover:bg-[#88FF88] active:bg-[#5CF75C] w-10 h-10 flex items-center justify-center hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                      fill="#0F0F0F"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="ml-2 text-gray-500 hover:text-gray-700 text-sm"
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
                {/* <button
                  onClick={() => handleStartEdit(todo.id, todo.text)}
                  className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button> */}

                {/*edit button */}
                <button
                  onClick={() => handleStartEdit(todo.id, todo.text)}
                  className="border-black border-2 rounded-md bg-[#A6FAFF] hover:bg-[#79F7FF] active:bg-[#53f2fc] w-10 h-10 flex items-center justify-center p-0
                  hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  <svg
                    className="block"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19.06 3.59L20.41 4.94C21.2 5.72 21.2 6.99 20.41 7.77L7.18 21H3V16.82L13.4 6.41L16.23 3.59C17.01 2.81 18.28 2.81 19.06 3.59ZM5 19L6.41 19.06L16.23 9.23L14.82 7.82L5 17.64V19Z"
                      fill="black"
                    />
                  </svg>
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
