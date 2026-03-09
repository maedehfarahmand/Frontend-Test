'use client'
import React from 'react';
import styles from './test.module.css';

// Your Test Starts Here


import { useState, useEffect } from "react";


// --- Types ---
type Priority = "Low" | "Medium" | "High";
type FilterStatus = "All" | "Active" | "Completed";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

// --- Helpers ---

// Generate a simple unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Load tasks from localStorage (bonus: persistence)
function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save tasks to localStorage (bonus: persistence)
function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch {
    // silently fail if localStorage is unavailable
  }
}

// Return the CSS class for a priority badge
function badgeClass(priority: Priority, styles: Record<string, string>): string {
  if (priority === "Low") return styles.badgeLow;
  if (priority === "Medium") return styles.badgeMedium;
  return styles.badgeHigh;
}

// --- Main Component ---
export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<Priority>("Medium");
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = useState(""); // bonus: search
  const [titleError, setTitleError] = useState("");

  // Editing state: tracks which task is being edited and its draft values
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("Medium");

  // Load tasks from localStorage on first render (bonus: persistence)
  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  // Persist tasks to localStorage whenever they change (bonus: persistence)
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // --- Add Task ---
  function handleAddTask() {
    const trimmed = titleInput.trim();

    // Validation: title must not be empty or only whitespace
    if (!trimmed) {
      setTitleError("Task title cannot be empty.");
      return;
    }

    const newTask: Task = {
      id: generateId(),
      title: trimmed,
      priority: priorityInput,
      completed: false,
      createdAt: Date.now(),
    };

    // Newest tasks at the top (prepend)
    setTasks((prev) => [newTask, ...prev]);
    setTitleInput("");
    setTitleError("");
  }

  // Allow pressing Enter in the title input to add a task
  function handleTitleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAddTask();
  }

  // --- Toggle Complete ---
  function handleToggleComplete(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // --- Delete Task ---
  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    // Clear editing state if the deleted task was being edited
    if (editingId === id) setEditingId(null);
  }

  // --- Edit Task (bonus) ---
  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  }

  function saveEdit(id: string) {
    const trimmed = editTitle.trim();
    if (!trimmed) return; // do not save empty title
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title: trimmed, priority: editPriority } : t
      )
    );
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  // --- Filtering & Searching ---
  const visibleTasks = tasks
    .filter((t) => {
      if (filter === "Active") return !t.completed;
      if (filter === "Completed") return t.completed;
      return true;
    })
    // bonus: search by title (case-insensitive)
    .filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

  // Separate active from completed so completed tasks always appear below active ones
  const activeTasks = visibleTasks.filter((t) => !t.completed);
  const completedTasks = visibleTasks.filter((t) => t.completed);
  const orderedTasks = [...activeTasks, ...completedTasks];

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Task Manager</h1>
        <p>Stay organised. Get things done.</p>
      </div>

      <div className={styles.card}>
        {/* ===== ADD TASK FORM ===== */}
        <div className={styles.formSection}>
          <div className={styles.formRow}>
            {/* Title input with validation */}
            <div className={styles.titleWrapper}>
              <label htmlFor="task-title" className="sr-only">
                Task title
              </label>
              <input
                id="task-title"
                type="text"
                className={`${styles.input} ${titleError ? styles.inputError : ""}`}
                placeholder="What needs to be done?"
                value={titleInput}
                onChange={(e) => {
                  setTitleInput(e.target.value);
                  // Clear the error as soon as the user starts typing
                  if (titleError) setTitleError("");
                }}
                onKeyDown={handleTitleKeyDown}
                aria-describedby={titleError ? "title-error" : undefined}
                aria-invalid={!!titleError}
              />
              {/* Validation error message */}
              {titleError && (
                <p id="title-error" className={styles.errorMsg} role="alert">
                  {titleError}
                </p>
              )}
            </div>

            {/* Priority selector */}
            <label htmlFor="task-priority" className="sr-only">
              Priority
            </label>
            <select
              id="task-priority"
              className={styles.select}
              value={priorityInput}
              onChange={(e) => setPriorityInput(e.target.value as Priority)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button className={styles.addBtn} onClick={handleAddTask}>
              Add task
            </button>
          </div>
        </div>

        {/* ===== SEARCH & FILTER CONTROLS ===== */}
        <div className={styles.controlsSection}>
          {/* bonus: search field */}
          <label htmlFor="search-tasks" className="sr-only">
            Search tasks
          </label>
          <input
            id="search-tasks"
            type="search"
            className={styles.searchInput}
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filter buttons */}
          <div className={styles.filters} role="group" aria-label="Filter tasks">
            {(["All", "Active", "Completed"] as FilterStatus[]).map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ===== TASK LIST ===== */}
        {orderedTasks.length === 0 ? (
          <p className={styles.emptyState}>
            {tasks.length === 0
              ? "No tasks yet — add one above!"
              : "No tasks match your current filter."}
          </p>
        ) : (
          <ul className={styles.taskList} aria-label="Task list">
            {orderedTasks.map((task) => (
              <li
                key={task.id}
                className={`${styles.taskItem} ${task.completed ? styles.taskCompleted : ""}`}
              >
                {/* Complete checkbox */}
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  aria-label={`Mark "${task.title}" as ${task.completed ? "active" : "complete"}`}
                />

                <div className={styles.taskBody}>
                  {/* bonus: inline edit mode */}
                  {editingId === task.id ? (
                    <div className={styles.editRow}>
                      <input
                        type="text"
                        className={styles.editInput}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        // Save on Enter, cancel on Escape
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(task.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                        aria-label="Edit task title"
                      />
                      <select
                        className={styles.editSelect}
                        value={editPriority}
                        onChange={(e) =>
                          setEditPriority(e.target.value as Priority)
                        }
                        aria-label="Edit priority"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <button
                        className={styles.editSaveBtn}
                        onClick={() => saveEdit(task.id)}
                      >
                        Save
                      </button>
                      <button
                        className={styles.editCancelBtn}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p
                        className={`${styles.taskTitle} ${task.completed ? styles.taskTitleDone : ""}`}
                      >
                        {task.title}
                      </p>
                      <div className={styles.taskMeta}>
                        <span
                          className={`${styles.badge} ${badgeClass(task.priority, styles)}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Edit & Delete actions (hidden while editing this task) */}
                {editingId !== task.id && (
                  <div className={styles.taskActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => startEdit(task)}
                      aria-label={`Edit task: ${task.title}`}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(task.id)}
                      aria-label={`Delete task: ${task.title}`}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* ===== FOOTER: task count summary ===== */}
        {tasks.length > 0 && (
          <div className={styles.footerBar}>
            {completedCount} of {tasks.length} task
            {tasks.length !== 1 ? "s" : ""} completed
          </div>
        )}
      </div>
    </div>
  );
}

