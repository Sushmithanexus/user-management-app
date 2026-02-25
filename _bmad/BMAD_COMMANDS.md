# BMAD Method - Installed Commands

## 🎉 Installation Complete!

BMAD v6.0.0-Beta.8 with BMM (BMAD Method Module) is now fully installed in your Spring Boot project!

**Total Commands Available:** 32

---

## 🚀 Quick Start Workflows

### For Small Tasks (Bug Fixes, Features)
```bash
/quick-spec     # Analyze codebase and create implementation-ready spec
/dev-story      # Implement user stories with quality checks
/code-review    # Review code quality and best practices
```

### For Full Projects (Complex Features)
```bash
/product-brief           # Define problem, users, MVP scope
/create-prd              # Full requirements with personas
/create-architecture     # System design and tech decisions
/create-epics-and-stories # Break work into user stories
/sprint-planning         # Initialize sprint tracking
/create-story            # Create detailed user story
/dev-story              # Implement the story
/code-review            # Review implementation
/sprint-status          # Check progress
/retrospective          # Sprint retrospective
```

---

## 🧪 Testing Your Spring Boot App

```bash
/qa              # Generate unit tests for UserService, Controllers, etc.
/qa-agent        # QA agent for test strategy and planning
```

**Example:** Generate tests for your existing code:
```bash
/qa "Add unit tests for UserController REST endpoints"
```

---

## 👥 Specialized Agents

Load expert agents to guide you:

- `/dev` - Developer agent (implementation)
- `/pm` - Product Manager (requirements)
- `/architect` - Architect (system design)
- `/qa-agent` - QA Engineer (testing)
- `/sm` - Scrum Master (agile process)
- `/analyst` - Analyst (research & data)
- `/ux-designer` - UX Designer (user experience)

---

## 📋 Full Command List

### Analysis Phase
- `/product-brief` - Define problem and MVP
- `/research` - Conduct research
- `/generate-project-context` - Generate project docs

### Planning Phase
- `/create-prd` - Create Product Requirements Document
- `/create-ux-design` - Design UX/UI

### Solution Design Phase
- `/create-architecture` - System architecture
- `/create-epics-and-stories` - Break into stories
- `/check-implementation-readiness` - Verify readiness

### Implementation Phase
- `/quick-spec` - Fast spec for small tasks
- `/create-story` - Detailed user story
- `/dev-story` - Implement story
- `/code-review` - Code quality review
- `/sprint-planning` - Plan sprint
- `/sprint-status` - Check progress
- `/retrospective` - Sprint retro

### Quality Assurance
- `/qa` - Test generation
- `/qa-agent` - QA expert agent

---

## 💡 Example: Adding Tests to Your Project

Try this workflow:

1. **Quick Spec:**
   ```bash
   /quick-spec "Add comprehensive unit tests for UserService authentication methods"
   ```

2. **Implement:**
   ```bash
   /dev-story
   ```
   Select the story from the spec

3. **Review:**
   ```bash
   /code-review
   ```

---

## 🎯 For Your User Management App

Since you have a Spring Boot user management application, try:

```bash
/quick-spec "Add integration tests for the complete user registration and login flow"
```

Or:

```bash
/architect "Review the current security architecture and suggest improvements"
```

---

## 📚 Resources

- **GitHub:** https://github.com/bmad-code-org/BMAD-METHOD
- **Docs:** http://docs.bmad-method.org/
- **Discord:** https://discord.gg/gk8jAdXWmj

---

## 🔧 Technical Details

- **Version:** 6.0.0-Beta.8
- **Location:** `/Users/ainexus/Task/_bmad/`
- **Modules:** Core + BMM (BMAD Method Module)
- **IDE:** Claude Code

**Note:** All workflows are now available as slash commands. Type `/` followed by the command name to start any workflow!
