import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      {/*Instancia de TodoForm  <TodoForm /> */}
      <TodoList />
      {/*Instancia de TodoList  <TodoList /> */}
    </div>
  );
}

export default App;
