# initialxy-points (Work in Progress)

A simple web app that helps track points earned by my kids and allows them to redeem points for rewards.
I wanted to play with fully local vibe coding on my Radeon RX 7900 XTX. So I will try to generate as much code with local LLMs as possible. But don't worry, I'm a prideful software engineer. I will review every line of code to ensure it meets my expectations exactly. Though it is currently completely broken, so don't bother using it.

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

- Passcode-based authentication for parents and children
- Task management system for parents to assign tasks to children
- Reward system with point values
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

1. **Register Users**: Start by registering parent and child users through the application interface.
2. **Parent Dashboard**: Parents can create tasks and rewards, view children's points.
3. **Child Dashboard**: Children can view their tasks, and track their points.
4. **API Access**: Developers can interact with the application's functionality through the REST API.

## API Documentation

For detailed information about the available API endpoints, request/response formats, and authentication, see the [API Documentation](docs/api.md).


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.