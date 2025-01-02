# JA Stays Technology Stack

## Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Router**: React Router v6 (HashRouter for mobile)
- **Styling**: CSS Modules + Global CSS
- **State Management**: React Hooks

## Mobile App

- **Framework**: Capacitor
- **Platform**: Android
- **WebView**: Modern WebView with:
  - Hardware acceleration
  - Image caching (Glide)
  - File access handling
  - DOM storage
  - Modern web features
- **Dependencies**:
  - androidx.webkit
  - Glide for image loading
  - OkHttp for networking

## Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: RESTful endpoints
- **Database**: In-memory store (to be replaced with MongoDB)

## AI Services

- **Property Matching**: Custom algorithm with weighted scoring
  - Location scoring (40% weight)
  - Price scoring (30% weight)
  - Amenities scoring (30% weight)
  - Date availability filtering
  - Perfect match detection
- **Dynamic Pricing**: AI-powered pricing model
- **Chatbot**: Basic implementation (to be enhanced)

## Development Tools

- **Language**: TypeScript 5.0+
- **Package Manager**: npm
- **Code Quality**:
  - ESLint with Airbnb config
  - Prettier
  - TypeScript strict mode
- **Testing**:
  - Jest for unit testing (90%+ coverage)
  - React Testing Library
  - Cypress for E2E testing (planned)
  - Babel for test file transformation

## Build & Deployment

- **Web Bundler**: Vite
- **Mobile Build**: Android Studio + Gradle
- **Development Server**: Vite Dev Server
- **API Proxy**: Vite proxy configuration
- **Static Files**: Public directory for images
- **Mobile Assets**: Android resource directories

## Project Structure

```text
ja-stays/
├── src/                # Web source code
│   ├── api/           # API service layer
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── services/      # Business logic & AI
│   │   └── ai/        # AI algorithms
│   ├── models/        # TypeScript types
│   └── lib/          # Utilities
├── android/          # Android app
│   ├── app/          # Android application
│   │   ├── src/      # Android source
│   │   └── res/      # Android resources
│   └── gradle/       # Gradle configuration
├── public/           # Static assets
├── tests/           # Test files
└── docs/            # Documentation
```

## Code Style Guidelines

- Airbnb JavaScript/TypeScript Style Guide
- CSS Modules for component styling
- BEM methodology for class naming
- Responsive design principles
- Mobile-first approach

## Browser & Platform Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Android WebView (API 22+)
- No IE11 support

## Performance Considerations

- Code splitting with React.lazy()
- Image optimization
- Lazy loading for images
- CSS Modules for scoped styling
- Minimal bundle size
- Mobile hardware acceleration
- Efficient caching strategies

## Security

- Input validation
- CORS configuration
- Secure payment handling (planned)
- User authentication (planned)
- File access permissions
- WebView security configuration

## Monitoring & Analytics (Planned)

- Error tracking
- Performance monitoring
- User analytics
- A/B testing capability
- Mobile app analytics

## Future Considerations

- GraphQL implementation
- Server-side rendering
- Progressive Web App features
- Internationalization support
- Accessibility improvements
- iOS support
- Offline capabilities

## Testing Strategy

- Unit tests with Jest (90%+ coverage)
- Component tests with React Testing Library
- Integration tests for AI services
- End-to-end tests with Cypress (planned)
- Mobile app testing
- Continuous testing in CI/CD pipeline
