# Tech Context: Smart Daily Planner

## Technology Stack

### Frontend

- **React 19.1.1**: Latest React with modern features and optimizations
- **TypeScript 5.8.3**: Type safety and enhanced developer experience
- **Vite 7.1.0**: Fast development server and optimized builds
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development (mentioned in README)

### Development Tools

- **ESLint 9.32.0**: Code linting with React-specific rules
- **TypeScript ESLint 8.39.0**: Enhanced TypeScript linting
- **Vite React Plugin 4.7.0**: Optimized React development experience

### Planned Backend (from README)

- **Node.js/Express**: RESTful API server
- **Supabase**: PostgreSQL database with real-time features
- **Authentication**: User management through Supabase Auth

## Development Environment

### Package Manager

- **npm**: Using npm for dependency management
- **Node.js**: Version 18+ required (as specified in README)

### Build Configuration

- **Module Type**: ES modules (`"type": "module"` in package.json)
- **TypeScript Config**: Multiple config files for different build targets
  - `tsconfig.json`: Base configuration
  - `tsconfig.app.json`: Application-specific settings
  - `tsconfig.node.json`: Node.js specific settings

### Available Scripts

- `npm run dev`: Start development server with Vite
- `npm run build`: TypeScript compilation + Vite production build
- `npm run lint`: Run ESLint for code quality
- `npm run preview`: Preview production build locally

## Project Structure

### Current Structure

```
smart-daily-planner/
├── public/                 # Static assets
├── src/
│   ├── App.tsx            # Main App component (minimal implementation)
│   ├── App.css            # App-specific styles
│   ├── index.css          # Global styles
│   ├── main.tsx           # Application entry point
│   └── vite-env.d.ts      # Vite type definitions
├── memory-bank/           # Memory bank documentation
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.*.json        # TypeScript configurations
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

### Planned Structure (from README)

```
src/
├── components/            # Reusable React components
├── pages/                # Page components
├── hooks/                # Custom React hooks
├── services/             # API service functions
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── App.tsx               # Main App component
└── main.tsx              # Application entry point
```

## Technical Decisions

### Framework Choices

- **React 19**: Latest features, improved performance, modern patterns
- **TypeScript**: Type safety essential for maintainable codebase
- **Vite**: Superior DX compared to Create React App, faster builds
- **Tailwind**: Utility-first approach for rapid UI development

### Architecture Patterns

- **Component-based**: React functional components with hooks
- **Type-safe**: Full TypeScript coverage throughout application
- **Modern ES**: ES modules, async/await, modern JavaScript features
- **RESTful API**: Simple HTTP-based communication with backend

## Development Setup

### Prerequisites

- Node.js v18+
- npm package manager
- Supabase account (for backend integration)

### Environment Variables (Planned)

- Supabase URL and API keys
- Environment-specific configurations
- API endpoints configuration

### Code Quality

- **ESLint**: Enforcing code standards and React best practices
- **TypeScript**: Compile-time type checking
- **React Hooks Rules**: ESLint plugin for React hooks patterns
- **React Refresh**: Hot reloading during development

## Technical Constraints

### Performance Requirements

- Fast initial load times (< 3 seconds)
- Responsive UI interactions (< 100ms)
- Efficient bundle sizes
- Optimal Vite build configuration

### Browser Support

- Modern browsers (ES2015+ support)
- Mobile responsive design
- Cross-platform compatibility

### Data Management

- Real-time synchronization with Supabase
- Offline-first considerations for core functionality
- Efficient state management patterns

## Integration Points

### Planned Integrations

- **Supabase**: Database, authentication, real-time subscriptions
- **AI Services**: For intelligent task suggestions and analytics
- **Calendar APIs**: Google Calendar, Outlook integration
- **Notification Services**: Browser notifications, push notifications

### API Design

- RESTful endpoints for CRUD operations
- Real-time WebSocket connections for live updates
- Authentication middleware for secure access
- Rate limiting and error handling

## Development Workflow

### Current State

- Basic React app setup with "hedllo" placeholder
- Full TypeScript configuration ready
- ESLint configured for code quality
- Vite development environment operational

### Next Steps

1. Set up Tailwind CSS integration
2. Create basic component structure
3. Implement core UI components
4. Set up Supabase integration
5. Implement authentication system
6. Build task management features
7. Add AI integration capabilities

## Security Considerations

### Frontend Security

- Input validation and sanitization
- XSS prevention through React's built-in protections
- HTTPS enforcement in production
- Environment variable protection

### Backend Security (Planned)

- JWT authentication through Supabase
- API rate limiting
- Data validation at API layer
- SQL injection prevention through ORM/query builder
