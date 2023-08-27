// App.tsx
import React, { useEffect, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { Todo } from './components/types';
import './App.css'
import { deleteTodo, downloadFile, getAllTodos, updateTodo } from './services/ApiService';
const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    // Fetch all todos and update the state
    const fetchTodos = async () => {
      try {
        const allTodos = await getAllTodos(); // Implement getAllTodos using your API service
        console.log(allTodos)
        setTodos(allTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  const handleDeleteTodo = (todo: Todo) => {
    deleteTodo(todo)
    const updatedTodos = todos.filter(t => t.id !== todo.id);
    setTodos(updatedTodos);
  };

  // const handleDownloadAttachment = (attachment: File) => {
    const handleDownloadAttachment = async (todo: Todo) => {
      try {
        const fileBlob = await downloadFile(todo);
        const url = window.URL.createObjectURL(new Blob([fileBlob]));
  
        const link = document.createElement('a');
        link.href = url;
        console.log(todo)
        link.setAttribute('download', todo.document?.name || ''); // Set the desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };

  const handleToggleDone = (item: Todo) => {
    const updatedTodo = {...item, done: !item.done}
    updateTodo(item)
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className='app-container'>
      <h1 style={{textAlign: 'center'}}>To-Done</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList todos={todos} onDeleteTodo={handleDeleteTodo} onDownloadAttachment={handleDownloadAttachment} onToggleDone={handleToggleDone}/>
    </div>
  );
};

export default App;
