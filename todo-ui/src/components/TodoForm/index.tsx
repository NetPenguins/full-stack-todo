// TodoForm.tsx
import React, { useRef, useState } from 'react';
import './TodoForm.css';
import { createTodo } from '../../services/ApiService';
import { Todo } from '../types';
interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
}

/**
 * Functional component representing a form for creating a new todo item.
 * 
 * @param {TodoFormProps} props - The props for the component.
 * @param {Function} props.onAddTodo - The function to add a todo item to the todo list.
 * 
 * @returns {JSX.Element} The rendered form component.
 */
const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [description, setDescription] = useState('');
  
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setAttachment(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const time = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })

      const todo: Todo = {
        title,
        description,
        document: attachment,
        timestamp: time
      }

      await createTodo(todo).then((todo: Todo) => {
        console.log(todo)
        onAddTodo(todo); 
        setTitle('');
        setDescription('');
        setAttachment(null);
      }).catch((error: any) => {
        console.error(error)
      }) 
      // Handle success, reset form fields, update todo list, etc.
    } catch (error) {
      // Handle error, display error message, etc.
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setAttachment(file);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleClickDropZone = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <section className="todo-form-container">
        <form className="todo-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="title">Todo Title:</label>
            <input type="text" id="title" value={title} onChange={handleTitleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" value={description} onChange={handleDescriptionChange} />
        </div>
        <div className="form-group">
            <div
                className="attachment-drop-zone"
                onClick={handleClickDropZone}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
            >
                {attachment ? (
                <div>{attachment.name}</div>
                ) : (
                <div>Drag and drop a file here</div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAttachmentChange}
                    style={{ display: 'none' }}
                    />
            </div>
        </div>
        <button type="submit">Add Todo</button>
        </form>
    </section>
  );
};

export default TodoForm;
