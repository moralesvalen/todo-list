export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

export const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:

    case actions.loadTodos: {
      // action.records viene directo del fetch
      const todos = (action.records || []).map((record) => ({
        id: record.id,
        title: record.fields?.title ?? '',
        isCompleted: !!record.fields?.isCompleted,
      }));
      return {
        ...state,
        todoList: todos,
        isLoading: false,
      };
    }

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };

    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.endRequest:
      return { ...state, isSaving: false, isLoading: false };

    case actions.addTodo: {
      const records = action.records;
      if (!records || !records[0]) return state;

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.completeTodo: {
      const id = action.id;
      const updatedTodos = state.todoList.map((t) =>
        t.id === id ? { ...t, isCompleted: true } : t
      );
      return { ...state, todoList: updatedTodos };
    }

    case actions.revertTodo:
    case actions.updateTodo: {
      const edited = action.editedTodo;

      const updatedTodos = state.todoList.map((t) =>
        t.id === edited.id ? edited : t
      );

      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return updatedState;
    }

    case actions.clearError:
      return { ...state, errorMessage: '' };

    default:
      return state;
  }
}
