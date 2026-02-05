#!/bin/bash

# Run Backend Tests Only (JUnit5 + Spring Integration)

echo "========================================="
echo "Running Backend Tests (JUnit5 + Spring)"
echo "========================================="
echo ""

cd /Users/ainexus/Task
mvn test

echo ""
echo "✅ Backend tests complete!"
echo ""
