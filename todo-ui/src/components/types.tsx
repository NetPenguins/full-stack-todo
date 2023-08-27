export interface Todo {
    id?: number;
    title?: string;
    description: string;
    document?: File | null;
    done?: boolean;
    timestamp: string
  }

export interface UpdateTodo {
  title?: string;
  description?: string;
  document?: File | null;
  filename?: string;
  done?: boolean;
}

export function convertToUpdateTodo(todo: Todo): UpdateTodo {
  const updateTodo: UpdateTodo = {
    title: todo.title,
    description: todo.description,
    document: todo.document,
    done: todo.done,
  };
  if (todo.document && todo.document instanceof File) {
    updateTodo.filename = todo.document.name;
  }
  return updateTodo;
}
