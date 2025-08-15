# initialxy-points App Documentation

## Overview
initialxy-points is a full-stack Nuxt.js application designed to help track points that children earn. The app has separate interfaces for parents and children, with role-based access control.

## Project Structure

### Frontend
- **Framework**: Nuxt 4 (Vue.js)
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
- **Parent**: Can manage children's points
- **Child**: Can view their points

### Main Functionality
1. **User Authentication**: Login system with role-based access control
2. **Points Tracking**: Parents can add or remove points from children's accounts

## Database Schema

### Tables
1. **users**: Stores user information (id, username, password, role, points)
2. **tasks**: Stores tasks for children (id, description, points, child_id, parent_id, task_type, is_marked_complete) - *Note: This feature is planned for future implementation*
3. **rewards**: Stores rewards created by parents (id, description, points, parent_id) - *Note: This feature is planned for future implementation*

## API Endpoints

### Authentication
- `POST /api/auth/login`: Logs in a user
- `POST /api/auth/register`: Registers a new user

### Points Management
- `GET /api/users`: Gets all children users with their points (parent-only)
- `PUT /api/users/{id}/points`: Updates a child's points (parent-only)

### Tasks and Rewards (Planned Features)
- *These endpoints exist in the codebase but are not currently active*
- `GET /api/tasks`: Gets tasks for a child or all tasks for a parent
- `POST /api/tasks`: Creates a new task (parent-only)
- `POST /api/tasks/{id}/mark_complete`: Marks a task as completed (child-only, pending approval)
- `POST /api/tasks/{id}/approve_complete`: Approves a task completion (parent-only)
- `POST /api/tasks/{id}/reject_complete`: Rejects a task completion (parent-only)
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
The application is simplified to focus on core point tracking functionality:
- User authentication with role-based access
- Points tracking and management for children

The app has completed the following tasks:
- Added responsive design for mobile and desktop
- Completed PRD documentation
- Added comprehensive API documentation
- Updated README with usage instructions

The app is now ready for further development and refinement, including:
- Additional UI/UX improvements
- More robust error handling and validation
- Incremental implementation of task management features
- Incremental implementation of reward system features