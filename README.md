# 📚 Nord Security Homework

A React TypeScript application with login, logout and servers list page.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind
- React Query
- React Router
- Vitest
- MSW (API mocking)
- ESLint

## Features

- Responsive design with Tailwind
- Authentication system with login form, logout and protected routes
- Sortable table with server list

## Future Enhancements

### User Experience

- Enhance data visualization with interactive charts and country flags
- Implement loading state indicators and skeleton screens for better feedback
- Add more interactive elements for better user engagement

### Security & Authentication

- Implement JWT-based authentication with access and refresh token mechanism
- Expand test coverage with integration and end-to-end tests

### Performance Optimization

- Implement pagination for efficient data loading
- Self-host fonts to reduce external dependencies
- Add client-side caching strategies

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/components/ui` - Design system components
  - `/modules` - Feature-based modules (e.g., Auth)
  - `/lib` - Utility functions and constants
  - `/styles` - Global styles and Tailwind CSS configuration

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=your_api_url_here
```

## Installation

```bash
pnpm install
```

## Development

To start the development server:

```bash
pnpm dev
```

This will start the development server at `http://localhost:5173` (or another available port if 5173 is in use).

## Testing

The project uses Vitest and React Testing Library for testing. To run tests:

```bash
pnpm test
```

## Building for Production

To create a production build:

```bash
pnpm build
```

This will:

1. Run TypeScript compilation
2. Create an optimized production build in the `dist` directory

To preview the production build locally:

```bash
pnpm preview
```
