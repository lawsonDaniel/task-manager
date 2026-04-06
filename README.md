# task-manager
# Task Management App

A simple React-based task management application for creating, tracking, and managing tasks with different statuses.

## Features

- **Create Tasks** - Add new tasks with title, description, user ID, and status
- **View Tasks** - Display tasks in a responsive grid layout
- **Filter Tasks** - Filter tasks by status (All, To Do, In Progress, Done)
- **Update Status** - Cycle through task statuses (Todo → In Progress → Done)
- **Delete Tasks** - Remove tasks from the list
- **User-Specific Tasks** - View tasks for different user IDs

## Tech Stack

- React 18+
- TypeScript
- Formik (Form management)
- Yup (Validation)
- Tailwind CSS (Styling)
- Custom Task Service API integration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API service (configured in TaskService)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-app