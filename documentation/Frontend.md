# Frontend Documentation

Complete documentation for the GameHub Platform micro-frontend architecture.

## Architecture

Micro-frontend architecture orchestrated by Single-SPA. React and Angular applications deployed independently.

## Technology Stack

- Single-SPA, React 19, Angular 21, TypeScript, Vite, Tailwind CSS
- ESLint, Prettier, Vitest, Jest

## Project Structure

```
frontend/
├── shell/                    # Single-SPA root config
│   └── index.html           # Application shell
├── react-child-app/         # React micro-frontend
│   └── P3-react-child-app/
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── api/         # API client code
│       │   ├── contexts/   # React contexts
│       │   └── utils/      # Utility functions
│       └── package.json
└── angular-child-app/       # Angular micro-frontend
    └── angular-child-app/
        ├── src/
        │   └── app/
        │       └── components/
        └── package.json
```

## React Micro-Frontend

### Overview

The React MFE is the main application interface, handling game browsing, user profiles, community features, and more.

**Port**: 3000  
**Build Tool**: Vite  
**Framework**: React 19

### Key Components

- `GamesDashboard.tsx` - Games catalog with search, filtering, pagination
- `GameProfile.tsx` - Game detail page with reviews and purchase options
- `Cart.tsx` - Shopping cart management (uses CartContext)
- `Wishlist.tsx` - User wishlist management
- `CommunityHub.tsx` - Community threads and posts
- `Profile.tsx` - User profile, library, friends, rewards
- `TokenStore.tsx` - Virtual currency purchase
- `UploadGame.tsx` - Game upload for developers

### API Integration

- `api/http.ts` - Centralized HTTP client with interceptors and token management
- `api/games.ts` - Game API: `getGames()`, `getGame(id)`, `purchaseGame(gameId)`, `addToWishlist(gameId)`
- `utils/userApi.tsx` - User API: `getUser(id)`, `updateProfile(id, data)`, `getLibrary(id)`, `getFriends(id)`

### State Management

- `CartContext` - Global shopping cart state
- User Context - Authentication and profile state

### Routing

React Router: `/` (GamesDashboard), `/game/:id`, `/cart`, `/wishlist`, `/community`, `/profile/:id`, `/tokens`, `/upload`

### Styling

Tailwind CSS used throughout.

### Environment Configuration

`.env` file:
```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```

## Angular Micro-Frontend

### Overview

The Angular MFE handles authentication and account management.

**Port**: 4200  
**Framework**: Angular 21

### Key Components

- `login/` - Authentication interface
- `create-account/` - User registration
- `landing-page/` - Landing page

### Routing

Angular Router: `''` (LandingPage), `'login'`, `'register'`

### Services

- AuthService - Authentication logic: `login()`, `logout()`, `isAuthenticated()`

### Styling

Tailwind CSS

## Single-SPA Integration

Root config at `frontend/shell/index.html` orchestrates micro-frontends. React app active on `/games`, `/cart`, `/profile`. Angular app active on `/login`, `/register`.

### Inter-MFE Communication

- Custom Events: `window.dispatchEvent(new CustomEvent('user-logged-in', { detail: {...} }))`
- Shared State: Utility module for cross-application state

## Development

**React MFE**: `cd frontend/react-child-app/P3-react-child-app && npm install && npm run dev`  
**Angular MFE**: `cd frontend/angular-child-app/angular-child-app && npm install && npm start`  
**Build**: `npm run build`  
**Test**: `npm test`

## Responsive Design

Tailwind breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)

## Security

- Token storage: httpOnly cookies or secure storage
- XSS prevention: sanitize user input
- CSRF protection: implement CSRF tokens
- Content Security Policy: configure CSP headers
- HTTPS in production

## Deployment

Dockerfile uses `node:18-alpine`, builds with `npm run build`, exposes port 3000.

Production environment variables:
```env
VITE_API_URL=https://api.gamehub.example.com
VITE_WS_URL=wss://api.gamehub.example.com
```

## Troubleshooting

- CORS Errors: Check API Gateway CORS configuration
- Routing Issues: Verify Single-SPA activeWhen paths
- Build Errors: Clear node_modules and reinstall
- Type Errors: Run TypeScript compiler check


