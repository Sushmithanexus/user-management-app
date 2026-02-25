# QA Documentation Index
**Project:** User Management Application
**Version:** 1.0
**Date:** 2026-02-25

---

## Section A: Input Documents (QA Inputs)

| # | Document | Description |
|---|----------|-------------|
| 1 | [Product Vision & Business Requirements](inputs/01-product-vision-business-requirements.md) | Business goals, target users, value propositions, scope |
| 2 | [Feature List / Module List](inputs/02-feature-module-list.md) | All modules, features (F-01 to F-19), and screen routes |
| 3 | [User Stories with Acceptance Criteria](inputs/03-user-stories-acceptance-criteria.md) | US-01 to US-08 with full acceptance conditions |
| 4 | [Functional Specification](inputs/04-functional-specification.md) | Field rules, business logic, authorization rules, error codes |
| 5 | [Non-Functional Requirements](inputs/05-non-functional-requirements.md) | Security, performance, reliability, usability, browser support |
| 6 | [UI/UX Screens](inputs/06-ui-ux-screens.md) | ASCII wireframes for all 5 screens + component style guide |
| 7 | [API Documentation](inputs/07-api-documentation.md) | All 7 REST endpoints with request/response examples |
| 8 | [Data Model Overview](inputs/08-data-model-overview.md) | Entity schema, DTOs, field constraints, business rules |

---

## Section B: Core QA Documents

| # | Document | Description |
|---|----------|-------------|
| 1 | [Test Strategy](core/01-test-strategy.md) | Testing types, tools, environments, automation plan, defect severity |
| 2 | [Test Plan](core/02-test-plan.md) | Scope, approach, entry/exit criteria, risks, sign-off template |
| 3 | [Test Scenarios](core/03-test-scenarios.md) | 60+ high-level scenarios across 11 areas |
| 4 | [Detailed Test Cases](core/04-detailed-test-cases.md) | 21 step-by-step manual test cases with preconditions |
| 5 | [Test Data Specification](core/05-test-data-specification.md) | Standard users, boundary values, API samples, reset procedure |
| 6 | [Traceability Matrix](core/06-traceability-matrix.md) | Requirements → scenarios → manual TCs → Java tests → E2E tests |

---

## Quick Reference

### Run All Automated Tests
```bash
# Java unit + integration tests
mvn test

# E2E Playwright (requires backend + frontend running)
cd frontend && npm run test:e2e
```

### Test Environment Setup
```bash
# Terminal 1 — Backend
mvn spring-boot:run

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### Reset Test Data
```bash
kill $(lsof -t -i:8080) && mvn spring-boot:run
```
