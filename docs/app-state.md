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
- `src/components/`: Vue components
- `src/pages/`: Vue pages/routes
- `src/server/api/`: API endpoints
- `src/server/database/`: Database setup and migrations
- `src/store/`: Pinia stores

## Features

### User Roles
- **Parent**: Can create rewards, view and manage their children's tasks and wishlists
- **Child**: Can view their tasks, complete tasks to earn points, and add rewards to their wishlist

### Main Functionality
1. **User Authentication**: Login system with role-based access control
2. **Task Management**: Children can view and complete tasks to earn points
3. **Reward System**: Parents can create rewards, children can add rewards to their wishlist
4. **Wishlist**: Children can add rewards to their wishlist, parents can approve them

## Database Schema

### Tables
1. **users**: Stores user information (id, username, passcode, role, points)
2. **tasks**: Stores tasks for children (id, title, description, points, child_id, completed)
3. **rewards**: Stores rewards created by parents (id, title, description, points, parent_id)
4. **wishlist**: Stores children's wishlist items (id, reward_id, child_id, approved)

## API Endpoints

### Authentication
- `POST /api/auth/login`: Logs in a user
- `POST /api/auth/register`: Registers a new user

### Tasks
- `GET /api/tasks`: Gets tasks for a child
- `POST /api/tasks/{id}/complete`: Marks a task as completed

### Rewards
- `GET /api/rewards`: Gets rewards for a parent
- `POST /api/rewards`: Creates a new reward

### Wishlist
- `GET /api/wishlist`: Gets wishlist items for a child
- `POST /api/wishlist`: Adds a reward to a child's wishlist

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
- Task management system for children
- Reward creation and management for parents
- Wishlist functionality for children to request rewards

The app has completed the following tasks:
- Implemented notifications for task completion and wishlist updates
- Added responsive design for mobile and desktop
- Completed PRD documentation
- Added comprehensive API documentation
- Updated README with usage instructions

The app is now ready for further development and refinement, including:
- Additional UI/UX improvements
- More robust error handling and validation