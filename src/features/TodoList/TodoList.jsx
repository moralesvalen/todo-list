import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';
{
  /*extract from TodoList.jsx*/
}
function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  if (isLoading) {
    return <p className={styles.loading}>Todo list loading...</p>;
  }
  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  );
  return filteredTodoList.length === 0 ? (
    <p className={styles.empty}>Add todo above to get started</p>
  ) : (
    <ul className={styles.todoList}>
      {filteredTodoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}
export default TodoList;
