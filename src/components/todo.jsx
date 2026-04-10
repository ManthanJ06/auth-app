import React, { useState, useEffect } from "react";

const Todo = () => {
  const [form, setForm] = useState({ todo: "" });
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔥 FETCH TASKS FROM BACKEND
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks", {
      credentials: "include",
    });

    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK
  const handleAdd = async () => {
    if (!form.todo.trim()) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title: form.todo }),
    });

    const newTask = await res.json();

    setTodos([...todos, newTask]);
    setForm({ todo: "" });
  };

  // DELETE TASK
  const handleRemove = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  };

  // EDIT START
  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.title);
  };

  // SAVE EDIT (frontend only for now)
  const handleSave = (id) => {
    if (!editText.trim()) return;

    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, title: editText } : todo,
      ),
    );

    setEditingId(null);
    setEditText("");
  };

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
        onChange={(e) => setForm({ todo: e.target.value })}
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
            key={todo._id}
            className="flex items-center justify-between p-2 rounded bg-zinc-700"
          >
            {editingId === todo._id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 mr-2 px-2 py-1 text-black rounded"
              />
            ) : (
              <span className="flex-1">{todo.title}</span>
            )}

            {editingId === todo._id ? (
              <button
                className="px-2 py-1 bg-green-400 text-black rounded text-sm mr-1"
                onClick={() => handleSave(todo._id)}
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
              onClick={() => handleRemove(todo._id)}
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
