import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0.1rem;
`;

const StyledButton = styled.button`
  &:disabled {
    font-style: italic;
  }
`;
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
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText="Todo: "
      />

      <StyledButton disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
