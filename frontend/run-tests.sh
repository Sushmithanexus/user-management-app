#!/bin/bash

# E2E Test Runner Script
# This script helps you run Playwright tests easily

echo "========================================="
echo "  User Management E2E Test Runner"
echo "========================================="
echo ""

# Check if backend is running
echo "Checking backend status..."
if curl -s http://localhost:8080/api/auth/signup > /dev/null 2>&1; then
    echo "✅ Backend is running on port 8080"
else
    echo "❌ Backend is NOT running on port 8080"
    echo "Please start the backend first:"
    echo "  cd .. && mvn spring-boot:run"
    exit 1
fi

echo ""
echo "========================================="
echo "Running E2E Tests..."
echo "========================================="
echo ""

# Run tests based on argument
case "$1" in
    "ui")
        echo "Running tests in UI mode..."
        npm run test:e2e:ui
        ;;
    "headed")
        echo "Running tests in headed mode..."
        npm run test:e2e:headed
        ;;
    "debug")
        echo "Running tests in debug mode..."
        npm run test:e2e:debug
        ;;
    "report")
        echo "Opening test report..."
        npm run test:report
        ;;
    *)
        echo "Running tests in headless mode..."
        npm run test:e2e
        ;;
esac

echo ""
echo "========================================="
echo "Test execution completed!"
echo "View report: npm run test:report"
echo "========================================="
