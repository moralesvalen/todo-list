import './App.css';
import { useEffect, useState, useReducer, use } from 'react';
import { useCallback } from 'react';
import './App.css';
import styles from './App.module.css';
import Header from './shared/Header';
import {
  reducer as todosReducer,
  actions as todosActions,
  initialState as todosInitialState,
} from './reducers/todos.reducer';
import TodosPage from './pages/TodosPage';
import { useLocation } from 'react-router';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');
  const [pageTitle, setPageTitle] = useState('My Todos');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setPageTitle('Todo List');
    } else if (location.pathname === '/about') {
      setPageTitle('About');
    } else {
      setPageTitle('Not Found');
    }
  }, [location.pathname]);

  //uso de reducer
  const [todoState, dispatch] = useReducer(todosReducer, todosInitialState);
  const { todoList, isLoading, isSaving, errorMessage } = todoState;

  const encodeUrl = useCallback(() => {
    let searchQuery = '';
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    const baseUrl = `https://api.airtable.com/v0/${
      import.meta.env.VITE_BASE_ID
    }/${import.meta.env.VITE_TABLE_NAME}`;

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", {title})`;
    }
    return encodeURI(`${baseUrl}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  const url = encodeUrl();
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const url = encodeUrl();
    const fetchTodos = async () => {
      dispatch({ type: todosActions.fetchTodos });
      try {
        const options = {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        };

        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }

        const data = await resp.json();

        dispatch({ type: todosActions.loadTodos, records: data.records });
      } catch (error) {
        dispatch({ type: todosActions.setLoadError, error });
      } finally {
        //setIsLoading(false);
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    dispatch({ type: todosActions.startRequest });
    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);

      const { records } = await resp.json();

      dispatch({ type: todosActions.addTodo, records });
    } catch (error) {
      dispatch({ type: todosActions.setLoadError, error });
    } finally {
      dispatch({ type: todosActions.endRequest });
    }
  };
  ////inicio completeTodo
  const completeTodo = async (todoId) => {
    const originalTodo = todoState.todoList.find((t) => t.id === todoId);
    if (!originalTodo) return;

    dispatch({ type: todosActions.completeTodo, id: todoId });
    dispatch({ type: todosActions.startRequest });

    // PATCH a Airtable
    const payload = {
      records: [
        {
          id: todoId,
          fields: { title: originalTodo.title, isCompleted: true },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);
    } catch (error) {
      dispatch({
        type: todosActions.revertTodo,
        editedTodo: originalTodo,
        error: new Error(`${error.message}. Reverting todo...`),
      });
    } finally {
      dispatch({ type: todosActions.endRequest });
    }
  };
  ////fin completeTodo

  ///inicio updateTodo
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find((t) => t.id === editedTodo.id);
    dispatch({ type: todosActions.updateTodo, editedTodo });
    dispatch({ type: todosActions.startRequest });
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);
    } catch (error) {
      if (originalTodo) {
        dispatch({
          type: todosActions.revertTodo,
          editedTodo: originalTodo,
          error: new Error(`${error.message}. Reverting todo...`),
        });
      } else {
        dispatch({ type: todosActions.setLoadError, error });
      }
    } finally {
      dispatch({ type: todosActions.endRequest });
    }
  };
  ///fin updateTodo <div className={styles.appContainer}>
  return (
    <>
      <Header className="header">{pageTitle}</Header>

      <div className={styles.appContainer}>
        <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                todoState={todoState}
                addTodo={addTodo}
                completeTodo={completeTodo}
                updateTodo={updateTodo}
                sortField={sortField}
                sortDirection={sortDirection}
                setSortField={setSortField}
                setSortDirection={setSortDirection}
                queryString={queryString}
                setQueryString={setQueryString}
                dispatch={dispatch}
                todosActions={todosActions}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
