
import { useState } from 'react';

function TaskInput({ onAddTask }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setError('Please enter a task before adding it.');
      return;
    }

    if (trimmedText.length > 150) {
      setError('Task must be 150 characters or fewer.');
      return;
    }

    onAddTask({
      text: trimmedText,
      category,
      priority,
    });

    setText('');
    setCategory('Personal');
    setPriority('medium');
    setError('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="new-task">Task name</label>
        <input
          id="new-task"
          type="text"
          placeholder="What do you need to do?"
          value={text}
          maxLength={150}
          onChange={(event) => {
            setText(event.target.value);
            if (error) setError('');
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'task-error' : undefined}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="task-category">Category</label>
          <select
            id="task-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="form-error" id="task-error" role="alert">
          {error}
        </p>
      )}

      <button className="primary-button add-button" type="submit">
        <span aria-hidden="true">+</span> Add Task
      </button>
    </form>
  );
}

export default TaskInput;
