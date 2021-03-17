import React, { useEffect } from "react";
import TodoList from "./Todo/TodoList";
import Context from "./context";
import Loader from "./Loader";
import Modal from "./Modal/Modal";

const AddTodo = React.lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(import("./Todo/AddTodo"));
      }, 3000);
    })
);

function App() {
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/list-items")
      .then((response) => response.json())
      .then((todos) => {
        setTimeout(() => {
          setTodos(todos.data);
          setLoading(false);
          console.log(todos);
        }, 2000);
      });
  }, []);

  function toggleTodo(id) {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(newTodos);
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function addTodo(title) {
    // Пример отправки POST запроса:
    async function postData(url = "", data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.

        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },

        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return await response.json(); // parses JSON response into native JavaScript objects
    }

    postData("http://localhost:4000/create-item", {
      name: title,
      done: 0,
    }).then((data) => {
      console.log(data); // JSON data parsed by `response.json()` call
      setTodos(
        todos.concat([
          {
            name: title,
            done: false,
          },
        ])
      );
    });
  }

  return (
    <Context.Provider value={{ removeTodo }}>
      <div className="wrapper">
        <h1>TODOS</h1>
        <Modal />

        <React.Suspense fallback={<p>Loading......</p>}>
          <AddTodo onCreate={addTodo} />
        </React.Suspense>

        {loading && <Loader />}
        {todos.length ? (
          <TodoList todos={todos} onToggle={toggleTodo} />
        ) : loading ? null : (
          <p>No todos!</p>
        )}
      </div>
      {/* <div className="wrapper">
        <h1>TODOS</h1>
        <Modal />

        <React.Suspense fallback={<p>Loading......</p>}>
          <AddTodo onCreate={addTodo} />
        </React.Suspense>

        {loading && <Loader />}
        {todos.length ? (
          <TodoList todos={todos} onToggle={toggleTodo} />
        ) : loading ? null : (
          <p>No todos!</p>
        )}
      </div> */}
    </Context.Provider>
  );
}

export default App;
