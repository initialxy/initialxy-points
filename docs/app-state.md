# initialxy-points App Documentation

## Overview
initialxy-points is a full-stack Nuxt.js application designed to help track points that children earn and redeem them for rewards. The app has separate interfaces for parents and children, with role-based access control.

## Project Structure

### Frontend
- **Framework**: Nuxt.js (Vue.js)
- **State Management**: Pinia
- **Routing**: Vue Router

### Backend
- **API Framework**: Nitro (Nuxt's server framework)
- **Database**: SQLite
- **Authentication**: JWT-based with bcrypt for password hashing

### Key Directories
- `components/`: Vue components
- `pages/`: Vue pages/routes
- `server/api/`: API endpoints
- `server/database/`: Database setup and migrations
- `stores/`: Pinia stores

## Features

### User Roles
- **Parent**: Can create rewards, view and manage their children's tasks
- **Child**: Can view their tasks, complete tasks to earn points

### Main Functionality
1. **User Authentication**: Login system with role-based access control
2. **Task Management**:
   - Parents can create tasks (throw-away or perpetual) for children
   - Children can view tasks and mark them as completed (pending parent approval)
   - Parents can approve or reject completed tasks
   - Throw-away tasks are deleted after approval, perpetual tasks remain for future completion
3. **Reward System**: Parents can create rewards

## Database Schema

### Tables
1. **users**: Stores user information (id, username, passcode, role, points)
2. **tasks**: Stores tasks for children (id, description, points, child_id, parent_id, task_type, is_marked_complete)
3. **rewards**: Stores rewards created by parents (id, description, points, parent_id)

## API Endpoints

### Authentication
- `POST /api/auth/login`: Logs in a user
- `POST /api/auth/register`: Registers a new user

### Tasks
- `GET /api/tasks`: Gets tasks for a child or all tasks for a parent
- `POST /api/tasks`: Creates a new task (parent-only)
- `POST /api/tasks/{id}/mark_complete`: Marks a task as completed (child-only, pending approval)
- `POST /api/tasks/{id}/approve_complete`: Approves a task completion (parent-only)
- `POST /api/tasks/{id}/reject_complete`: Rejects a task completion (parent-only)

### Rewards
- `GET /api/rewards`: Gets rewards for a parent
- `POST /api/rewards`: Creates a new reward (parent-only)

## Setup and Development

### Prerequisites
- Node.js (with npm, pnpm, yarn, or bun)
- SQLite

### Installation
```bash
# Install dependencies
npm install
```

### Running the Development Server
```bash
# Start the development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Current State
The application is functional with the core features implemented:
- User authentication with role-based access
- Task management system for children with parent approval
- Reward creation and management for parents

The app has completed the following tasks:
- Added responsive design for mobile and desktop
- Completed PRD documentation
- Added comprehensive API documentation
- Updated README with usage instructions

The app is now ready for further development and refinement, including:
- Additional UI/UX improvements
- More robust error handling and validation