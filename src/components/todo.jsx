import React, { useState, useEffect } from "react";

const Todo = () => {
  const [form, setForm] = useState({ todo: "" });

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleTodoChange = (e) => {
    setForm({ ...form, todo: e.target.value });
  };

  const handleAdd = () => {
    if (!form.todo.trim()) return;

    setTodos([...todos, { id: Date.now(), text: form.todo }]);
    setForm({ todo: "" });
  };

  const handleRemove = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSave = (id) => {
    if (!editText.trim()) return;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo,
      ),
    );

    setEditingId(null);
    setEditText("");
  };

  // ✅ RETURN MUST BE INSIDE FUNCTION
  return (
    <div
      className="flex flex-col p-4 text-white rounded-lg mt-4 bg-zinc-600 shadow-lg"
      style={{ width: "480px", height: "550px" }}
    >
      <label className="mb-2 font-semibold text-lg text-zinc-200">
        What To Do...
      </label>

      <input
        type="text"
        value={form.todo}
        onChange={handleTodoChange}
        className="mb-3 h-9 border border-zinc-400 px-2 rounded text-black"
        placeholder="Enter a task..."
      />

      <button
        className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700"
        onClick={handleAdd}
      >
        Add
      </button>

      <div className="flex-1 w-full mt-4 p-2 overflow-auto space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-2 rounded bg-zinc-700"
          >
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 mr-2 px-2 py-1 text-black rounded"
              />
            ) : (
              <span className="flex-1">{todo.text}</span>
            )}

            {editingId === todo.id ? (
              <button
                className="px-2 py-1 bg-green-400 text-black rounded text-sm mr-1"
                onClick={() => handleSave(todo.id)}
              >
                Save
              </button>
            ) : (
              <button
                className="px-2 py-1 bg-blue-400 text-black rounded text-sm mr-1"
                onClick={() => handleEdit(todo)}
              >
                Edit
              </button>
            )}

            <button
              className="px-2 py-1 bg-red-400 text-black rounded text-sm"
              onClick={() => handleRemove(todo.id)}
            >
              Done
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
