# Internal Development Documentation

This directory contains internal documentation for developers and maintainers of the pulumi-castai provider.

## 🚀 Quick Start for New Sessions

When starting a new Claude Code session, read these documents in order:

### 1. **Current Project State** (Always start here)
- [GAP_ANALYSIS.md](./GAP_ANALYSIS.md) - Current upgrade status, what's done, what's pending
- [SDK_GENERATION_BLOCKER.md](./SDK_GENERATION_BLOCKER.md) - Known blockers and resolutions

### 2. **Testing & Quality**
- [TESTING.md](./TESTING.md) - Comprehensive testing guide (SDK, Provider, Component tests)

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

### TESTING.md
**When to read:** When adding new tests or running tests
**Purpose:** Comprehensive testing guide covering SDK, Provider, and Component tests with test runners and patterns

### Analysis Documents
Additional analysis documents from development:
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `QUICKSTART.md` - Quick start guide
- `SDK_GAPS_ANALYSIS.md` - SDK gap analysis
- `TERRAFORM_EXAMPLE_ANALYSIS.md` - Terraform example analysis

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
   - Adding/running tests? → TESTING.md
   - SDK issues? → SDK_GENERATION_BLOCKER.md
   - Build issues? → MULTI_ARCH_SUPPORT.md
```

## 🔗 Related Documentation

- **Public docs:** `../` (installation, configuration)
- **Publishing docs:** `../publishing/` (release process, NPM publishing)
- **Project root:** `../../README.md` (main project readme)

## 📝 Maintaining These Docs

- **Update GAP_ANALYSIS.md** after major milestones (resources mapped, tests fixed, etc.)
- **Update TESTING.md** when test organization changes or new test runners are added
- **Update CLAUDE.md** at the end of significant sessions to capture decisions/context
- Keep docs current - stale docs are worse than no docs!

---

**Last Updated:** October 27, 2025
**Project Status:**
- v7.73.0 upgrade complete
- SDK tests: 75+ passing (co-located with SDKs)
- Provider tests: passing
- Component tests: 44 passing (98.68% coverage)
- Test runners in place for all test buckets ✅
