
import { useState } from 'react';

function TaskItem({
  task,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [error, setError] = useState('');

  function startEditing() {
    setEditText(task.text);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setError('');
    setIsEditing(true);
  }

  function saveEdit(event) {
    event.preventDefault();
    const trimmedText = editText.trim();

    if (!trimmedText) {
      setError('Task name cannot be empty.');
      return;
    }

    onEditTask(task.id, {
      text: trimmedText,
      category: editCategory,
      priority: editPriority,
    });

    setIsEditing(false);
    setError('');
  }

  function cancelEdit() {
    setEditText(task.text);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setError('');
    setIsEditing(false);
  }

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <form className="edit-form" onSubmit={saveEdit}>
          <label className="visually-hidden" htmlFor={`edit-${task.id}`}>
            Edit task name
          </label>
          <input
            id={`edit-${task.id}`}
            className="edit-task-input"
            value={editText}
            maxLength={150}
            onChange={(event) => setEditText(event.target.value)}
            autoFocus
          />

          <div className="edit-selects">
            <select
              aria-label="Edit category"
              value={editCategory}
              onChange={(event) => setEditCategory(event.target.value)}
            >
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>

            <select
              aria-label="Edit priority"
              value={editPriority}
              onChange={(event) => setEditPriority(event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="task-actions">
            <button className="save-button" type="submit">Save</button>
            <button
              className="cancel-button"
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <label className="task-check">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              aria-label={`Mark ${task.text} ${
                task.completed ? 'pending' : 'completed'
              }`}
            />
            <span className="custom-checkbox" aria-hidden="true" />
          </label>

          <div className="task-content">
            <span className="task-text">{task.text}</span>
            <div className="task-meta">
              <span className="category-badge">{task.category}</span>
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority} priority
              </span>
            </div>
          </div>

          <div className="task-actions">
            <button
              className="edit-button"
              type="button"
              onClick={startEditing}
              disabled={task.completed}
              aria-label={`Edit ${task.text}`}
            >
              Edit
            </button>
            <button
              className="delete-button"
              type="button"
              onClick={() => onDeleteTask(task.id)}
              aria-label={`Delete ${task.text}`}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskItem;
