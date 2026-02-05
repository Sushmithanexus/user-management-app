#!/bin/bash

# Run Frontend E2E Tests Only
# Requires backend to be running on port 8080

echo "========================================="
echo "Running Frontend E2E Tests"
echo "========================================="
echo ""

# Check if backend is running
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/auth/signup | grep -q "40"; then
    echo "❌ Error: Backend is not running!"
    echo "Please start backend first: mvn spring-boot:run"
    exit 1
fi

echo "✅ Backend is running"
echo ""

cd /Users/ainexus/Task/frontend
npm run test:e2e:all-devices

echo ""
echo "✅ E2E tests complete!"
echo "View report: npm run test:report"
echo ""
