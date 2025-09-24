import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useEffect, useState, useReducer } from 'react';
import TodosViewForm from './features/TodosViewForm';
import { useCallback } from 'react';
import './App.css';
import styles from './App.module.css';
import HeaderTitle from './shared/HeaderTitle';
import {
  reducer as todosReducer,
  actions as todosActions,
  initialState as todosInitialState,
} from './reducers/todos.reducer';

function App() {
  /* antes de reducer
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
*/
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

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
      // antes:      setIsLoading(true);
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
        /*
        const todos = data.records.map((record) => {
          const todo = {
            id: record.id,
            title: record.fields.title || '',
            isCompleted: record.fields.isCompleted || false,
          };
          return todo;
        });*/

        //antes: setTodoList(todos);
        dispatch({ type: todosActions.loadTodos, records: data.records });
      } catch (error) {
        //antes:  setErrorMessage(error.message);
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

    //antes:  setIsSaving(true);

    dispatch({ type: todosActions.startRequest });
    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);

      const { records } = await resp.json();
      /*
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
     

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }*/
      dispatch({ type: todosActions.addTodo, records });
      // antes:  setTodoList([...todoList, savedTodo]);
      // dispatch({ type: todosActions.addTodo, record: savedTodo });
    } catch (error) {
      // antes: setErrorMessage(error.message);
      dispatch({ type: todosActions.setLoadError, error });
    } finally {
      // antes: setIsSaving(false);

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
      /*
      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        title: records[0].fields?.title ?? '',
        isCompleted: records[0].fields?.isCompleted ?? false,
      };

      dispatch({ type: todosActions.updateTodo, editedTodo: savedTodo });*/
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

    //antes: setIsSaving(true);
    //    dispatch({ type: todosActions.startRequest });
    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);
      /*
      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
        isCompleted: records[0].fields.isCompleted ?? false,
      };

      dispatch({ type: todosActions.updateTodo, editedTodo: savedTodo });*/
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
  ///fin updateTodo
  return (
    <>
      <HeaderTitle className="header" />

      <div className={styles.appContainer}>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
        <hr />

        <TodoList
          isLoading={todoState.isLoading}
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
        />
        <hr />
        <TodosViewForm
          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
          queryString={queryString}
          setQueryString={setQueryString}
        />
        {todoState.errorMessage && (
          <div>
            <hr />
            <p>{todoState.errorMessage}</p>
            <button onClick={() => dispatch({ type: todosActions.clearError })}>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
