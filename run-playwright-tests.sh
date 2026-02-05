#!/bin/bash

# Run Playwright E2E Tests
# Ensures backend is running before starting tests

set -e

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "Playwright E2E Test Runner"
echo "========================================="
echo ""

# Check if backend is running
echo -e "${YELLOW}Checking if backend is running...${NC}"

if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/auth/signup | grep -q "40"; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not running!${NC}"
    echo ""
    echo "Please start the backend server first:"
    echo "  cd /Users/ainexus/Task"
    echo "  mvn spring-boot:run"
    echo ""
    echo "Wait for 'Started UserManagementApplication' message, then run this script again."
    exit 1
fi

echo ""

# Navigate to frontend directory
cd /Users/ainexus/Task/frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Check if Playwright is installed
if ! npx playwright --version &> /dev/null; then
    echo -e "${YELLOW}Installing Playwright browsers...${NC}"
    npx playwright install
    echo ""
fi

# Run tests
echo -e "${YELLOW}Running Playwright E2E Tests...${NC}"
echo "========================================="
echo ""

npm run test:e2e

EXIT_CODE=$?

echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✅ All E2E tests passed!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "View detailed report:"
    echo "  npm run test:report"
    echo ""
else
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}❌ Some E2E tests failed!${NC}"
    echo -e "${RED}=========================================${NC}"
    echo ""
    echo "To debug:"
    echo "  npm run test:e2e:ui    # Run in interactive mode"
    echo "  npm run test:e2e:debug # Run in debug mode"
    echo ""
fi

exit $EXIT_CODE
