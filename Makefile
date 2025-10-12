# E-Report System Makefile
# Simple commands for development

.PHONY: help install dev build test lint clean

# Default target
help:
	@echo "E-Report System - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install    Install dependencies"
	@echo "  make dev        Start development server"
	@echo "  make build      Build for production"
	@echo "  make test       Run tests"
	@echo "  make lint       Run linting"
	@echo "  make clean      Clean build artifacts"
	@echo ""
	@echo "Database:"
	@echo "  make db-setup   Setup database"
	@echo "  make db-migrate Run database migrations"
	@echo "  make db-seed    Seed database with initial data"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up  Start services with Docker"
	@echo "  make docker-down Stop Docker services"
	@echo "  make docker-logs Show Docker logs"

# Install dependencies
install:
	@echo "Installing frontend dependencies..."
	npm install
	@echo "Installing backend dependencies..."
	cd ../e-report-be && go mod tidy

# Start development server
dev:
	@echo "Starting development server..."
	npm run dev

# Build for production
build:
	@echo "Building application..."
	npm run build

# Run tests
test:
	@echo "Running tests..."
	npm run test

# Run linting
lint:
	@echo "Running linting..."
	npm run lint

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf .next out dist
	cd ../e-report-be && go clean -cache

# Database setup
db-setup:
	@echo "Setting up database..."
	docker-compose up -d postgres
	@echo "Waiting for database..."
	sleep 10
	cd ../e-report-be && go run main.go migrate

# Database migration
db-migrate:
	@echo "Running database migrations..."
	cd ../e-report-be && go run main.go migrate

# Database seed
db-seed:
	@echo "Seeding database..."
	cd ../e-report-be && go run main.go seed

# Docker commands
docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

docker-logs:
	@echo "Showing Docker logs..."
	docker-compose logs -f
