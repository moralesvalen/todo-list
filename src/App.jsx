import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useEffect, useState } from 'react';
function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  console.log('Fetching from URL:', url); // verifica que no haya undefined

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
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
        const todos = data.records.map((record) => {
          const todo = {
            id: record.id,
            title: record.fields.title || '',
            isCompleted: record.fields.isCompleted || false,
          };
          return todo;
        });

        setTodoList(todos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

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

    setIsSaving(true);

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (todoId) => {
    // Encuentra el todo original
    const originalTodo = todoList.find((todo) => todo.id === todoId);
    if (!originalTodo) return;

    // Actualiza la UI inmediatamente
    const updatedTodos = todoList.map((todo) =>
      todo.id === todoId ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);

    // Prepara el payload para Airtable
    const payload = {
      records: [
        {
          id: todoId,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
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

    setIsSaving(true);

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
        isCompleted: records[0].fields.isCompleted ?? false,
      };

      const finalTodos = todoList.map((todo) =>
        todo.id === todoId ? savedTodo : todo
      );
      setTodoList(finalTodos);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === todoId ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

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

    setIsSaving(true);

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) savedTodo.isCompleted = false;

      // Actualiza el estado con el todo editado
      setTodoList(
        todoList.map((todo) => (todo.id === savedTodo.id ? savedTodo : todo))
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      // Revertir al estado original en caso de error
      setTodoList(
        todoList.map((todo) =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm
        onAddTodo={addTodo}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
      />
      <TodoList
        isLoading={isLoading}
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
