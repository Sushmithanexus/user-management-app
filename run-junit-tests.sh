#!/bin/bash

# Run JUnit 5 Backend Tests
# Tests UserService, UserController, and Integration tests

set -e

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "JUnit 5 + Spring Boot Test Runner"
echo "========================================="
echo ""

# Navigate to project root
cd /Users/ainexus/Task

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed${NC}"
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# Clean previous build
echo -e "${YELLOW}Cleaning previous build...${NC}"
mvn clean -q

echo ""

# Run tests
echo -e "${YELLOW}Running Backend Tests...${NC}"
echo "========================================="
echo ""

mvn test

EXIT_CODE=$?

echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✅ All backend tests passed!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "Test Summary:"
    echo "  • UserServiceTest: ✅"
    echo "  • UserControllerTest: ✅"
    echo "  • UserManagementIntegrationTest: ✅"
    echo ""
    echo "View detailed report:"
    echo "  mvn surefire-report:report"
    echo "  open target/site/surefire-report.html"
    echo ""
else
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}❌ Some backend tests failed!${NC}"
    echo -e "${RED}=========================================${NC}"
    echo ""
    echo "Check test reports:"
    echo "  target/surefire-reports/"
    echo ""
    echo "Run with verbose output:"
    echo "  mvn test -X"
    echo ""
fi

exit $EXIT_CODE
