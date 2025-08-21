# initialxy-points PRD

## 1. Project Overview
- **Project Name:** initialxy-points
- **Project Description:** A simple web app that helps track points earned by children and allows them to redeem points for rewards.
- **Target Audience:** Parents and children
- **Project Goals:**
  - Implement a password-based authentication system
  - Create a system for parents to assign tasks and rewards
  - Provide visibility of points for both parents and children

## 2. Features

### 2.1 Core Features
- [x] Passcode-based authentication for parents and children
- [x] Two types of users: parents (admins) and children
- [x] Parents can create tasks (single-use or perpetual) and define points for completion
- [x] Parents can create rewards (single-use or perpetual) and define points for redemption
- [x] Children can mark a task as completed
- [x] Any parent can approve or reject task completions. When approved, points for the task will be added to the child
- [x] Children can redeem rewards with points
- [x] Any parent can approve or reject reward redemptions. When approved, points for the reward will be deducted from the child
- [x] Children's points can be manually added or deducted by any parent
- [x] Points visibility for parents and children

### 2.2 Additional Features
- [ ] Notifications for task completion and reward redemption
- [x] Points history and activity log

## 3. User Stories

### 3.1 Parent User Stories
- As a parent, I want to create tasks for my children so that they can earn points.
- As a parent, I want to define rewards and their point values so that my children know what they can earn.
- As a parent, I want to see all children's points so that I can track their progress.
- As a parent, I can manually add or deduct my children's points
- As a parent, I need to approve or reject task completions and reward redemptions.

### 3.2 Child User Stories
- As a child, I want to see my tasks and earn points by completing them.
- As a child, I want to see my points so that I know how many rewards I can get.
- As a child, I want to mark my task as completed for rewards upon getting approved by a parent
- As a child, I want to redeem points for rewards and get parent approval.

## 4. Technical Requirements

### 4.1 Tech Stack
- Frontend: Vue.js with Nuxt 4 framework
  - Modules: nuxt/fonts, nuxt/icon, nuxt/ui
- State Management: Pinia
- Backend: Nuxt 4 (full-stack mode)
- Database: SQLite
- TypeScript: Full TypeScript safety

### 4.2 API Endpoints
- [x] POST /api/auth/login (Passcode authentication)
- [x] GET /api/tasks (Get tasks for children)
- [x] POST /api/tasks (Create tasks for children)
- [x] GET /api/rewards (Get available rewards)
- [x] POST /api/rewards (Create rewards)
- [x] POST /api/rewards/[id]/request_redemption (Request reward redemption)
- [x] POST /api/rewards/[id]/approve_redemption (Approve reward redemption)
- [x] POST /api/rewards/[id]/reject_redemption (Reject reward redemption)
- [x] GET /api/points (Get points for all children)
- [x] POST /api/tasks/[id]/mark_complete (Mark task as completed by child)
- [x] POST /api/tasks/[id]/approve_complete (Approve task completion by parent)
- [x] POST /api/tasks/[id]/reject_complete (Reject task completion by parent)

## 5. Design Requirements

### 5.1 UI/UX Design
- [x] Simple and intuitive user interface
- [x] Responsive design for mobile and desktop
- [x] Clear visibility of points and tasks

### 5.2 Branding
- [x] Simple and child-friendly color scheme
- [x] Appropriate icons and graphics

## 6. Success Metrics
- [x] User satisfaction with the app
- [x] Ease of use for both parents and children
- [x] Number of tasks completed and rewards redeemed

## 7. Timeline
- [x] Phase 1: Research & Planning (1 week)
- [x] Phase 2: Development (4 weeks)
- [x] Phase 3: Testing (1 week)
- [x] Phase 4: Deployment (1 week)

## 8. Risks & Challenges
- [x] Ensuring security with password-based authentication
- [x] Making the app intuitive for children to use
- [x] Handling edge cases in points and rewards management

## 9. Appendices
- [x] Database schema
- [x] API documentation (see docs/api.md)