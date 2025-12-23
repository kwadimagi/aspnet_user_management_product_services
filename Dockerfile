# Multi-stage build for ASP.NET Core Backend + React Frontend
# Stage 1: Build React frontend
FROM node:18-alpine as react-build
WORKDIR /app

# Copy React app files
COPY WebApplication1/client-app/package*.json ./
RUN npm ci --only=production

COPY WebApplication1/client-app/ ./
RUN npm run build

# Stage 2: Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /app

# Copy the solution and project files
COPY WebApplication1/WebApplication1.csproj ./WebApplication1/
WORKDIR /app/WebApplication1
RUN dotnet restore

# Copy everything else and build
WORKDIR /app
COPY . .
# Copy built React app to wwwroot
COPY --from=react-build /app/build /app/WebApplication1/wwwroot
WORKDIR /app/WebApplication1
RUN dotnet publish -c Release -o /app/out

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Expose port (Render will set PORT environment variable)
EXPOSE 80

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup
USER appuser

ENTRYPOINT ["dotnet", "WebApplication1.dll"]