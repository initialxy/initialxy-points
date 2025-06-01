# initialxy-points

A simple web app that helps track points earned by kids and allows them to redeem points for rewards.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

initialxy-points is designed to help parents track their kids' progress through tasks and rewards. It features a simple, intuitive interface for both parents and kids.

## Features

- Passcode-based authentication for parents and kids
- Task management system for parents to assign tasks to kids
- Reward system with point values
- Wishlist functionality for kids to request rewards
- Points tracking and visibility
- Responsive design for mobile and desktop

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Usage

1. **Register Users**: Start by registering parent and kid users through the application interface.
2. **Parent Dashboard**: Parents can create tasks and rewards, view kids' points, and manage wishlist items.
3. **Kid Dashboard**: Kids can view their tasks, submit wishlist items, and track their points.
4. **API Access**: Developers can interact with the application's functionality through the REST API.

## API Documentation

For detailed information about the available API endpoints, request/response formats, and authentication, see the [API Documentation](docs/api.md).


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.