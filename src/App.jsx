import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { useState } from 'react';

function App() {
  const [newTodo, setNewTodo] = useState('');
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      {/*Instancia de TodoForm  <TodoForm /> */}

      <p>{newTodo}</p>
      {/*Valor del estado */}

      <TodoList />
      {/*Instancia de TodoList  <TodoList /> */}
    </div>
  );
}

export default App;
