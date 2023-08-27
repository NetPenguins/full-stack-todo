import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faFileDownload, faShare } from '@fortawesome/free-solid-svg-icons';
import './TodoItem.css';
import { Todo } from '../types';
import { shareContent } from '../../services/shareContent';

interface TodoItemProps {
  todo: Todo;
  onDeleteTodo: (todo: Todo) => void;
  onDownloadAttachment: (todo: Todo) => void;
  onToggleDone: (todo: Todo) => void;
}

/**
 * Renders a single todo item.
 *
 * @component
 * @example
 * const todo = {
 *   id: 1,
 *   title: 'Example Todo',
 *   description: 'This is an example todo',
 *   done: false,
 *   timestamp: '2021-01-01',
 *   document: null,
 * };
 *
 * const onDeleteTodo = (todo) => {
 *   // delete the todo
 * };
 *
 * const onDownloadAttachment = (todo) => {
 *   // download the attachment for the todo
 * };
 *
 * const onToggleDone = (id) => {
 *   // toggle the done status of the todo
 * };
 *
 * <TodoItem
 *   todo={todo}
 *   onDeleteTodo={onDeleteTodo}
 *   onDownloadAttachment={onDownloadAttachment}
 *   onToggleDone={onToggleDone}
 * />
 */
const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDeleteTodo,
  onDownloadAttachment,
  onToggleDone,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleShare = () => {
    const title = 'Share Todo';
    const text = `Check out this todo: ${todo.title}`;
    const url = window.location.href;

    shareContent(title, text, url);
  };

  return (
    <div className={`todo-post ${expanded ? 'expanded' : ''}`}>
      <div className="todo-checkbox-container">
        <label className="todo-checkbox">
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => onToggleDone(todo)}
          />
          <span>{todo.done ? '✓' : ''}</span>
        </label>
      </div>
      <div className={`todo-content ${expanded ? 'expanded' : ''}`}>
        {todo.title && <h3>{todo.title}</h3>}
        <p>{todo.description}</p>
        {todo.description.length > 100 && (
          <button className="expand-button" onClick={toggleExpand}>
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      <div className="todo-timestamp">
        {todo.timestamp}
      </div>
      <div className="todo-icons">
        <button className="todo-share-button" onClick={handleShare}>
          <FontAwesomeIcon icon={faShare} />
        </button>
        {todo.document && (
          <button
            className="todo-download-button"
            onClick={() => onDownloadAttachment(todo)}
          >
            <FontAwesomeIcon icon={faFileDownload} />
          </button>
        )}
        <button
          className="todo-delete-button"
          onClick={() => onDeleteTodo(todo)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
