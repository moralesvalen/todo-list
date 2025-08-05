import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { useState } from 'react';

function App() {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, title: 'Review resources' },
    { id: 2, title: 'Takes Notes' },
    { id: 3, title: 'Code out app' },
  ]);
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        todos={todos}
        setTodos={setTodos}
      />
      {/*Instancia de TodoForm  <TodoForm /> sending state to todoForm*/}

      <p>{newTodo}</p>
      {/*Valor del estado */}

      <TodoList todos={todos} />
      {/*Instancia de TodoList  <TodoList /> */}
    </div>
  );
}

export default App;
