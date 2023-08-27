import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faList } from '@fortawesome/free-solid-svg-icons'; // Added new icons
import './TodoList.css';
import { Todo } from '../types';
import TodoItem from '../TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todo: Todo) => void;
  onDownloadAttachment: (todo: Todo) => void;
  onToggleDone: (todo: Todo) => void;
}

/**
 * Functional component that renders a list of todos.
 * Provides a toggle button to switch between grid view and list view.
 *
 * @component
 * @example
 * const todos = [
 *   { id: 1, title: 'Todo 1', done: false },
 *   { id: 2, title: 'Todo 2', done: true },
 *   { id: 3, title: 'Todo 3', done: false },
 * ];
 *
 * const onDeleteTodo = (todo) => {
 *   // delete todo logic
 * };
 *
 * const onDownloadAttachment = (todo) => {
 *   // download attachment logic
 * };
 *
 * const onToggleDone = (id) => {
 *   // toggle done logic
 * };
 *
 * <TodoList
 *   todos={todos}
 *   onDeleteTodo={onDeleteTodo}
 *   onDownloadAttachment={onDownloadAttachment}
 *   onToggleDone={onToggleDone}
 * />
 */
const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  onDownloadAttachment,
  onToggleDone,
}) => {
  const [isGridView, setIsGridView] = useState(true);
  return (
    <div>
      <div className="filter-buttons">
        <button onClick={() => setIsGridView(true)}>
          <FontAwesomeIcon icon={faThLarge} />
        </button>
        <button onClick={() => setIsGridView(false)}>
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>
      {isGridView ? (
        <div className="todo-grid">
          {todos.length > 0 && todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              onDownloadAttachment={onDownloadAttachment}
              onToggleDone={() => onToggleDone(todo)}
            />
          ))}
        </div>
      ) : (
        <ul className="todo-list">
          {todos.length > 0 && todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              onDownloadAttachment={onDownloadAttachment}
              onToggleDone={() => onToggleDone(todo)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
