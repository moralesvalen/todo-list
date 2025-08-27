import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving, setIsSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();

    if (workingTodoTitle.trim() === '') {
      return;
    }

    // Envía un objeto con title e isCompleted
    onAddTodo({
      title: workingTodoTitle.trim(),
      isCompleted: false,
    });

    // Limpia el input
    setWorkingTodoTitle('');
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      />

      <button disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
