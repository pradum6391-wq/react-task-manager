
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

const STORAGE_KEY = 'react-task-manager-tasks';

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('Unable to load tasks:', error);
    return [];
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Unable to save tasks:', error);
    }
  }, [tasks]);

  function addTask(taskData) {
    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: taskData.text,
      category: taskData.category,
      priority: taskData.priority,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  }

  function editTask(id, updatedData) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text: updatedData.text,
              category: updatedData.category,
              priority: updatedData.priority,
            }
          : task
      )
    );
  }

  function clearCompleted() {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => !task.completed)
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const visibleTasks = useMemo(() => {
    let result = [...tasks];

    if (filter === 'pending') {
      result = result.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      result = result.filter((task) => task.completed);
    }

    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((task) =>
        `${task.text} ${task.category} ${task.priority}`
          .toLowerCase()
          .includes(searchText)
      );
    }

    if (sortBy === 'oldest') {
      result.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      result.sort(
        (a, b) =>
          priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [tasks, filter, search, sortBy]);

  return (
    <main className="app">
      <header className="app-header">
        <div className="brand-icon" aria-hidden="true">✓</div>
        <p className="eyebrow">STAY FOCUSED · GET THINGS DONE</p>
        <h1>Task Manager</h1>
        <p className="subtitle">
          Organize your day, one task at a time.
        </p>
      </header>

      <section className="stats" aria-label="Task summary">
        <article className="stat-card">
          <span className="stat-label">Total tasks</span>
          <strong>{totalTasks}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Pending</span>
          <strong>{pendingTasks}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Completed</span>
          <strong>{completedTasks}</strong>
        </article>
      </section>

      <section className="progress-section" aria-label="Task progress">
        <div className="progress-heading">
          <span>Daily progress</span>
          <strong>{progress}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Completed tasks percentage"
        >
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">Add a new task</h2>
        <TaskInput onAddTask={addTask} />
      </section>

      <section className="panel task-panel">
        <div className="task-heading">
          <div>
            <h2 className="section-title">Your tasks</h2>
            <p className="muted">
              {visibleTasks.length} task
              {visibleTasks.length === 1 ? '' : 's'} shown
            </p>
          </div>

          {completedTasks > 0 && (
            <button
              type="button"
              className="text-button"
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          )}
        </div>

        <label className="search-label" htmlFor="task-search">
          Search tasks
        </label>
        <input
          id="task-search"
          className="search-input"
          type="search"
          placeholder="Search by task, category or priority..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="toolbar">
          <div className="filter-group" aria-label="Filter tasks">
            {[
              ['all', 'All'],
              ['pending', 'Pending'],
              ['completed', 'Completed'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`filter-button ${
                  filter === value ? 'active' : ''
                }`}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="sort-control">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort tasks"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="alphabetical">A–Z</option>
              <option value="priority">Priority</option>
            </select>
          </label>
        </div>

        <TaskList
          tasks={visibleTasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
        />
      </section>

      <footer className="app-footer">
        <p>Built with React · Your tasks stay saved on this device.</p>
      </footer>
    </main>
  );
}

export default App;
