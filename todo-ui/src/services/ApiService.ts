// apiService.js
import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Todo, convertToUpdateTodo } from '../components/types';

/**
 * Makes a GET request to the `/list/` endpoint of an API and returns the response data.
 * 
 * @returns {Promise<any>} The data received from the API as a result of the GET request.
 * @throws {Error} If an error occurs during the request.
 * 
 * @example
 * const todos = await getAllTodos();
 * console.log(todos);
 */
export const getAllTodos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list/`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new todo item.
 * If the todo item has a document attached, it calls the `createTodoWithAttachment` function to handle the creation with the attachment.
 * Otherwise, it sends a POST request to the API endpoint `/list` with the todo object as the request body.
 * @param todo - The todo object containing the title, description, timestamp, document, and done status.
 * @returns The created todo object returned from the API.
 * @example
 * const todo = {
 *   title: 'Buy groceries',
 *   description: 'Buy milk, eggs, and bread',
 *   timestamp: '2021-10-01T10:00:00.000Z',
 *   document: null,
 *   done: false
 * };
 *
 * const createdTodo = await createTodo(todo);
 * console.log(createdTodo);
 */
export const createTodo = async (todo: Todo) => {
  try {
    if (todo.document){
      return createTodoWithAttachment(todo)
    }
    const response = await axios.post(`${API_BASE_URL}/list`, todo, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new todo item with an attachment.
 * @param {Todo} todo - The todo object containing the title, description, timestamp, and an optional document file.
 * @returns {Promise<object>} - The response data from the server.
 * @throws {Error} - If an error occurs during the request.
 *
 * @example
 * const todo = {
 *   title: 'New Todo',
 *   description: 'This is a new todo item',
 *   timestamp: '2022-01-01T00:00:00Z',
 *   document: file // File object representing the attachment
 * };
 *
 * const response = await createTodoWithAttachment(todo);
 * console.log(response);
 */
export const createTodoWithAttachment = async (todo: Todo) => {
  try {
      const formData = new FormData();
      formData.append('title', todo.title || '');
      formData.append('description', todo.description);
      formData.append('timestamp', todo.timestamp);

      if (todo.document) {
        formData.append('file', todo.document, todo.document.name);
      }

    const response = await axios.post(`${API_BASE_URL}/list/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a todo item from the API.
 * @param todo - The todo item to be deleted.
 * @returns The deleted todo item.
 * @throws If an error occurs during the request.
 */
export const deleteTodo = async (todo: Todo) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/list/?id=${todo.id}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Downloads a file associated with a todo item from the API.
 * @param todo - The todo item to download the file from.
 * @returns The downloaded file.
 * @throws If an error occurs during the request.
 */
export const downloadFile = async (todo: Todo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list/file/${todo.id}`, {
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


/**
 * Downloads a file associated with a todo item from the API.
 * @param todo - The todo item to download the file from.
 * @returns The downloaded file.
 * @throws If an error occurs during the request.
 */
export const updateTodo = async (todo: Todo, remove_file: boolean = false) => {
  try {
    var updatedTodo = convertToUpdateTodo(todo)
    updatedTodo.done = !updatedTodo.done
    const response = await axios.put(`${API_BASE_URL}/list/?id=${todo.id}&remove_file=${remove_file}`, updatedTodo);

    return response.data;
  } catch (error) {
    throw error;
  }
};
