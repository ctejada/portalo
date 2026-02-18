# Portalo Implementation Guide

## How to Resume Work (For Any LLM Session)

If you are starting a new session or have lost context, follow these steps:

### 1. Get Context

Read these files in order:

1. `docs/PORTALO_PROGRESS.md` — Current progress, which commits are done
2. `docs/PORTALO_IMPLEMENTATION_PLAN.md` — Full 160-commit roadmap with file paths and test requirements
3. `docs/portalo_build_spec.md` — Detailed technical spec (design system, database schema, API endpoints, component specs)
4. `docs/portalo_implementation_design.md` — Architecture decisions, tech stack rationale
5. `docs/portalo_mvp_plan_converted.md` — Business plan, feature matrix, pricing
6. `docs/portalo_ai_agent_addendum_converted.md` — AI-agent-first architecture, MCP server strategy

### 2. Determine Where to Continue

- Check `docs/PORTALO_PROGRESS.md` for the last checked-off `[x]` commit
- Cross-reference with `git log --oneline -10` to confirm the last pushed commit
- The next unchecked `[ ]` commit in the progress file is where you start

### 3. Standard Workflow for Each Commit

For every commit in the implementation plan, follow this exact process:

```
a) Implement the code changes described for that commit
   - Refer to PORTALO_IMPLEMENTATION_PLAN.md for file paths and test requirements
   - Refer to portalo_build_spec.md for detailed component/API specs
   - Follow existing code patterns (check sibling files for style conventions)

b) Verify the changes work
   - `pnpm build` should pass
   - `pnpm lint` should pass

c) Update docs/PORTALO_PROGRESS.md:
   - Check off the commit: change `[ ]` to `[x]`
   - Update the sprint progress bar numbers
   - If all commits in a milestone are done, mark the milestone as [x] Complete
   - Add an entry to the "Recent Activity" table

d) Stage all relevant files + the progress file:
   - `git add <changed files> docs/PORTALO_PROGRESS.md`

e) Commit with a descriptive message (NO "Claude", "Co-Authored-By", or AI attribution):
   - `git commit -m "Add <what was done>"`

f) Push immediately:
   - `git push`
```

### 4. Key Rules

- **API-first**: Build REST API endpoints before GUI components
- **No over-engineering**: Only implement what the commit specifies
- **Commit messages**: Concise, descriptive, NO AI attribution anywhere
- **One commit = one logical unit**: Don't combine multiple plan commits into one git commit
- **Always update progress**: `docs/PORTALO_PROGRESS.md` is part of every commit
- **Test before committing**: `pnpm build` and `pnpm lint` must pass
