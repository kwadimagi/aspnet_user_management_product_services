# Fullstack ASP.NET Core + React Application

This is a production-grade fullstack application featuring ASP.NET Core backend with Entity Framework and React frontend with TypeScript, incorporating modern development practices.

## Features

- **Backend**: ASP.NET Core API with Entity Framework Core, JWT Authentication, and Identity
- **Frontend**: React with TypeScript, React Router, React Query, Zustand, Zod, and React Hook Form
- **Database**: PostgreSQL (with Entity Framework Core)
- **Authentication**: JWT-based authentication with role-based authorization
- **Security**: Input validation, exception handling, and proper error responses
- **State Management**: Zustand for global state, React Query for server state
- **Validation**: Zod for schema validation, React Hook Form for form management
- **Docker**: Containerized with PostgreSQL and optimized Dockerfiles

## Prerequisites

- .NET 8 SDK
- Node.js 18+
- PostgreSQL (or Docker for containerization)
- Docker and Docker Compose

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd WebApplication1/WebApplication1
```

2. Update the database connection string in `appsettings.json` if needed

3. Run database migrations:
```bash
dotnet ef database update
```

4. Run the application:
```bash
dotnet run
```

The API will be available at `https://localhost:7000` and `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd WebApplication1/client-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the API URL:
```env
REACT_APP_API_URL=https://localhost:7000/api
```

4. Start the development server:
```bash
npm start
```

The React app will be available at `http://localhost:3000`

## Modern Enhancements

### Frontend Architecture
- **React Query**: Server state management with caching, background updates, and optimistic updates
- **Zustand**: Lightweight global state management for client state
- **Zod**: Schema validation for forms and API responses
- **React Hook Form**: Performant, flexible forms with easy validation
- **TypeScript**: Full type safety across the application

### Backend Architecture
- **PostgreSQL**: Production-ready database with better performance
- **Entity Framework Core**: Strongly typed data access with LINQ
- **JWT Authentication**: Secure token-based authentication
- **Custom Exceptions**: Better error handling architecture
- **Middleware**: Global exception handling and security

### API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `PUT /api/auth/changepassword` - Change user password (requires authentication)

### Products
- `GET /api/products` - Get all active products (no auth required)
- `GET /api/products/{id}` - Get a specific product (no auth required)
- `POST /api/products` - Create a new product (requires authentication)
- `PUT /api/products/{id}` - Update an existing product (requires authentication)
- `DELETE /api/products/{id}` - Delete a product (requires authentication, soft delete)

## Running with Docker

1. Build and run the services:
```bash
docker-compose up --build
```

2. The API will be available at `http://localhost:8080`
3. The PostgreSQL database will be available at `localhost:5432`
4. The React app will be available at `http://localhost:3000`

## Testing

### Backend Tests
```bash
cd WebApplication1/WebApplication1
dotnet test
```

### Frontend Tests
```bash
cd WebApplication1/client-app
npm test
```

## Deployment

### Azure DevOps Pipeline

The project includes an Azure DevOps pipeline configuration (`azure-pipelines.yml`) that:
1. Builds and tests both backend and frontend
2. Creates Docker images
3. Pushes images to Azure Container Registry
4. Deploys to Azure App Service

### Docker Deployment

A `docker-compose.yml` file is included for containerized deployment with all services (API, PostgreSQL database, and client) orchestrated together.

## Security Considerations

- JWT tokens are used for authentication with a 3-hour expiration
- Passwords are hashed and salted using ASP.NET Core Identity
- Input validation is implemented on both frontend and backend using Zod
- SQL injection is prevented through Entity Framework parameterization
- CORS is configured appropriately for security

## Architecture

- **Backend**: Clean architecture with separation of concerns (Controllers, Services, Data Access)
- **Frontend**: Component-based architecture with React Query for server state and Zustand for local state
- **Database**: PostgreSQL with Code-first Entity Framework with migrations
- **Authentication**: JWT with refresh tokens
- **API Design**: RESTful endpoints following standard conventions

## Performance Optimizations

- React Query provides caching, background updates, and optimistic updates
- Zustand provides efficient global state management
- PostgreSQL configured for production performance
- HTTP request interception for authentication headers
- Component-based design for React with proper state management