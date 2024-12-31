# JA Stays

A proprietary vacation rental platform for Jamaica, featuring AI-powered property matching and an Airbnb-inspired user experience. While this repository is publicly visible, it is protected by copyright law and is not open source.

## Copyright Notice

© 2024 JA Stays. All rights reserved.

This repository is made public for reference and educational purposes only. The source code, documentation, design, and all other materials are proprietary and protected by copyright law. No permissions are granted for commercial use, modification, or distribution without explicit written permission from the copyright holder.

## Features

- 🏠 Browse Jamaican vacation rentals
- 🔍 AI-powered property matching
- 💰 Dynamic pricing system
- 📱 Responsive design
- 🔐 Secure booking system
- 🤖 Customer support chatbot

## Tech Stack

- Frontend: React 18 + TypeScript
- Backend: Node.js + Express
- Build Tool: Vite
- Styling: CSS Modules
- Testing: Jest
- AI Services: Custom TypeScript implementations

## Project Structure

```
ja-stays/
├── src/
│   ├── api/           # API service layer
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── services/      # Business logic & AI
│   ├── models/        # TypeScript types
│   └── lib/          # Utilities
├── public/           # Static assets
├── tests/           # Test files
└── docs/            # Documentation
```

## Documentation

- [Project Roadmap](docs/roadmap.md)
- [Technical Documentation](cline_docs/techStack.md)
- [Codebase Summary](cline_docs/codebaseSummary.md)
- [Current Tasks](cline_docs/currentTask.md)

## Development Setup

For authorized developers only. Please ensure you have signed the necessary agreements before proceeding.

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development servers:
```bash
# Start both frontend and backend
npm run dev

# Start frontend only
npm run frontend

# Start backend only
npm run dev:backend
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:3000.

### Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

### Code Style

The project follows the Airbnb JavaScript Style Guide. Code formatting is handled by Prettier and ESLint.

## Legal Notice

This software is proprietary and protected by copyright law. While the code is publicly visible, no license is granted for its use, modification, or distribution without explicit written permission from JA Stays. For licensing inquiries or business opportunities, please contact the copyright holder.

## Acknowledgments

- Property matching algorithm inspired by Einstein's problem-solving approach
- Jamaican tourism board for destination information
