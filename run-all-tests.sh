#!/bin/bash

# Run All Tests - Backend + Frontend E2E
# Author: Test Automation Script
# Date: 2026-02-05

set -e  # Exit on error

echo "========================================="
echo "Running All Tests"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed${NC}"
    exit 1
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed${NC}"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# Step 1: Backend Unit + Integration Tests
echo -e "${YELLOW}Step 1/3: Running Backend Tests (JUnit5 + Spring)${NC}"
echo "========================================="
cd /Users/ainexus/Task
mvn test
BACKEND_EXIT_CODE=$?

if [ $BACKEND_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}❌ Backend tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Backend tests passed!${NC}"
fi

echo ""

# Step 2: Start Backend Server
echo -e "${YELLOW}Step 2/3: Starting Backend Server${NC}"
echo "========================================="
mvn spring-boot:run > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 30

# Check if backend is running
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/auth/signup | grep -q "40"; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo ""

# Step 3: Frontend E2E Tests (All Devices)
echo -e "${YELLOW}Step 3/3: Running Frontend E2E Tests (Desktop + Mobile + Tablet)${NC}"
echo "========================================="
cd /Users/ainexus/Task/frontend
npm run test:e2e:all-devices
E2E_EXIT_CODE=$?

# Cleanup: Stop backend server
echo ""
echo "Stopping backend server..."
kill $BACKEND_PID 2>/dev/null || true
sleep 2

if [ $E2E_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}❌ E2E tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ E2E tests passed!${NC}"
fi

# Final Summary
echo ""
echo "========================================="
echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
echo "========================================="
echo ""
echo "Test Summary:"
echo "  • Backend Unit Tests: ✅ Passed"
echo "  • Backend Integration Tests: ✅ Passed"
echo "  • Desktop E2E Tests: ✅ Passed"
echo "  • Mobile E2E Tests (iOS): ✅ Passed"
echo "  • Mobile E2E Tests (Android): ✅ Passed"
echo "  • Tablet E2E Tests: ✅ Passed"
echo ""
echo "View detailed report: cd frontend && npm run test:report"
echo ""

exit 0
