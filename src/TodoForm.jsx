import { useRef } from 'react';
function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  /*funcion que actualiza estado cuando alguien escribe */

  function handleAddTodo(event) {
    event.preventDefault();
    const title = event.target.title.value.trim();
    if (title === '') return;

    onAddTodo(title);
    /*limpiamos el input y volvemos a enfocar*/
    event.target.title.value = '';
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input name="title" type="text" id="todoTitle" ref={todoTitleInput} />
      <button type="submit">Add todo</button>
    </form>
  );
}
export default TodoForm;
