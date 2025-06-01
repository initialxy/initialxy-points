# initialxy-points PRD

## 1. Project Overview
- **Project Name:** initialxy-points
- **Project Description:** A simple web app that helps track points earned by kids and allows them to redeem points for rewards.
- **Target Audience:** Parents and kids
- **Project Goals:**
  - Implement a passcode-based authentication system
  - Create a system for parents to assign tasks and rewards
  - Allow kids to submit reward wishlists and redeem points
  - Provide visibility of points for both parents and kids

## 2. Features
### 2.1 Core Features
- [x] Passcode-based authentication for parents and kids
- [x] Two types of users: parents (admins) and kids
- [x] Parents can create tasks and define points for completion
- [x] Parents can define rewards and their point values
- [x] Kids can submit reward wishlists visible to parents
- [x] Parents can approve/reject reward wishlist items
- [x] Kids can redeem rewards with points (requires parent approval)
- [x] Points visibility for parents and kids

### 2.2 Additional Features
- [x] Notifications for task completion and reward redemption
- [x] Points history and activity log

## 3. User Stories
### 3.1 Parent User Stories
- As a parent, I want to create tasks for my kids so that they can earn points.
- As a parent, I want to define rewards and their point values so that my kids know what they can earn.
- As a parent, I want to approve or reject my kids' reward wishlist items so that I can control what rewards they get.
- As a parent, I want to see all kids' points so that I can track their progress.

### 3.2 Kid User Stories
- As a kid, I want to see my tasks and earn points by completing them.
- As a kid, I want to submit a wishlist of rewards I'd like to have.
- As a kid, I want to see my points so that I know how many rewards I can get.
- As a kid, I want to redeem points for rewards and get parent approval.

## 4. Technical Requirements
### 4.1 Tech Stack
- Frontend: Vue.js with Nuxt.js framework
  - Modules: nuxt/fonts, nuxt/icon, nuxt/ui
- State Management: Pinia
- Backend: Nuxt.js (full-stack mode)
- Database: SQLite
- TypeScript: Full TypeScript safety

### 4.2 API Endpoints
- [x] POST /api/auth/login (Passcode authentication)
- [x] GET /api/tasks (Get tasks for kids)
- [x] POST /api/tasks (Create tasks for kids)
- [x] GET /api/rewards (Get available rewards)
- [x] POST /api/rewards (Create rewards)
- [x] GET /api/wishlist (Get kids' wishlist)
- [x] POST /api/wishlist (Submit wishlist items)
- [x] POST /api/redeem (Redeem points for rewards)
- [x] GET /api/points (Get points for all kids)

## 5. Design Requirements
### 5.1 UI/UX Design
- [x] Simple and intuitive user interface
- [x] Responsive design for mobile and desktop
- [x] Clear visibility of points and tasks

### 5.2 Branding
- [x] Simple and kid-friendly color scheme
- [x] Appropriate icons and graphics

## 6. Success Metrics
- [x] User satisfaction with the app
- [x] Ease of use for both parents and kids
- [x] Number of tasks completed and rewards redeemed

## 7. Timeline
- [x] Phase 1: Research & Planning (1 week)
- [x] Phase 2: Development (4 weeks)
- [x] Phase 3: Testing (1 week)
- [x] Phase 4: Deployment (1 week)

## 8. Risks & Challenges
- [x] Ensuring security with passcode-based authentication
- [x] Making the app intuitive for kids to use
- [x] Handling edge cases in points and rewards management

## 9. Appendices
- [x] Database schema
- [x] API documentation (see docs/api.md)