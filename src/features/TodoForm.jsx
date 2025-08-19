import { useRef } from 'react';
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();

    // Accede al valor del input a través de la referencia
    // const title = todoTitleInput.current.value.trim();

    if (workingTodoTitle.trim() === '') {
      return;
    }

    onAddTodo(workingTodoTitle);

    // Limpia el input y vuelve a enfocarlo usando la referencia
    setWorkingTodoTitle('');
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        name="title"
        type="text"
        id="todoTitle"
        //ref={todoTitleInput}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ''}>
        Add todo
      </button>
    </form>
  );
}

export default TodoForm;
