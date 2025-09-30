import TodoList from '../features/TodoList/TodoList';
import TodoForm from '../features/TodoForm';
import TodosViewForm from '../features/TodosViewForm';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import React, { useEffect } from 'react';
import '../App';

const TodosPage = ({
  todoState,
  addTodo,
  completeTodo,
  updateTodo,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  queryString,
  setQueryString,
  dispatch,
  todosActions,
}) => {
  const { todoList, isLoading, isSaving, errorMessage } = todoState;
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const itemsPerPage = 5;

  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  function handlePreviousPage() {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  }

  useEffect(() => {
    if (totalPages > 0 && !isLoading) {
      if (currentPage < 1 || currentPage > totalPages || isNaN(currentPage)) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate, isLoading]);

  return (
    <div>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <hr />
      <TodoList
        isLoading={isLoading}
        todoList={currentTodos}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
      <hr />
      <div className="paginationControl">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Next
        </button>
      </div>
      <TodosViewForm
        sortField={sortField}
        sortDirection={sortDirection}
        setSortField={setSortField}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => dispatch({ type: todosActions.clearError })}>
            Dismiss
          </button>
        </div>
      )}
      ;
    </div>
  );
};

export default TodosPage;
