function TodoForm({ newTodo, setNewTodo, todos, setTodos }) {
  /*funcion que actualiza estado cuando alguien escribe */
  const handleChange = (e) => {
    setNewTodo(e.target.value);
  };

  // funcion que agrega un nuevo todo
  const handleSubmit = (e) => {
    e.preventDefault(); // evita recargar la pagina
    if (newTodo.trim() === '') return; // Prreviene todos vacios

    const newTodoItem = {
      id: todos.length + 1, // Genera un ID único
      title: newTodo.trim(), // Elimina espacios en blanco al inicio y al final
    };
    setTodos([...todos, newTodoItem]); //agraga el nuevo todo al estado
    setNewTodo(''); // Limpia el campo de entrada
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        value={newTodo}
        onChange={handleChange}
        id="todoTitle"
      />
      <button type="submit">Add todo</button>
    </form>
  );
}
export default TodoForm;
