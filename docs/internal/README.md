# Internal Development Documentation

This directory contains internal documentation for developers and maintainers of the pulumi-castai provider.

## 🚀 Quick Start for New Sessions

When starting a new Claude Code session, read these documents in order:

### 1. **Current Project State** (Always start here)
- [GAP_ANALYSIS.md](./GAP_ANALYSIS.md) - Current upgrade status, what's done, what's pending
- [SDK_GENERATION_BLOCKER.md](./SDK_GENERATION_BLOCKER.md) - Known blockers and resolutions

### 2. **Testing & Quality**
- [RESOURCE_TEST_COVERAGE.md](./RESOURCE_TEST_COVERAGE.md) - Test coverage by language and resource
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Testing approach and patterns

### 3. **Architecture & Support**
- [MULTI_ARCH_SUPPORT.md](./MULTI_ARCH_SUPPORT.md) - Multi-architecture build support

### 4. **Session History**
- [CLAUDE.md](./CLAUDE.md) - Previous Claude Code session notes and decisions

## 📋 Document Descriptions

### GAP_ANALYSIS.md
**When to read:** Start of every session
**Purpose:** Understand current state of v7.73.0 upgrade, what resources are mapped, what tests are passing

### SDK_GENERATION_BLOCKER.md
**When to read:** When regenerating SDKs or troubleshooting schema issues
**Purpose:** Documents the terraform-provider-castai v7.x upgrade blockers and how they were resolved

### RESOURCE_TEST_COVERAGE.md
**When to read:** When working on tests or checking test parity
**Purpose:** Detailed breakdown of test coverage across Python/TypeScript/Go

### TESTING_STRATEGY.md
**When to read:** When adding new tests or understanding test patterns
**Purpose:** Testing approach, patterns, and best practices for this provider

### MULTI_ARCH_SUPPORT.md
**When to read:** When working on builds or multi-platform support
**Purpose:** How we support multiple architectures (amd64, arm64) across platforms

### CLAUDE.md
**When to read:** To understand previous decisions and session history
**Purpose:** Notes from Claude Code sessions, decisions made, context about why things were done certain ways

## 💡 Typical Session Start

```bash
# For a new Claude Code session working on this provider:
1. Read GAP_ANALYSIS.md (current state)
2. Read relevant doc based on task:
   - Adding tests? → TESTING_STRATEGY.md
   - SDK issues? → SDK_GENERATION_BLOCKER.md
   - Coverage questions? → RESOURCE_TEST_COVERAGE.md
```

## 🔗 Related Documentation

- **Public docs:** `../` (installation, configuration)
- **Publishing docs:** `../publishing/` (release process, NPM publishing)
- **Project root:** `../../README.md` (main project readme)

## 📝 Maintaining These Docs

- **Update GAP_ANALYSIS.md** after major milestones (resources mapped, tests fixed, etc.)
- **Update RESOURCE_TEST_COVERAGE.md** when test counts change
- **Update CLAUDE.md** at the end of significant sessions to capture decisions/context
- Keep docs current - stale docs are worse than no docs!

---

**Last Updated:** October 25, 2024
**Project Status:** v7.73.0 upgrade complete, 112/112 tests passing ✅
