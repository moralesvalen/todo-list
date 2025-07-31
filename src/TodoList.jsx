import TodoListItem from './TodoListItem';
{
  /*extract from TodoList.jsx*/
}
function TodoList({todos}) {
 /* const todos = [
    { id: 1, title: 'Review resources' },
    { id: 2, title: 'Takes Notes' },
    { id: 3, title: 'Code out app' },
  ];lo pasaremos desde app.jsx*/
  return (
    <ul>
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
export default TodoList;
