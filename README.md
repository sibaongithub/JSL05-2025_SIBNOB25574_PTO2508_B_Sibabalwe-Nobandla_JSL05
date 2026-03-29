# JSL05: Task Board with Local Storage Persistence and Task Creation

## Overview

This project builds on JSL04 by adding **local storage persistence** and a **task creation modal**. Tasks now remain available after refreshing the page, and users can add new tasks directly from the board using the **Add New Task** button.

## What Was Implemented

### Persistent Task Storage & Retrieval

- **Tasks are saved to local storage** every time a new task is added or an existing task is edited.
- On page load, the application **loads tasks from local storage** so the latest task list is always available without re-entering data.
- If no data exists in local storage, the app falls back to the **initial task data**.
- Tasks are placed in the correct columns ("To Do", "Doing", "Done") based on their **status** when loaded.

### Task Creation & Modal Interaction

- Added an **"Add New Task" button** that opens a modal for creating a new task.
- The modal includes:
  - A field for the **task title**.
  - A field for the **task description**.
  - A dropdown to select the **status** ("todo", "doing", "done").
  - A **Create Task** button that adds the task to the board immediately.
- After submitting, the task appears on the board **without requiring a page refresh**.

## Design & Responsiveness

- On **mobile**, the Add Task button displays as a **purple `+` circle** in the top right of the header.
- On **desktop**, it displays as a **`+ Add New Task` pill button** in the top right of the header bar.
- Both buttons open the same **Add New Task modal**, which is fully responsive on all screen sizes.

## Files Updated

- `index.html` — added the Add Task buttons (mobile and desktop) and the Add New Task modal.
- `scripts.js` — added `loadTasksFromLocalStorage()`, `saveTasksToLocalStorage()`, `openAddTaskModal()`, `closeAddTaskModal()`, and `handleAddTaskSubmit()`.

## What Carried Over from JSL04

All existing functionality remains intact — the board columns, task cards, click-to-edit modal, console logs, JSDoc comments, and all utility functions. Nothing was removed.
